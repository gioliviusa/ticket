const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { apiLimiter, createLimiter } = require('../middleware/rateLimiter');
const Ticket = require('../models/Ticket');

// @route   POST /api/tickets
// @desc    Create a new ticket listing
// @access  Private
router.post('/', authenticateToken, createLimiter, [
  body('eventName').trim().notEmpty(),
  body('eventDate').isISO8601(),
  body('eventLocation').trim().notEmpty(),
  body('eventVenue').trim().notEmpty(),
  body('ticketType').isIn(['General Admission', 'VIP', 'Premium', 'Early Bird', 'Standard', 'Other']),
  body('quantity').isInt({ min: 1 }),
  body('originalPrice').isFloat({ min: 0 }),
  body('resalePrice').isFloat({ min: 0 }),
  body('ticketBarcode').trim().notEmpty()
], validate, async (req, res) => {
  try {
    const {
      eventName,
      eventDate,
      eventLocation,
      eventVenue,
      ticketType,
      seatNumber,
      section,
      quantity,
      originalPrice,
      resalePrice,
      ticketBarcode,
      description,
      images
    } = req.body;

    // Check if barcode already exists
    const existingTicket = await Ticket.findOne({ ticketBarcode });
    if (existingTicket) {
      return res.status(400).json({ 
        error: 'Ticket with this barcode already exists' 
      });
    }

    // Validate event date is in the future
    if (new Date(eventDate) < new Date()) {
      return res.status(400).json({ 
        error: 'Event date must be in the future' 
      });
    }

    // Create ticket
    const ticket = await Ticket.create({
      seller: req.user._id,
      eventName,
      eventDate,
      eventLocation,
      eventVenue,
      ticketType,
      seatNumber,
      section,
      quantity,
      originalPrice,
      resalePrice,
      ticketBarcode,
      description,
      images: images || []
    });

    // Add to user's listings
    req.user.listings.push(ticket._id);
    await req.user.save();

    res.status(201).json({
      message: 'Ticket listed successfully',
      ticket
    });
  } catch (error) {
    console.error('Ticket creation error:', error);
    res.status(500).json({ error: 'Failed to create ticket listing' });
  }
});

// @route   GET /api/tickets
// @desc    Get all available tickets (with search/filter)
// @access  Public
router.get('/', optionalAuth, apiLimiter, async (req, res) => {
  try {
    const {
      search,
      location,
      minPrice,
      maxPrice,
      ticketType,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 20
    } = req.query;

    // Build query
    const query = { status: 'available' };

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Location filter
    if (location) {
      query.eventLocation = new RegExp(location, 'i');
    }

    // Price range
    if (minPrice || maxPrice) {
      query.resalePrice = {};
      if (minPrice) query.resalePrice.$gte = parseFloat(minPrice);
      if (maxPrice) query.resalePrice.$lte = parseFloat(maxPrice);
    }

    // Ticket type filter
    if (ticketType) {
      query.ticketType = ticketType;
    }

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const tickets = await Ticket.find(query)
      .select('-ticketBarcode') // Don't expose barcode in listings
      .populate('seller', 'firstName lastName')
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Ticket.countDocuments(query);

    res.json({
      tickets,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Tickets fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// @route   GET /api/tickets/:id
// @desc    Get ticket details
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('seller', 'firstName lastName email verified');

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Hide barcode unless user is the seller
    const ticketData = ticket.toObject();
    if (!req.user || ticket.seller._id.toString() !== req.user._id.toString()) {
      delete ticketData.ticketBarcode;
    }

    res.json({ ticket: ticketData });
  } catch (error) {
    console.error('Ticket fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch ticket' });
  }
});

// @route   PUT /api/tickets/:id
// @desc    Update ticket listing
// @access  Private (owner only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Check ownership
    if (ticket.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Can't update sold tickets
    if (ticket.status === 'sold') {
      return res.status(400).json({ error: 'Cannot update sold tickets' });
    }

    // Update allowed fields
    const allowedUpdates = [
      'resalePrice', 'description', 'images', 'quantity'
    ];
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        ticket[field] = req.body[field];
      }
    });

    await ticket.save();

    res.json({
      message: 'Ticket updated successfully',
      ticket
    });
  } catch (error) {
    console.error('Ticket update error:', error);
    res.status(500).json({ error: 'Failed to update ticket' });
  }
});

// @route   DELETE /api/tickets/:id
// @desc    Delete/cancel ticket listing
// @access  Private (owner only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Check ownership
    if (ticket.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Can't delete sold tickets
    if (ticket.status === 'sold') {
      return res.status(400).json({ error: 'Cannot delete sold tickets' });
    }

    ticket.status = 'cancelled';
    await ticket.save();

    res.json({ message: 'Ticket listing cancelled successfully' });
  } catch (error) {
    console.error('Ticket deletion error:', error);
    res.status(500).json({ error: 'Failed to delete ticket' });
  }
});

// @route   POST /api/tickets/:id/validate
// @desc    Validate ticket (admin/system endpoint)
// @access  Private
router.post('/:id/validate', authenticateToken, async (req, res) => {
  try {
    const { validationStatus, validationNotes } = req.body;

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    ticket.validationStatus = validationStatus;
    ticket.validationNotes = validationNotes || '';
    
    await ticket.save();

    res.json({
      message: 'Ticket validation updated',
      ticket
    });
  } catch (error) {
    console.error('Ticket validation error:', error);
    res.status(500).json({ error: 'Failed to validate ticket' });
  }
});

module.exports = router;
