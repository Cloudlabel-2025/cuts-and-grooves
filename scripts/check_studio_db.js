const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const ContentSchema = new mongoose.Schema({
    page: String,
    section: String,
    key: String,
    value: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

const Content = mongoose.models.Content || mongoose.model('Content', ContentSchema);

async function checkContent() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);

        console.log('Fetching studio content...');
        const content = await Content.find({ page: 'studio' });

        console.log(`Found ${content.length} items for studio page:`);
        content.forEach(item => {
            console.log(`- Section: ${item.section}, Key: ${item.key}, Value Type: ${typeof item.value}`);
            if (typeof item.value === 'string') {
                console.log(`  Content: ${item.value.substring(0, 50)}...`);
            } else if (Array.isArray(item.value)) {
                console.log(`  Items: ${item.value.length}`);
            }
        });

        process.exit(0);
    } catch (error) {
        console.error('Error checking content:', error);
        process.exit(1);
    }
}

checkContent();
