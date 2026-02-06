# Quick Start Guide - TicketSwap

Get TicketSwap up and running in minutes for testing and development.

## 🚀 Super Quick Start (Without MongoDB/Stripe)

If you just want to see the UI and test basic functionality:

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Basic Environment File
```bash
cat > .env << 'EOF'
PORT=5000
NODE_ENV=development
JWT_SECRET=my_super_secret_jwt_key_for_testing_123456789
CLIENT_URL=http://localhost:3000
EOF
```

### 3. Start the Server
```bash
npm start
```

The server will start on http://localhost:5000 (without payment and database features).

### 4. View the Frontend
Open any of these files in your browser:
- `client/index.html` - Homepage
- `client/login.html` - Login page  
- `client/register.html` - Registration page
- `client/tickets.html` - Browse tickets
- `client/dashboard.html` - User dashboard (requires login)

**Note:** Most features require MongoDB. Continue to Full Setup below.

---

## 📦 Full Setup (Recommended)

### Prerequisites
- Node.js v14+ ([Download](https://nodejs.org/))
- MongoDB ([Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up MongoDB

**Option A: Local MongoDB**
```bash
# Start MongoDB (if installed locally)
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/ticketswap`)

### Step 3: Configure Environment
```bash
# Copy example environment file
cp .env.example .env

# Edit .env file
nano .env  # or use your favorite editor
```

**Minimal Required Configuration:**
```env
PORT=5000
NODE_ENV=development

# MongoDB - Use local OR Atlas
MONGODB_URI=mongodb://localhost:27017/ticketswap
# OR for Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ticketswap

# JWT Secret (use any long random string)
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production

# Frontend URL
CLIENT_URL=http://localhost:3000
```

**Optional (for full features):**
```env
# Stripe (for payments) - Get from https://dashboard.stripe.com/test/apikeys
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here

# Google OAuth - Get from https://console.cloud.google.com/
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# Service Fee (10% = 0.10)
SERVICE_FEE_RATE=0.10
```

### Step 4: Start the Application
```bash
npm start
```

You should see:
```
Server is running on port 5000
MongoDB connected successfully
```

### Step 5: Open the Application

**Backend API:** http://localhost:5000
- Health check: http://localhost:5000/api/health

**Frontend:** Open in browser
- Homepage: `file:///path/to/ticket/client/index.html`
- Or use a simple HTTP server:
  ```bash
  # Install http-server globally (one time)
  npm install -g http-server
  
  # Start frontend server
  cd client
  http-server -p 3000
  ```
- Then open: http://localhost:3000

---

## 🧪 Test the Application

### 1. Register a New User
1. Open `client/register.html` in your browser
2. Fill in the form:
   - First Name: Test
   - Last Name: User
   - Email: test@example.com
   - Password: password123
3. Click "Create Account"

### 2. Login
1. Open `client/login.html`
2. Enter your credentials
3. Click "Login"
4. You'll be redirected to the dashboard

### 3. Create a Ticket Listing
1. From dashboard, click "Create New Listing"
2. Fill in event details:
   - Event Name: Sample Concert
   - Event Date: Choose a future date
   - Location: New York, NY
   - Venue: Madison Square Garden
   - Ticket Type: VIP
   - Quantity: 1
   - Barcode: ABC123XYZ (must be unique)
   - Original Price: 150
   - Resale Price: 200
3. Click "Create Listing"

### 4. Browse Tickets
1. Open `client/tickets.html`
2. See your listing
3. Try the search and filter features

### 5. Test API Endpoints

**Using curl:**
```bash
# Health check
curl http://localhost:5000/api/health

# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get tickets (public)
curl http://localhost:5000/api/tickets
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: MongoDB connection error
```
**Solution:** 
- Check if MongoDB is running: `mongod` or check Atlas
- Verify MONGODB_URI in .env file
- Check your network connection (for Atlas)

### Port Already in Use
```
Error: Port 5000 already in use
```
**Solution:**
```bash
# Change port in .env
PORT=5001

# Or kill the process using port 5000
# Mac/Linux:
lsof -ti:5000 | xargs kill -9

# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### CORS Errors in Browser
**Solution:** Make sure CLIENT_URL in .env matches your frontend URL

### "Payment processing is not configured"
This is normal if you haven't set up Stripe keys. You can still test all other features.

---

## 📚 Next Steps

- Read [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- Check [README.md](README.md) for full API documentation
- Review [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) for technical details

## 🆘 Need Help?

- Check the [Troubleshooting](#-troubleshooting) section above
- Review the logs in your terminal
- Open an issue on GitHub

---

**Happy Testing! 🎫**
