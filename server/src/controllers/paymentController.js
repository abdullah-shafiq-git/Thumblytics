const User = require('../models/User');

/**
 * @desc    Upgrade user plan (mock payment - no real Stripe charge)
 * @route   POST /api/v1/payments/upgrade
 * @access  Private
 */
exports.upgradePlan = async (req, res) => {
    try {
        const { plan, billing, cardLast4, email } = req.body;

        // Validate plan
        if (!['pro'].includes(plan)) {
            return res.status(400).json({ success: false, message: 'Invalid plan selected' });
        }

        // Check user isn't already on that plan
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.plan === plan) {
            return res.status(400).json({ success: false, message: `You are already on the ${plan} plan` });
        }

        // Simulate payment processing delay (in production, call Stripe here)
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Upgrade the user's plan
        user.plan = plan;
        // Store a mock subscription ID (in production this comes from Stripe)
        user.stripeSubscriptionId = `mock_sub_${Date.now()}_${cardLast4}`;
        await user.save();

        // Return updated user (without password)
        const updatedUser = {
            _id: user._id,
            name: user.name,
            email: user.email,
            plan: user.plan,
            avatar: user.avatar,
            role: user.role,
            usage: user.usage,
            stripeSubscriptionId: user.stripeSubscriptionId,
        };

        res.status(200).json({
            success: true,
            message: `Successfully upgraded to ${plan} plan`,
            user: updatedUser,
            subscription: {
                plan,
                billing: billing || 'monthly',
                cardLast4,
                activatedAt: new Date().toISOString(),
            },
        });
    } catch (error) {
        console.error('Payment upgrade error:', error);
        res.status(500).json({ success: false, message: 'Payment processing failed. Please try again.' });
    }
};

/**
 * @desc    Get current subscription details
 * @route   GET /api/v1/payments/subscription
 * @access  Private
 */
exports.getSubscription = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            subscription: {
                plan: user.plan,
                stripeSubscriptionId: user.stripeSubscriptionId,
                stripeCustomerId: user.stripeCustomerId,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch subscription details' });
    }
};

/**
 * @desc    Cancel subscription (downgrade to free)
 * @route   POST /api/v1/payments/cancel
 * @access  Private
 */
exports.cancelSubscription = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.plan === 'free') {
            return res.status(400).json({ success: false, message: 'You are already on the free plan' });
        }

        user.plan = 'free';
        user.stripeSubscriptionId = null;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Subscription cancelled. You have been downgraded to the free plan.',
            user: { plan: user.plan },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to cancel subscription' });
    }
};
