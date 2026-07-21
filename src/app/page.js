import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';
import Testimonial from '@/models/Testimonial';
import Content from '@/models/Content';
import HeroSection from './components/HeroSection';
import SelectedWorks from './components/SelectedWorks';
import AllWorkScatter from './components/AllWorkScatter';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import { projects as fallbackProjects } from './data/projects';

async function getHomeData() {
  try {
    await dbConnect();

    const projects = await Project.find({}).sort({ createdAt: -1 }).lean();
    const testimonials = await Testimonial.find({}).sort({ order: 1 }).lean();
    const rawContent = await Content.find({ page: 'home' }).lean();

    const content = {};
    rawContent.forEach(item => {
      if (!content[item.section]) content[item.section] = {};
      content[item.section][item.key] = item.value;
    });

    return {
      projects: JSON.parse(JSON.stringify(projects)),
      testimonials: JSON.parse(JSON.stringify(testimonials)),
      content: JSON.parse(JSON.stringify(content))
    };
  } catch (error) {
    console.error('Home data fallback:', error.message);
    return {
      projects: fallbackProjects.map((project, index) => ({
        ...project,
        _id: project.id,
        isFeatured: index < 3,
      })),
      testimonials: [],
      content: {
        hero: {
          title: 'Driven by History, Centered on Context,<br/>Embracing Culture',
          subtitle: 'Architecture & Interior Design Studio',
          videoUrl: '/videos/luxury-interior.mp4',
        },
      },
    };
  }
}

export default async function Home() {
  // Middleware handles access restriction — if we reach here, user has access
  const { projects, testimonials, content } = await getHomeData();

  return (
    <main>
      <HeroSection content={content.hero} />
      <SelectedWorks projects={projects.filter(p => p.isFeatured)} />
      <AllWorkScatter projects={projects} content={content['all-works']} />
      <Testimonials testimonials={testimonials} content={content.testimonials} />
      <Footer content={content.footer} />
    </main>
  );
}
