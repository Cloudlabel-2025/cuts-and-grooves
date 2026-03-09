const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const ContentSchema = new mongoose.Schema({
    page: String,
    section: String,
    key: String,
    value: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

const Content = mongoose.models.Content || mongoose.model('Content', ContentSchema);

const initiatives = [
    {
        title: "Sustainability Action Plan",
        subtitle: "Driven by purpose and guided by values, we translate our environmental commitments into clear, measurable actions. From responsible material selection to long-term performance strategies, sustainability is embedded into every phase of our process.",
        image: "https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?auto=format&fit=crop&w=1200&q=80",
        description: "We believe Architecture & Design can strengthen people’s connection to place, enrich daily life, and preserve the cultural narratives that shape communities. Our Sustainability Action Plan ensures that these principles are not aspirational — but operational."
    },
    {
        title: "Reconciliation Action Plan",
        subtitle: "Building trust, inspiring confidence, delivering excellence.",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
        description: "Our approach is grounded in respect, collaboration, and meaningful engagement. We actively seek to understand the histories and communities connected to the places we build, ensuring our work contributes positively and responsibly to its social and cultural context. Our lasting impact lies in thoughtful, context-led buildings that honour their histories while strengthening the neighbourhoods they serve."
    },
    {
        title: "Quality Management System",
        subtitle: "Precision in every detail of our methodology.",
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
        description: "Each project responds to multiple influences — context, client vision, technical requirements, and user experience. No outcome is shaped by a single perspective. Our Quality Management System ensures disciplined processes, rigorous review, and consistent excellence from concept through completion."
    },
    {
        title: "100% Green Power",
        subtitle: "Committed to a sustainable and connected built world.",
        image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80",
        description: "We operate with renewable energy to minimise our environmental footprint and support a more responsible future. Our thoughtful designs stand as enduring contributions — reducing impact while enhancing the environments in which they exist."
    }
];

const processContent = [
    { page: 'process', section: 'narrative', key: 'heading', value: '“Each element informs the other. Context grounds the design. The brief defines direction. Our aspirations elevate the outcome. User experience ensures purpose.' },
    { page: 'process', section: 'narrative', key: 'subtext', value: 'We believe architecture has the power to strengthen the bond between people and place.Through thoughtful, context-led design, we create buildings that enrich daily life and respect the cultural narratives that shape communities. Our ambition is not simply to construct — but to contribute.To deliver spaces that honour their history, elevate their surroundings, and endure with purpose in a more connected built world.' },
    { page: 'process', section: 'sustainability', key: 'image', value: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80' },
    { page: 'process', section: 'sustainability', key: 'label', value: 'Environmental Impact' },
    { page: 'process', section: 'sustainability', key: 'heading', value: 'Building with care — for the land, the community, and generations ahead.' },
    { page: 'process', section: 'initiatives', key: 'label', value: 'Our Initiatives' },
    { page: 'process', section: 'initiatives', key: 'heading', value: 'Driven by conviction, proven through action.' },
    { page: 'process', section: 'initiatives', key: 'items', value: initiatives },
    { page: 'process', section: 'accreditations', key: 'items', value: ['ISO 9001 CERTIFIED', 'ARCHITECTS REGISTRATION BOARD'] }
];

async function seedProcess() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);

        console.log('Seeding process content...');
        for (const item of processContent) {
            await Content.findOneAndUpdate(
                { page: item.page, section: item.section, key: item.key },
                item,
                { upsert: true, new: true }
            );
        }

        console.log('Process content seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding process content:', error);
        process.exit(1);
    }
}

seedProcess();
