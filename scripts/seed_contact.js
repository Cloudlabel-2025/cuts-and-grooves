const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const ContentSchema = new mongoose.Schema({
    page: String,
    section: String,
    key: String,
    value: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

const Content = mongoose.models.Content || mongoose.model('Content', ContentSchema);

const contactContent = [
    {
        page: 'contact',
        section: 'hero',
        key: 'heroText',
        value: 'Based in Tamil Nadu but available for your projects in'
    },
    {
        page: 'contact',
        section: 'hero',
        key: 'locations',
        value: ["Chennai", "Madurai", "Coimbatore", "Trichy", "Salem", "Erode"]
    },
    {
        page: 'contact',
        section: 'details',
        key: 'socials',
        value: [
            { platform: 'Instagram', url: 'https://instagram.com' },
            { platform: 'LinkedIn', url: 'https://linkedin.com' }
        ]
    },
    {
        page: 'contact',
        section: 'details',
        key: 'email',
        value: 'contact@cutsandgrooves.com'
    },
    {
        page: 'contact',
        section: 'details',
        key: 'phone',
        value: '+61 3 8672 5999'
    },
    {
        page: 'contact',
        section: 'details',
        key: 'studio',
        value: 'Cumbum,\nTheni, Tamil Nadu.'
    },
    {
        page: 'contact',
        section: 'details',
        key: 'mapIframe',
        value: 'https://maps.google.com/maps?q=Cumbum,+Tamil+Nadu&t=k&z=13&ie=UTF8&iwloc=&output=embed'
    }
];

async function seedContact() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);

        console.log('Seeding contact content...');
        for (const item of contactContent) {
            await Content.findOneAndUpdate(
                { page: item.page, section: item.section, key: item.key },
                item,
                { upsert: true, new: true }
            );
        }

        console.log('Contact content seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding contact content:', error);
        process.exit(1);
    }
}

seedContact();
