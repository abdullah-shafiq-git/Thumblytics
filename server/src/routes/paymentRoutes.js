const express = require('express');
const router = express.Router();
const { upgradePlan, getSubscription, cancelSubscription } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// All payment routes require authentication
router.post('/upgrade', protect, upgradePlan);
router.get('/subscription', protect, getSubscription);
router.post('/cancel', protect, cancelSubscription);

module.exports = router;
