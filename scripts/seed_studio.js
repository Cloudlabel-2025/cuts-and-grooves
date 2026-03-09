const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const ContentSchema = new mongoose.Schema({
    page: String,
    section: String,
    key: String,
    value: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

const Content = mongoose.models.Content || mongoose.model('Content', ContentSchema);

const teamMembers = [
    { name: "Morgan Jenkins", role: "Director", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80" },
    { name: "Clara Mcdonald", role: "Associate", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80" },
    { name: "Ethan Hunt", role: "Senior Architect", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80" },
    { name: "Sarah Connor", role: "Interior Designer", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80" },
    { name: "John Wick", role: "Graduate Architect", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80" },
];

const visionItems = [
    {
        title: "Design Integrity",
        text: "Our design aesthetic is established through a consistent process and a detailed concept brief, which considers client needs, site context, and the future occupiers. We combine and test these elements to create a singular design vision concealing many influencing layers. This singular vision, like a piece of artwork, is unique and individual. We believe the principles of design quality should always be present no matter the project brief or building scale.",
        image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=1200&q=80"
    },
    {
        title: "Innovation",
        text: "Cuts and Grooves embraces innovation as a disciplined pursuit, grounded in research and informed by evolving technology. We challenge conventions, explore new methodologies, and contribute fresh thinking to the built environment.Technology is integral to our process — a powerful tool that sharpens precision and expands possibility. Yet creativity remains human at its core. Insight, intuition, and critical thinking guide every decision we make.",
        image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=80"
    },
    {
        title: "Enhanced Living",
        text: "We believe enhanced user experience and well-being should be at the forefront of design. We constantly consider the impact of design on the end user to ensure our designs promote positive human interaction and encourage healthier, enriched experiences.",
        image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80"
    }
];

const awards = [
    {
        year: "2025",
        items: [
            { project: "PNG Waterfront Residences", contest: "Architizer Vision Awards", distinction: "Vision for Localism: Finalist" },
            { project: "Ormond House", contest: "Houses Awards", distinction: "House Alteration and Addition over 200sqm: Shortlisted" }
        ]
    },
    {
        year: "2024",
        items: [
            { project: "The Saint Hotel", contest: "Australian Interior Design Awards", distinction: "Hospitality Design: Shortlisted" },
            { project: "The Saint Hotel", contest: "Eat Drink Design Awards", distinction: "Best Restaurant design" }
        ]
    }
];

const jobOffers = [
    {
        title: "Graduate Architect",
        type: "Full-time",
        location: "Melbourne"
    },
    {
        title: "Interior Designer",
        type: "Full-time",
        location: "Melbourne"
    }
];

const studioContent = [
    { page: 'studio', section: 'narrative', key: 'heading', value: 'Cuts & Grooves is a India based architecture & interior design studio.' },
    { page: 'studio', section: 'narrative', key: 'quote', value: '“Each project embodies the vision and expertise of our designers — transforming ideas into purposeful, enduring spaces.”' },
    { page: 'studio', section: 'narrative', key: 'valuesText', value: 'We deliver a highly personalised service with direct involvement at every stage of the project.Our work is grounded in a deep understanding of context, client priorities, and user experience — ensuring each building is purposeful, enduring, and relevant over time.' },
    { page: 'studio', section: 'team', key: 'members', value: teamMembers },
    { page: 'studio', section: 'vision', key: 'items', value: visionItems },
    { page: 'studio', section: 'awards', key: 'items', value: awards },
    { page: 'studio', section: 'careers', key: 'jobs', value: jobOffers },
    { page: 'studio', section: 'careers', key: 'heading', value: 'We are looking for motivated, curious and dedicated talent who want to contribute to our growth while sharing our values.' }
];

async function seedStudio() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);

        console.log('Seeding studio content...');
        for (const item of studioContent) {
            await Content.findOneAndUpdate(
                { page: item.page, section: item.section, key: item.key },
                item,
                { upsert: true, new: true }
            );
        }

        console.log('Studio content seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding studio content:', error);
        process.exit(1);
    }
}

seedStudio();
