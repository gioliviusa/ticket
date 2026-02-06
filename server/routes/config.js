const express = require('express');
const router = express.Router();

// @route   GET /api/config/stripe
// @desc    Get Stripe publishable key
// @access  Public
router.get('/stripe', (req, res) => {
  res.json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || ''
  });
});

// @route   GET /api/config/service-fee
// @desc    Get service fee rate
// @access  Public
router.get('/service-fee', (req, res) => {
  res.json({
    rate: parseFloat(process.env.SERVICE_FEE_RATE || '0.10')
  });
});

module.exports = router;
