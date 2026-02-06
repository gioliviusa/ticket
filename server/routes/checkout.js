const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Create checkout session (mock for prototype)
router.post('/create-session', authenticateToken, (req, res) => {
  try {
    const { listingId } = req.body;

    const listing = global.listings.find(l => l.id === listingId);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (listing.status !== 'Approved') {
      return res.status(400).json({ error: 'Listing not approved for sale' });
    }

    // Mock Stripe checkout session
    const session = {
      id: 'cs_test_' + Date.now(),
      url: '#checkout-success',
      amount: listing.price * 100, // cents
      listingId: listing.id
    };

    res.json(session);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Complete purchase (mock escrow)
router.post('/complete-purchase', authenticateToken, (req, res) => {
  try {
    const { listingId, sessionId } = req.body;

    const listing = global.listings.find(l => l.id === listingId);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const transaction = {
      id: Date.now().toString(),
      listingId,
      buyerId: req.user.userId,
      sellerId: listing.sellerId,
      amount: listing.price,
      status: 'Pending Transfer',
      sessionId,
      createdAt: new Date().toISOString()
    };

    global.transactions.push(transaction);

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Confirm receipt
router.post('/confirm-receipt', authenticateToken, (req, res) => {
  try {
    const { transactionId } = req.body;

    const transaction = global.transactions.find(t => t.id === transactionId);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    if (transaction.buyerId !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    transaction.status = 'Completed';
    transaction.completedAt = new Date().toISOString();

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user transactions
router.get('/transactions', authenticateToken, (req, res) => {
  const userTransactions = global.transactions.filter(
    t => t.buyerId === req.user.userId || t.sellerId === req.user.userId
  );
  res.json(userTransactions);
});

module.exports = router;
