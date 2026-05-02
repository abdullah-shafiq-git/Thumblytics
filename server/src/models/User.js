const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            maxlength: [50, 'Name cannot exceed 50 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters'],
            select: false,
        },
        avatar: {
            type: String,
            default: null,
        },
        plan: {
            type: String,
            enum: ['free', 'pro'],
            default: 'free',
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        usage: {
            analysisCount: { type: Number, default: 0 },
            generationCount: { type: Number, default: 0 },
            lastReset: { type: Date, default: Date.now },
        },
        stripeCustomerId: {
            type: String,
            default: null,
        },
        stripeSubscriptionId: {
            type: String,
            default: null,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
    },
    { timestamps: true }
);

// Hash password before save
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

// Reset monthly usage
userSchema.methods.resetMonthlyUsage = async function () {
    const now = new Date();
    const lastReset = new Date(this.usage.lastReset);
    if (
        now.getMonth() !== lastReset.getMonth() ||
        now.getFullYear() !== lastReset.getFullYear()
    ) {
        this.usage.analysisCount = 0;
        this.usage.generationCount = 0;
        this.usage.lastReset = now;
        await this.save();
    }
};

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Check usage limits
userSchema.methods.canAnalyze = function () {
    const limit = this.plan === 'pro' ? 999999 : 5;
    return this.usage.analysisCount < limit;
};

userSchema.methods.canGenerate = function () {
    const limit = this.plan === 'pro' ? 999999 : 3;
    return this.usage.generationCount < limit;
};

module.exports = mongoose.model('User', userSchema);
