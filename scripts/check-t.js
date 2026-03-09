const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '.env.local') });

const TestimonialSchema = new mongoose.Schema({
    quote: String,
    author: String,
    role: String,
    image: String,
    order: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const testimonials = await Testimonial.find({}).lean();
        console.log('COUNT:', testimonials.length);
        console.log('DATA:', JSON.stringify(testimonials, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
