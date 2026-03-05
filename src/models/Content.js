import mongoose from 'mongoose';

const ContentSchema = new mongoose.Schema({
    page: {
        type: String,
        required: true,
    },
    section: {
        type: String,
        required: true,
    },
    key: {
        type: String,
        required: true,
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
}, { timestamps: true });

// Compound index for quick lookup
ContentSchema.index({ page: 1, section: 1, key: 1 }, { unique: true });

export default mongoose.models.Content || mongoose.model('Content', ContentSchema);
