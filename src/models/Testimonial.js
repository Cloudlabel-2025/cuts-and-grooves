import mongoose from 'mongoose';

const TestimonialSchema = new mongoose.Schema({
    quote: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    role: {
        type: String,
    },
    order: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

export default mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);
