#!/usr/bin/env node

/**
 * Database Seeder for TicketSwap
 * Creates sample data for testing and development
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Import models
const User = require('../server/models/User');
const Ticket = require('../server/models/Ticket');
const Transaction = require('../server/models/Transaction');

// Sample data
const sampleUsers = [
  {
    email: 'alice@example.com',
    password: 'password123',
    firstName: 'Alice',
    lastName: 'Johnson',
    phoneNumber: '+1234567890',
    verified: true
  },
  {
    email: 'bob@example.com',
    password: 'password123',
    firstName: 'Bob',
    lastName: 'Smith',
    phoneNumber: '+1234567891',
    verified: true
  },
  {
    email: 'charlie@example.com',
    password: 'password123',
    firstName: 'Charlie',
    lastName: 'Brown',
    phoneNumber: '+1234567892',
    verified: true
  }
];

const sampleEvents = [
  {
    eventName: 'Taylor Swift - The Eras Tour',
    location: 'Los Angeles, CA',
    venue: 'SoFi Stadium',
    ticketType: 'VIP',
    date: new Date('2026-06-15')
  },
  {
    eventName: 'Coachella 2026',
    location: 'Indio, CA',
    venue: 'Empire Polo Club',
    ticketType: 'General Admission',
    date: new Date('2026-04-12')
  },
  {
    eventName: 'NBA Finals Game 7',
    location: 'Boston, MA',
    venue: 'TD Garden',
    ticketType: 'Premium',
    date: new Date('2026-06-20')
  },
  {
    eventName: 'Ed Sheeran Live',
    location: 'New York, NY',
    venue: 'Madison Square Garden',
    ticketType: 'Standard',
    date: new Date('2026-05-10')
  },
  {
    eventName: 'Broadway: Hamilton',
    location: 'New York, NY',
    venue: 'Richard Rodgers Theatre',
    ticketType: 'Orchestra',
    date: new Date('2026-03-25')
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ticketswap';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Ticket.deleteMany({});
    await Transaction.deleteMany({});
    console.log('✅ Cleared existing data\n');

    // Create users
    console.log('👥 Creating sample users...');
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = await User.create(userData);
      createdUsers.push(user);
      console.log(`   ✅ Created user: ${user.email}`);
    }
    console.log(`✅ Created ${createdUsers.length} users\n`);

    // Create tickets
    console.log('🎫 Creating sample tickets...');
    const createdTickets = [];
    for (let i = 0; i < sampleEvents.length; i++) {
      const event = sampleEvents[i];
      const seller = createdUsers[i % createdUsers.length];
      
      const ticket = await Ticket.create({
        seller: seller._id,
        eventName: event.eventName,
        eventDate: event.date,
        eventLocation: event.location,
        eventVenue: event.venue,
        ticketType: event.ticketType,
        seatNumber: `A${10 + i}`,
        section: 'Floor',
        quantity: 1,
        originalPrice: 150 + (i * 50),
        resalePrice: 200 + (i * 75),
        ticketBarcode: `TICKET${Date.now()}${i}`,
        description: `Great seats for ${event.eventName}!`,
        validationStatus: i % 2 === 0 ? 'verified' : 'pending',
        status: 'available'
      });
      
      createdTickets.push(ticket);
      seller.listings.push(ticket._id);
      await seller.save();
      
      console.log(`   ✅ Created ticket: ${ticket.eventName}`);
    }
    console.log(`✅ Created ${createdTickets.length} tickets\n`);

    // Create sample transaction
    console.log('💳 Creating sample transaction...');
    const buyer = createdUsers[1];
    const soldTicket = createdTickets[0];
    
    const transaction = await Transaction.create({
      buyer: buyer._id,
      seller: soldTicket.seller,
      ticket: soldTicket._id,
      amount: soldTicket.resalePrice,
      serviceFee: soldTicket.resalePrice * 0.10,
      totalAmount: soldTicket.resalePrice * 1.10,
      stripePaymentIntentId: 'pi_test_' + Date.now(),
      status: 'completed'
    });
    
    // Update ticket status
    soldTicket.status = 'sold';
    soldTicket.transaction = transaction._id;
    await soldTicket.save();
    
    // Update user records
    buyer.purchases.push(transaction._id);
    await buyer.save();
    
    const seller = await User.findById(soldTicket.seller);
    seller.sales.push(transaction._id);
    await seller.save();
    
    console.log(`   ✅ Created sample transaction\n`);

    // Summary
    console.log('📊 Seeding Summary');
    console.log('==================');
    console.log(`✅ ${createdUsers.length} users created`);
    console.log(`✅ ${createdTickets.length} tickets created`);
    console.log(`✅ 1 transaction created`);
    console.log('');
    console.log('📋 Sample Credentials:');
    console.log('   Email: alice@example.com');
    console.log('   Password: password123');
    console.log('');
    console.log('   Email: bob@example.com');
    console.log('   Password: password123');
    console.log('');
    console.log('✅ Database seeded successfully!');
    console.log('🚀 You can now test the application with sample data.');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n📡 Database connection closed');
  }
}

// Run seeder
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
