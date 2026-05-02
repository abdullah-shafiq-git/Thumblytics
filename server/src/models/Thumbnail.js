const mongoose = require('mongoose');

const thumbnailSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            trim: true,
            maxlength: 200,
        },
        imageUrl: {
            type: String,
            required: true,
        },
        originalFilename: String,
        mimeType: String,
        fileSize: Number,

        // CTR Analysis Results
        analysis: {
            ctrScore: { type: Number, min: 0, max: 100 },
            brightnessScore: { type: Number, min: 0, max: 100 },
            contrastScore: { type: Number, min: 0, max: 100 },
            colorBalanceScore: { type: Number, min: 0, max: 100 },
            textReadabilityScore: { type: Number, min: 0, max: 100 },
            faceDetectionScore: { type: Number, min: 0, max: 100 },
            curiosityGapScore: { type: Number, min: 0, max: 100 },
            emotionScore: { type: Number, min: 0, max: 100 },
            dominantColors: [String],
            hasFace: { type: Boolean, default: false },
            textDensity: { type: String, enum: ['none', 'low', 'medium', 'high'] },
            issues: [String],
            suggestions: [String],
            strengths: [String],
        },

        // AI Generated Content
        aiTitleSuggestions: [String],
        aiImprovements: [String],

        // Metadata
        niche: String,
        tags: [String],
        isPublic: { type: Boolean, default: false },
        analyzedAt: Date,
    },
    { timestamps: true }
);

thumbnailSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Thumbnail', thumbnailSchema);
