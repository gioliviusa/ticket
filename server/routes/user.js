const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');
const User = require('../models/User');
const Ticket = require('../models/Ticket');
const Transaction = require('../models/Transaction');

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', authenticateToken, apiLimiter, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    
    await user.save();
    
    res.json({ 
      message: 'Profile updated successfully',
      user 
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// @route   GET /api/users/dashboard
// @desc    Get user dashboard data (listings, sales, purchases)
// @access  Private
router.get('/dashboard', authenticateToken, apiLimiter, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user's listings
    const listings = await Ticket.find({ seller: userId })
      .sort({ createdAt: -1 })
      .limit(10);

    // Get user's purchases
    const purchases = await Transaction.find({ buyer: userId })
      .populate('ticket')
      .populate('seller', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get user's sales
    const sales = await Transaction.find({ seller: userId })
      .populate('ticket')
      .populate('buyer', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(10);

    // Calculate statistics
    const stats = {
      activeListings: await Ticket.countDocuments({ 
        seller: userId, 
        status: 'available' 
      }),
      totalSales: await Transaction.countDocuments({ 
        seller: userId, 
        status: 'completed' 
      }),
      totalPurchases: await Transaction.countDocuments({ 
        buyer: userId, 
        status: 'completed' 
      }),
      revenue: await Transaction.aggregate([
        { $match: { seller: userId, status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    };

    res.json({
      listings,
      purchases,
      sales,
      stats: {
        activeListings: stats.activeListings,
        totalSales: stats.totalSales,
        totalPurchases: stats.totalPurchases,
        revenue: stats.revenue[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Dashboard fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// @route   GET /api/users/:id/listings
// @desc    Get user's public listings
// @access  Public
router.get('/:id/listings', apiLimiter, async (req, res) => {
  try {
    const listings = await Ticket.find({ 
      seller: req.params.id,
      status: 'available'
    })
    .select('-ticketBarcode') // Don't expose barcode publicly
    .sort({ createdAt: -1 });

    res.json({ listings });
  } catch (error) {
    console.error('Listings fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

module.exports = router;
