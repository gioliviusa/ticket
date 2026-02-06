# How to Check Out TicketSwap

This guide walks you through checking out and testing the TicketSwap application.

## 📋 Prerequisites Check

Before you start, make sure you have:
- ✅ Node.js installed (v14+)
- ✅ MongoDB running (local or Atlas)
- ✅ A web browser

## 🚀 Method 1: Super Quick Start (2 minutes)

Perfect for just seeing the application in action.

### Step 1: Run Setup
```bash
# Clone repository
git clone https://github.com/gioliviusa/ticket.git
cd ticket

# Run automated setup
npm run setup
```

This will:
- Install all dependencies
- Create a `.env` file with defaults
- Generate a JWT secret
- Check your system

### Step 2: Start Server
```bash
npm start
```

You should see:
```
Server is running on port 5000
MongoDB connected successfully
```

### Step 3: View the Application

Open these files in your browser:

1. **Homepage**: `client/index.html`
   - See the landing page with features
   
2. **Browse Tickets**: `client/tickets.html`
   - View ticket listings (will be empty initially)
   
3. **Sign Up**: `client/register.html`
   - Create your account
   
4. **Login**: `client/login.html`
   - Login to your account

### Step 4: Test the API

In a new terminal:
```bash
npm run test:api
```

This tests all major endpoints and shows you they're working.

---

## 🎯 Method 2: Full Testing with Sample Data (5 minutes)

Get the complete experience with pre-loaded sample data.

### Step 1: Complete Setup
```bash
# If not done already
npm run setup
npm start
```

### Step 2: Load Sample Data

In a new terminal:
```bash
npm run seed
```

This creates:
- ✅ 3 sample users
- ✅ 5 sample event tickets
- ✅ 1 completed transaction

Sample credentials:
- **Email**: alice@example.com
- **Password**: password123

Or:
- **Email**: bob@example.com  
- **Password**: password123

### Step 3: Explore the Application

#### A. Browse Public Pages

1. Open `client/index.html`
   - See the homepage
   - Scroll through features

2. Open `client/tickets.html`
   - See 5 sample tickets loaded
   - Try the search functionality
   - Filter by price, location, type

#### B. Login and Test User Features

1. Open `client/login.html`
2. Login with: alice@example.com / password123
3. You'll be redirected to the dashboard

#### C. Explore the Dashboard

The dashboard shows:
- Active Listings (Alice has 2 tickets listed)
- Sales History (1 sold ticket)
- Purchases (0 for Alice)
- Revenue statistics

#### D. Create a New Ticket

1. Click "Create New Listing"
2. Fill in the form:
   - Event Name: Your Event Name
   - Event Date: Select a future date
   - Location: Your City
   - Venue: Your Venue
   - Ticket Type: Choose one
   - Barcode: UNIQUE123 (must be unique!)
   - Prices: Set original and resale prices
3. Submit

#### E. View Your Listing

1. Go back to dashboard
2. See your new listing in "My Listings"
3. Open `client/tickets.html` to see it publicly

---

## 🧪 Method 3: API Testing with curl

Test the backend API directly.

### 1. Health Check
```bash
curl http://localhost:5000/api/health
```

Expected: `{"status":"OK","message":"TicketSwap API is running"}`

### 2. Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "password123",
    "firstName": "New",
    "lastName": "User"
  }'
```

Expected: Returns a token

### 3. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "password123"
  }'
```

Save the token from the response for authenticated requests.

### 4. Get Tickets (Public)
```bash
curl http://localhost:5000/api/tickets
```

Expected: List of available tickets

### 5. Get User Profile (Authenticated)
```bash
# Replace YOUR_TOKEN with the token from login
curl http://localhost:5000/api/users/profile \
  -H "Authorization: ******
```

Expected: Your user profile

### 6. Get Dashboard Data
```bash
curl http://localhost:5000/api/users/dashboard \
  -H "Authorization: ******
```

Expected: Dashboard statistics and data

---

## 🌐 Method 4: Using a Frontend Server

For better testing, serve the frontend properly:

### Option A: Using http-server

```bash
# Install globally (one time)
npm install -g http-server

# Start frontend server
cd client
http-server -p 3000 -c-1
```

Now open: http://localhost:3000

### Option B: Using Python

```bash
cd client
python3 -m http.server 3000
```

Now open: http://localhost:3000

### Option C: Using PHP

```bash
cd client
php -S localhost:3000
```

Now open: http://localhost:3000

---

## ✅ What to Check

### Frontend Features
- [ ] Homepage loads with features displayed
- [ ] Registration form works
- [ ] Login redirects to dashboard
- [ ] Dashboard shows statistics
- [ ] Create listing form validates input
- [ ] Browse tickets shows listings
- [ ] Search and filters work
- [ ] Responsive design (test on mobile size)

### Backend Features
- [ ] Server starts without errors
- [ ] MongoDB connection successful
- [ ] API health check responds
- [ ] User registration creates account
- [ ] Login returns JWT token
- [ ] Protected routes require authentication
- [ ] Tickets API returns data
- [ ] Rate limiting works (try rapid requests)

### Security Features
- [ ] Passwords are hashed (check MongoDB)
- [ ] JWT tokens expire (check after 7 days)
- [ ] Rate limiting prevents abuse
- [ ] CORS is configured properly
- [ ] Input validation works

---

## 🐛 Common Issues

### "Cannot GET /api/health"
**Problem**: Server not running  
**Solution**: Run `npm start`

### "MongoDB connection error"
**Problem**: MongoDB not running or wrong URI  
**Solution**: 
```bash
# Check if MongoDB is running
mongod

# Or update MONGODB_URI in .env
```

### "CORS Error" in Browser
**Problem**: CLIENT_URL mismatch  
**Solution**: Update CLIENT_URL in .env to match frontend URL

### "Token expired"
**Problem**: JWT token older than 7 days  
**Solution**: Login again to get new token

### Port 5000 Already in Use
**Problem**: Another process using port  
**Solution**: 
```bash
# Change PORT in .env
PORT=5001

# Or kill process on port 5000
lsof -ti:5000 | xargs kill -9  # Mac/Linux
```

---

## 📸 Taking Screenshots

To share what you see:

1. **Homepage**
   - Open `client/index.html`
   - Capture full page scroll

2. **Tickets Page**
   - Open `client/tickets.html`
   - Show search and filters
   - Show ticket cards

3. **Dashboard**
   - Login first
   - Capture statistics
   - Show listings tabs

4. **Create Listing**
   - Show the form
   - Demonstrate validation

---

## 🎓 Next Steps

After checking out the basic functionality:

1. **Read Documentation**
   - [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
   - [README.md](README.md) for API documentation
   - [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) for technical details

2. **Customize**
   - Update branding in HTML files
   - Modify color scheme in CSS
   - Add your own features

3. **Deploy**
   - Follow [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
   - Set up real Stripe account
   - Configure OAuth credentials

4. **Extend**
   - Add email verification
   - Implement password reset
   - Add more ticket types
   - Create admin panel

---

## 🆘 Need Help?

- **Quick Start Issues**: See [QUICKSTART.md](QUICKSTART.md)
- **Deployment Questions**: See [DEPLOYMENT.md](DEPLOYMENT.md)
- **API Questions**: See [README.md](README.md) API Documentation
- **Report Bugs**: Open an issue on GitHub

---

**Enjoy exploring TicketSwap! 🎫**
