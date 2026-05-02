const Thumbnail = require('../models/Thumbnail');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { calculateCTRScore } = require('../utils/ctrAnalyzer');
const path = require('path');
const fs = require('fs');

// @desc    Analyze thumbnail
// @route   POST /api/v1/thumbnails/analyze
// @access  Private
const analyzeThumbnail = async (req, res, next) => {
    try {
        if (!req.file) {
            return next(new AppError('Please upload an image file', 400));
        }

        const user = await User.findById(req.user.id);

        // Check usage limits
        if (!user.canAnalyze()) {
            return next(
                new AppError(
                    'Analysis limit reached. Upgrade to Pro for unlimited analyses.',
                    403
                )
            );
        }

        const { title, niche } = req.body;

        // Read file buffer
        const imageBuffer = fs.readFileSync(req.file.path);

        // Run CTR analysis
        const analysisResult = await calculateCTRScore(imageBuffer, {
            filename: req.file.originalname,
            size: req.file.size,
            mimetype: req.file.mimetype,
        });

        // Build image URL
        const imageUrl = `/uploads/${req.file.filename}`;

        // Create thumbnail record
        const thumbnail = await Thumbnail.create({
            user: req.user.id,
            title: title || req.file.originalname,
            imageUrl,
            originalFilename: req.file.originalname,
            mimeType: req.file.mimetype,
            fileSize: req.file.size,
            analysis: {
                ctrScore: analysisResult.ctrScore,
                brightnessScore: analysisResult.brightnessScore,
                contrastScore: analysisResult.contrastScore,
                colorBalanceScore: analysisResult.colorBalanceScore,
                textReadabilityScore: analysisResult.textReadabilityScore,
                faceDetectionScore: analysisResult.faceDetectionScore,
                curiosityGapScore: analysisResult.curiosityGapScore,
                emotionScore: analysisResult.emotionScore,
                dominantColors: analysisResult.dominantColors,
                hasFace: analysisResult.hasFace,
                textDensity: analysisResult.textDensity,
                issues: analysisResult.issues,
                suggestions: analysisResult.suggestions,
                strengths: analysisResult.strengths,
            },
            niche: niche || 'general',
            analyzedAt: new Date(),
        });

        // Increment usage
        user.usage.analysisCount += 1;
        await user.save();

        res.status(201).json({
            success: true,
            message: 'Thumbnail analyzed successfully',
            data: thumbnail,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all thumbnails for user
// @route   GET /api/v1/thumbnails
// @access  Private
const getThumbnails = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const total = await Thumbnail.countDocuments({ user: req.user.id });
        const thumbnails = await Thumbnail.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            count: thumbnails.length,
            total,
            pages: Math.ceil(total / limit),
            page,
            data: thumbnails,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single thumbnail
// @route   GET /api/v1/thumbnails/:id
// @access  Private
const getThumbnail = async (req, res, next) => {
    try {
        const thumbnail = await Thumbnail.findOne({
            _id: req.params.id,
            user: req.user.id,
        });

        if (!thumbnail) {
            return next(new AppError('Thumbnail not found', 404));
        }

        res.status(200).json({ success: true, data: thumbnail });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete thumbnail
// @route   DELETE /api/v1/thumbnails/:id
// @access  Private
const deleteThumbnail = async (req, res, next) => {
    try {
        const thumbnail = await Thumbnail.findOne({
            _id: req.params.id,
            user: req.user.id,
        });

        if (!thumbnail) {
            return next(new AppError('Thumbnail not found', 404));
        }

        // Delete file from uploads
        const filePath = path.join(__dirname, '../../uploads', path.basename(thumbnail.imageUrl));
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await Thumbnail.findByIdAndDelete(req.params.id);

        res.status(200).json({ success: true, message: 'Thumbnail deleted' });
    } catch (error) {
        next(error);
    }
};

// @desc    Get dashboard stats
// @route   GET /api/v1/thumbnails/stats
// @access  Private
const getDashboardStats = async (req, res, next) => {
    try {
        const thumbnails = await Thumbnail.find({ user: req.user.id });

        const totalAnalyzed = thumbnails.length;
        const avgCTR =
            totalAnalyzed > 0
                ? Math.round(
                    thumbnails.reduce((acc, t) => acc + (t.analysis?.ctrScore || 0), 0) /
                    totalAnalyzed
                )
                : 0;

        const topThumbnail = thumbnails.sort(
            (a, b) => (b.analysis?.ctrScore || 0) - (a.analysis?.ctrScore || 0)
        )[0];

        const ctrDistribution = {
            excellent: thumbnails.filter((t) => t.analysis?.ctrScore >= 75).length,
            good: thumbnails.filter(
                (t) => t.analysis?.ctrScore >= 50 && t.analysis?.ctrScore < 75
            ).length,
            poor: thumbnails.filter((t) => t.analysis?.ctrScore < 50).length,
        };

        const user = await User.findById(req.user.id);
        const usageLimit = user.plan === 'pro' ? '∞' : '5';

        res.status(200).json({
            success: true,
            data: {
                totalAnalyzed,
                avgCTR,
                topThumbnail,
                ctrDistribution,
                usage: {
                    analysisCount: user.usage.analysisCount,
                    generationCount: user.usage.generationCount,
                    analysisLimit: usageLimit,
                    generationLimit: user.plan === 'pro' ? '∞' : '3',
                },
                plan: user.plan,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Generate AI title suggestions
// @route   POST /api/v1/thumbnails/generate-titles
// @access  Private
const generateTitles = async (req, res, next) => {
    try {
        const { topic, niche, keywords } = req.body;

        if (!topic) {
            return next(new AppError('Please provide a topic', 400));
        }

        // AI-powered title generation (simulated - connect OpenAI in production)
        const titleTemplates = [
            `I Tried ${topic} For 30 Days - The Results Were SHOCKING`,
            `Why Everyone Is Wrong About ${topic} (My Honest Review)`,
            `${topic}: What Nobody Tells You About This`,
            `The TRUTH About ${topic} That Changed Everything`,
            `From Zero to Pro: My ${topic} Journey in 2024`,
            `Stop Making These ${topic} Mistakes (I Did)`,
            `${topic} Changed My Life - Here's Exactly How`,
            `This ${topic} Secret Will 10x Your Results`,
        ];

        const suggestions = titleTemplates.slice(0, 5).map((title) => ({
            title,
            curiosityScore: Math.round(65 + Math.random() * 30),
            emotionTrigger: ['surprise', 'fear', 'curiosity', 'urgency', 'social proof'][
                Math.floor(Math.random() * 5)
            ],
        }));

        res.status(200).json({
            success: true,
            data: { suggestions, topic, niche },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    analyzeThumbnail,
    getThumbnails,
    getThumbnail,
    deleteThumbnail,
    getDashboardStats,
    generateTitles,
};
