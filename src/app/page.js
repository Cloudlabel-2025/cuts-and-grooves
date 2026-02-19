import HeroSection from './components/HeroSection';
import SelectedWorks from './components/SelectedWorks';
import AllWorkScatter from './components/AllWorkScatter';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <SelectedWorks />
      <AllWorkScatter />
      <Testimonials />
      <Footer />
    </main>
  );
}
