const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  // Parties involved
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Ticket reference
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
    required: true
  },
  // Payment details
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  serviceFee: {
    type: Number,
    required: true,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  // Stripe payment information
  stripePaymentIntentId: {
    type: String,
    required: true
  },
  stripeChargeId: {
    type: String
  },
  // Transaction status
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  // Transfer to seller
  sellerPayout: {
    transferId: String,
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending'
    },
    amount: Number
  }
}, {
  timestamps: true
});

// Index for queries
transactionSchema.index({ buyer: 1, createdAt: -1 });
transactionSchema.index({ seller: 1, createdAt: -1 });
transactionSchema.index({ status: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
