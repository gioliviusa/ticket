const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { body } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const validate = require('../middleware/validate');
const Ticket = require('../models/Ticket');
const Transaction = require('../models/Transaction');

// Service fee percentage (e.g., 10% = 0.10)
const SERVICE_FEE_RATE = parseFloat(process.env.SERVICE_FEE_RATE || '0.10');

// @route   POST /api/payments/create-payment-intent
// @desc    Create a payment intent for ticket purchase
// @access  Private
router.post('/create-payment-intent', authenticateToken, [
  body('ticketId').notEmpty()
], validate, async (req, res) => {
  try {
    const { ticketId } = req.body;

    // Get ticket
    const ticket = await Ticket.findById(ticketId).populate('seller');

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Check if ticket is available
    if (ticket.status !== 'available') {
      return res.status(400).json({ error: 'Ticket is not available' });
    }

    // Can't buy your own ticket
    if (ticket.seller._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ error: 'Cannot purchase your own ticket' });
    }

    // Calculate amounts
    const ticketPrice = ticket.resalePrice;
    const serviceFee = Math.round(ticketPrice * SERVICE_FEE_RATE * 100) / 100;
    const totalAmount = ticketPrice + serviceFee;

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        ticketId: ticket._id.toString(),
        buyerId: req.user._id.toString(),
        sellerId: ticket.seller._id.toString(),
        ticketPrice: ticketPrice.toString(),
        serviceFee: serviceFee.toString()
      }
    });

    // Update ticket status to pending
    ticket.status = 'pending';
    await ticket.save();

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: totalAmount,
      ticketPrice,
      serviceFee
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

// @route   POST /api/payments/confirm-payment
// @desc    Confirm payment and create transaction
// @access  Private
router.post('/confirm-payment', authenticateToken, [
  body('paymentIntentId').notEmpty(),
  body('ticketId').notEmpty()
], validate, async (req, res) => {
  try {
    const { paymentIntentId, ticketId } = req.body;

    // Verify payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      const statusMessages = {
        'processing': 'Payment is still processing',
        'requires_payment_method': 'Payment method required',
        'requires_confirmation': 'Payment requires confirmation',
        'requires_action': 'Payment requires additional action',
        'canceled': 'Payment was canceled',
        'failed': 'Payment failed'
      };
      const message = statusMessages[paymentIntent.status] || 'Payment not completed';
      return res.status(400).json({ error: message });
    }

    // Get ticket
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Verify metadata matches
    if (paymentIntent.metadata.ticketId !== ticketId ||
        paymentIntent.metadata.buyerId !== req.user._id.toString()) {
      return res.status(400).json({ error: 'Payment verification failed' });
    }

    // Create transaction
    const ticketPrice = parseFloat(paymentIntent.metadata.ticketPrice);
    const serviceFee = parseFloat(paymentIntent.metadata.serviceFee);

    const transaction = await Transaction.create({
      buyer: req.user._id,
      seller: ticket.seller,
      ticket: ticket._id,
      amount: ticketPrice,
      serviceFee: serviceFee,
      totalAmount: ticketPrice + serviceFee,
      stripePaymentIntentId: paymentIntent.id,
      stripeChargeId: paymentIntent.charges.data[0]?.id,
      status: 'completed'
    });

    // Update ticket
    ticket.status = 'sold';
    ticket.transaction = transaction._id;
    await ticket.save();

    // Update user records
    req.user.purchases.push(transaction._id);
    await req.user.save();

    const seller = await require('../models/User').findById(ticket.seller);
    seller.sales.push(transaction._id);
    await seller.save();

    res.json({
      message: 'Purchase completed successfully',
      transaction,
      ticket
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
});

// @route   POST /api/payments/webhook
// @desc    Stripe webhook endpoint
// @access  Public (Stripe only)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      
      // Update ticket status back to available
      if (failedPayment.metadata.ticketId) {
        const ticket = await Ticket.findById(failedPayment.metadata.ticketId);
        if (ticket && ticket.status === 'pending') {
          ticket.status = 'available';
          await ticket.save();
        }
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// @route   GET /api/payments/transactions
// @desc    Get user's transactions
// @access  Private
router.get('/transactions', authenticateToken, async (req, res) => {
  try {
    const { type = 'all' } = req.query;

    let query = {};
    if (type === 'purchases') {
      query.buyer = req.user._id;
    } else if (type === 'sales') {
      query.seller = req.user._id;
    } else {
      query.$or = [
        { buyer: req.user._id },
        { seller: req.user._id }
      ];
    }

    const transactions = await Transaction.find(query)
      .populate('ticket')
      .populate('buyer', 'firstName lastName email')
      .populate('seller', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json({ transactions });
  } catch (error) {
    console.error('Transactions fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

module.exports = router;
