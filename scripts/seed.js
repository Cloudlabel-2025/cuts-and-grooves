const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

// Models
const ProjectSchema = new mongoose.Schema({
    title: String, slug: String, category: String, year: String, location: String,
    mainImage: String, gallery: [String], description: String, isFeatured: Boolean
});
const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

const UserSchema = new mongoose.Schema({ email: String, password: String, role: String });
const User = mongoose.models.User || mongoose.model('User', UserSchema);

const ContentSchema = new mongoose.Schema({
    page: String, section: String, key: String, value: String, type: String
});
const Content = mongoose.models.Content || mongoose.model('Content', ContentSchema);

const TestimonialSchema = new mongoose.Schema({
    quote: String, author: String, role: String, order: Number
});
const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);

const initialProjects = [
    {
        slug: 'the-grand-pavilion',
        title: 'The Grand Pavilion',
        category: 'Residential',
        year: '2025',
        location: 'Theni, India',
        mainImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=80'
        ],
        description: 'A masterpiece of contemporary living, blending luxury with natural elements.'
    },
    {
        slug: 'urban-sanctuary',
        title: 'Urban Sanctuary',
        category: 'Commercial',
        year: '2024',
        location: 'Chennai, India',
        mainImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
        ],
        description: 'An architectural statement in the heart of the city, focusing on light and space.'
    }
];

const initialTestimonials = [
    {
        quote: "Every space unfolds with intention. What once was an empty plot is now a home that reflects our values, our lifestyle, and our story.",
        author: "Kavin Kumar",
        role: "Private Client",
        order: 1
    },
    {
        quote: "What impressed us most was not just the design excellence, but the strategic thinking behind every decision. The result is a statement of who we are.",
        author: "Balaji BM",
        role: "CEO, TechFlow",
        order: 2
    }
];

const initialContent = [
    { page: 'home', section: 'hero', key: 'title', value: 'We Make Your Livin\' Better', type: 'text' },
    { page: 'home', section: 'hero', key: 'subtitle', value: 'Architectural Excellence & Interior Innovation', type: 'text' },
    { page: 'home', section: 'hero', key: 'videoUrl', value: '/videos/hero-bg.mp4', type: 'text' },
    { page: 'home', section: 'works', key: 'heading', value: 'Selected Works', type: 'text' },
    { page: 'home', section: 'testimonials', key: 'heading', value: 'Client Perspectives', type: 'text' },
    { page: 'home', section: 'footer', key: 'address', value: '123 Cuts and Grooves.\nCumbum, Theni.\nTamilnadu.', type: 'text' },
    { page: 'home', section: 'footer', key: 'phone', value: '+91 80157 59988', type: 'text' },
    { page: 'home', section: 'footer', key: 'email', value: 'hello@cutsandgrooves.com', type: 'text' }
];

async function seed() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);

        console.log('Clearing existing data...');
        await Project.deleteMany({});
        await User.deleteMany({});
        await Content.deleteMany({});
        await Testimonial.deleteMany({});

        console.log('Seeding projects...');
        await Project.insertMany(initialProjects);

        console.log('Seeding testimonials...');
        await Testimonial.insertMany(initialTestimonials);

        console.log('Seeding content...');
        await Content.insertMany(initialContent);

        console.log('Creating admin user...');
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
        await User.create({
            email: process.env.ADMIN_EMAIL || 'admin@example.com',
            password: hashedPassword,
            role: 'admin'
        });

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seed();
