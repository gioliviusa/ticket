# 🎫 TicketSwap - Getting Started Guide

Welcome to TicketSwap! This guide will help you understand how to deploy and check out the application.

## 📚 Documentation Overview

We've created comprehensive guides for different needs:

| Guide | Purpose | Time Needed |
|-------|---------|-------------|
| **[STEP_BY_STEP_GUIDE.md](STEP_BY_STEP_GUIDE.md)** | 👉 **Complete beginners** - Every step explained | 10 minutes |
| **[QUICKSTART.md](QUICKSTART.md)** | Get running quickly | 2-5 minutes |
| **[HOW_TO_CHECK_OUT.md](HOW_TO_CHECK_OUT.md)** | Test the application | 5-10 minutes |
| **[DEPLOYMENT.md](DEPLOYMENT.md)** | Deploy to production | 15-30 minutes |
| **[README.md](README.md)** | Full API documentation | Reference |
| **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** | Technical details | Reference |

**🆕 Never used command line before?** → [STEP_BY_STEP_GUIDE.md](STEP_BY_STEP_GUIDE.md)

**Have some experience?** → [QUICKSTART.md](QUICKSTART.md)

**Want to deploy online?** → [DEPLOYMENT.md](DEPLOYMENT.md)

---

## 🚀 Quick Start (2 Minutes)

The fastest way to see TicketSwap in action:

```bash
# 1. Clone and setup
git clone https://github.com/gioliviusa/ticket.git
cd ticket
npm run setup

# 2. Start the server
npm start

# 3. Open in browser
# - Homepage: client/index.html
# - API: http://localhost:5000/api/health
```

**Note:** This requires Node.js and MongoDB. If you don't have MongoDB, the server will start but some features won't work.

---

## 🧪 How to Check It Out (5 Minutes)

Want to try the full application with sample data?

```bash
# 1. Setup (if not done)
npm run setup
npm start

# 2. Load sample data
npm run seed

# 3. Login and test
# Open client/login.html
# Email: alice@example.com
# Password: password123
```

**See [HOW_TO_CHECK_OUT.md](HOW_TO_CHECK_OUT.md) for detailed testing instructions.**

---

## 🌐 How to Deploy

### Option 1: Heroku (Easiest)

```bash
heroku create your-app-name
heroku addons:create mongolab:sandbox
heroku config:set JWT_SECRET=$(openssl rand -base64 32)
git push heroku main
```

### Option 2: DigitalOcean

1. Connect GitHub repository
2. Select Node.js environment
3. Add MongoDB cluster
4. Configure environment variables
5. Deploy

### Option 3: AWS EC2

1. Launch Ubuntu instance
2. Install Node.js and MongoDB
3. Clone repository
4. Configure with PM2 and Nginx
5. Setup SSL with Let's Encrypt

**See [DEPLOYMENT.md](DEPLOYMENT.md) for complete step-by-step guides.**

---

## 💻 Available Commands

```bash
# Setup and Development
npm run setup      # Automated setup (creates .env, installs deps)
npm start          # Start production server
npm run dev        # Start dev server with auto-reload

# Testing
npm run seed       # Add sample data to database
npm run test:api   # Test API endpoints

# Development
npm install        # Install dependencies
```

---

## 🎯 What You Can Test

### Frontend Features
- ✅ User registration and login
- ✅ OAuth (Google/Facebook) - requires credentials
- ✅ User dashboard with statistics
- ✅ Create ticket listings
- ✅ Browse and search tickets
- ✅ Responsive design

### Backend API
- ✅ RESTful API endpoints
- ✅ JWT authentication
- ✅ Rate limiting
- ✅ Input validation
- ✅ MongoDB integration
- ✅ Stripe payment processing - requires keys

### Security Features
- ✅ Password hashing
- ✅ JWT tokens (7-day expiry)
- ✅ Rate limiting by endpoint type
- ✅ Input validation
- ✅ CORS configuration

---

## 📁 Project Structure

```
ticket/
├── client/                 # Frontend HTML/CSS/JS
│   ├── index.html         # Homepage
│   ├── login.html         # Login page
│   ├── register.html      # Registration
│   ├── dashboard.html     # User dashboard
│   ├── tickets.html       # Browse tickets
│   ├── create-listing.html # Create ticket
│   └── checkout.html      # Payment checkout
├── server/                # Backend Node.js/Express
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Auth, validation, rate limiting
│   ├── config/            # Passport configuration
│   └── server.js          # Main server file
├── scripts/               # Automation scripts
│   ├── setup.sh           # Setup automation
│   ├── test.sh            # API testing
│   └── seed.js            # Database seeder
└── Documentation files
```

---

## 🔧 Configuration

### Required Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ticketswap
JWT_SECRET=your_secret_key
```

### Optional (for full features)

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Google OAuth
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx

# Facebook OAuth
FACEBOOK_APP_ID=xxx
FACEBOOK_APP_SECRET=xxx
```

**The setup script creates .env automatically with sensible defaults.**

---

## 🐛 Common Issues

### "MongoDB connection error"
**Solution:** Start MongoDB or use MongoDB Atlas
```bash
mongod  # Start local MongoDB
# OR update MONGODB_URI in .env with Atlas connection string
```

### "Port 5000 already in use"
**Solution:** Change port in .env
```env
PORT=5001
```

### "Cannot find module"
**Solution:** Install dependencies
```bash
npm install
```

### "Payment processing not configured"
**This is normal** - Stripe keys are optional for testing other features.

---

## 📊 Sample Data

After running `npm run seed`, you get:

**Users:**
- alice@example.com / password123
- bob@example.com / password123
- charlie@example.com / password123

**Tickets:**
- Taylor Swift - The Eras Tour (VIP)
- Coachella 2026 (General Admission)
- NBA Finals Game 7 (Premium)
- Ed Sheeran Live (Standard)
- Broadway: Hamilton (Orchestra)

**Transaction:**
- Alice sold one ticket to Bob (completed)

---

## 🎓 Learning Resources

### For Developers
1. **API Documentation** - [README.md](README.md)
   - All endpoints with examples
   - Request/response formats
   - Authentication flow

2. **Technical Implementation** - [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)
   - Architecture overview
   - Database models
   - Security features

### For Deployment
1. **Quick Start** - [QUICKSTART.md](QUICKSTART.md)
   - Local setup
   - Basic testing
   - Troubleshooting

2. **Production Deployment** - [DEPLOYMENT.md](DEPLOYMENT.md)
   - Multiple platform options
   - Database setup
   - Security checklist

### For Testing
1. **Testing Guide** - [HOW_TO_CHECK_OUT.md](HOW_TO_CHECK_OUT.md)
   - Manual testing
   - API testing
   - What to verify

---

## 🚦 Quick Decision Tree

**"I just want to see it working"**
→ [QUICKSTART.md](QUICKSTART.md)

**"I want to test all features"**
→ [HOW_TO_CHECK_OUT.md](HOW_TO_CHECK_OUT.md)

**"I want to deploy to production"**
→ [DEPLOYMENT.md](DEPLOYMENT.md)

**"I need API documentation"**
→ [README.md](README.md)

**"I want technical details"**
→ [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)

---

## 🎬 Getting Help

1. **Check documentation** - Most answers are in the guides above
2. **Read error messages** - They usually tell you what's wrong
3. **Check logs** - Look at server output for details
4. **Try common solutions** - See troubleshooting sections
5. **Open an issue** - If you find a bug or need help

---

## ✅ Success Checklist

After setup, you should be able to:
- [ ] Start the server without errors
- [ ] Access API health check
- [ ] Register a new user
- [ ] Login and get a token
- [ ] View the dashboard
- [ ] Create a ticket listing
- [ ] Browse tickets
- [ ] Search and filter tickets

---

## 🎉 You're Ready!

Choose your path:

```bash
# Quick test
npm run setup && npm start

# Full test with data
npm run setup && npm start
# In another terminal: npm run seed

# Deploy to production
# See DEPLOYMENT.md
```

**Happy coding! 🎫**

---

## 📞 Support

- **Documentation**: All guides in this repository
- **Issues**: Open on GitHub
- **Questions**: Check existing documentation first

---

*TicketSwap - A secure ticket resale marketplace*
*Built with Node.js, Express, MongoDB, and Stripe*
