const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const ContentSchema = new mongoose.Schema({
    page: String,
    section: String,
    key: String,
    value: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

const Content = mongoose.models.Content || mongoose.model('Content', ContentSchema);

async function dumpContent() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const content = await Content.find({ page: 'studio' });
        fs.writeFileSync('studio_dump.json', JSON.stringify(content, null, 2));
        process.exit(0);
    } catch (error) {
        process.exit(1);
    }
}

dumpContent();
