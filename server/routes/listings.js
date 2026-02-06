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

// Get all listings (public)
router.get('/', (req, res) => {
  const { event, minPrice, maxPrice, status } = req.query;
  let filtered = [...global.listings];

  if (event) {
    filtered = filtered.filter(l => 
      l.eventName.toLowerCase().includes(event.toLowerCase())
    );
  }

  if (minPrice) {
    filtered = filtered.filter(l => l.price >= parseFloat(minPrice));
  }

  if (maxPrice) {
    filtered = filtered.filter(l => l.price <= parseFloat(maxPrice));
  }

  if (status) {
    filtered = filtered.filter(l => l.status === status);
  }

  res.json(filtered);
});

// Get single listing
router.get('/:id', (req, res) => {
  const listing = global.listings.find(l => l.id === req.params.id);
  if (!listing) {
    return res.status(404).json({ error: 'Listing not found' });
  }
  res.json(listing);
});

// Create listing
router.post('/', authenticateToken, (req, res) => {
  try {
    const {
      eventName,
      eventDate,
      ticketType,
      price,
      faceValue,
      section,
      isTransferable,
      transferMethod,
      description
    } = req.body;

    // Validate resale checks
    const eventDateTime = new Date(eventDate);
    const now = new Date();
    const hoursUntilEvent = (eventDateTime - now) / (1000 * 60 * 60);
    
    const isEligible = 
      isTransferable === true &&
      hoursUntilEvent >= 72 &&
      price <= faceValue * 1.2;

    const listing = {
      id: Date.now().toString(),
      sellerId: req.user.userId,
      eventName,
      eventDate,
      ticketType,
      price: parseFloat(price),
      faceValue: parseFloat(faceValue),
      section,
      isTransferable,
      transferMethod,
      description,
      status: isEligible ? 'Approved' : 'Not Eligible',
      createdAt: new Date().toISOString()
    };

    global.listings.push(listing);

    res.json(listing);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's listings
router.get('/user/my-listings', authenticateToken, (req, res) => {
  const userListings = global.listings.filter(l => l.sellerId === req.user.userId);
  res.json(userListings);
});

module.exports = router;
