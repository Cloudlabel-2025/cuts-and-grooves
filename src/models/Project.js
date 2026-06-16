import mongoose from 'mongoose';

const GalleryItemSchema = new mongoose.Schema({
    url: { type: String, required: true },
    description: { type: String, default: '' },
}, { _id: false });

const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title for this project.'],
        maxlength: [60, 'Title cannot be more than 60 characters'],
    },
    slug: {
        type: String,
        required: [true, 'Please provide a slug for this project.'],
        unique: true,
    },
    category: {
        type: String,
        required: [true, 'Please provide a category.'],
    },
    year: {
        type: String,
    },
    location: {
        type: String,
    },
    mainImage: {
        type: String,
        required: [true, 'Please provide a main image URL.'],
    },
    gallery: [GalleryItemSchema],
    description: {
        type: String,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
