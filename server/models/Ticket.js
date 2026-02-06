const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  // Seller information
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Event details
  eventName: {
    type: String,
    required: true,
    trim: true
  },
  eventDate: {
    type: Date,
    required: true
  },
  eventLocation: {
    type: String,
    required: true,
    trim: true
  },
  eventVenue: {
    type: String,
    required: true,
    trim: true
  },
  // Ticket details
  ticketType: {
    type: String,
    required: true,
    enum: ['General Admission', 'VIP', 'Premium', 'Early Bird', 'Standard', 'Other']
  },
  seatNumber: {
    type: String,
    trim: true
  },
  section: {
    type: String,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  // Pricing
  originalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  resalePrice: {
    type: Number,
    required: true,
    min: 0
  },
  // Validation
  ticketBarcode: {
    type: String,
    required: true,
    unique: true
  },
  validationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  validationNotes: {
    type: String,
    default: ''
  },
  // Listing status
  status: {
    type: String,
    enum: ['available', 'pending', 'sold', 'cancelled'],
    default: 'available'
  },
  // Description
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  // Images
  images: [{
    type: String
  }],
  // Transaction reference (when sold)
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  }
}, {
  timestamps: true
});

// Index for searching
ticketSchema.index({ eventName: 'text', eventLocation: 'text', eventVenue: 'text' });
ticketSchema.index({ eventDate: 1, status: 1 });

module.exports = mongoose.model('Ticket', ticketSchema);
