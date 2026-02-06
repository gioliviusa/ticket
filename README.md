# TicketSwap - Secure Ticket Resale Marketplace

A full-stack web application for safely buying and selling event tickets with user authentication, ticket validation, and secure Stripe payments.

---

## 📖 Documentation

**🆕 Complete Beginner?** Start here: **[STEP_BY_STEP_GUIDE.md](STEP_BY_STEP_GUIDE.md)** ⭐

This guide tells you **exactly** what to type, where to click, and what to copy/paste - perfect if you've never used the command line before!

| Guide | Best For |
|-------|---------|
| **[STEP_BY_STEP_GUIDE.md](STEP_BY_STEP_GUIDE.md)** | 👉 **Absolute beginners** - Every detail explained |
| **[GETTING_STARTED.md](GETTING_STARTED.md)** | Overview of all guides |
| **[QUICKSTART.md](QUICKSTART.md)** | Get running in 2 minutes |
| **[HOW_TO_CHECK_OUT.md](HOW_TO_CHECK_OUT.md)** | Test the application |
| **[DEPLOYMENT.md](DEPLOYMENT.md)** | Deploy to production |
| **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** | Technical details |

---

## 🚀 Quick Start

**Want to get started quickly?** Check out our guides:

- **[QUICKSTART.md](QUICKSTART.md)** - Get up and running in 5 minutes
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deploy to production (Heroku, AWS, DigitalOcean, etc.)
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Technical implementation details

### Super Quick Setup

```bash
# 1. Clone and install
git clone https://github.com/gioliviusa/ticket.git
cd ticket
npm install

# 2. Run setup script (creates .env with defaults)
npm run setup

# 3. Start the server
npm start

# 4. Open client/index.html in your browser
```

### With Sample Data

```bash
# After setup, seed the database with sample data
npm run seed

# Login with: alice@example.com / password123
```

---

## Features

### ✨ Core Functionality

- **User Authentication & Profiles**
  - Email/password registration and login
  - OAuth integration (Google & Facebook)
  - JWT-based authentication
  - Secure password hashing with bcrypt
  - User profile management

- **User Dashboard**
  - View active ticket listings
  - Track sales history
  - Monitor purchases
  - Real-time statistics (active listings, total sales, revenue)

- **Ticket Listing & Validation**
  - Create and manage ticket listings
  - Unique barcode validation
  - Event details (name, date, location, venue)
  - Ticket types (General Admission, VIP, Premium, etc.)
  - Seat numbers and sections
  - Price management (original and resale prices)
  - Search and filter capabilities

- **Secure Payment Processing**
  - Stripe integration for secure payments
  - Payment intent creation
  - Service fee calculation
  - Transaction tracking
  - Webhook handling for payment events

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Passport.js** - Authentication middleware
- **JWT** - Token-based authentication
- **Stripe** - Payment processing
- **bcryptjs** - Password hashing

### Frontend
- **HTML5/CSS3** - Structure and styling
- **Vanilla JavaScript** - Client-side logic
- **Fetch API** - HTTP requests

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Stripe account for payment processing
- Google OAuth credentials (optional)
- Facebook OAuth credentials (optional)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/gioliviusa/ticket.git
   cd ticket
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/ticketswap
   JWT_SECRET=your_secure_jwt_secret
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   FACEBOOK_APP_ID=your_facebook_app_id
   FACEBOOK_APP_SECRET=your_facebook_app_secret
   CLIENT_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Run the application**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Access the application**
   - API: http://localhost:5000
   - Frontend: Open `client/index.html` in your browser or serve with a static server

## Available Scripts

```bash
npm start          # Start the production server
npm run dev        # Start development server with auto-reload
npm run setup      # Run automated setup (creates .env, installs deps)
npm run seed       # Seed database with sample data
npm run test:api   # Test API endpoints
```

## Testing with Sample Data

After setup, you can seed the database with sample users and tickets:

```bash
npm run seed
```

This creates:
- 3 sample users (alice@example.com, bob@example.com, charlie@example.com)
- 5 sample ticket listings
- 1 sample transaction
- Password for all users: `password123`

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### Google OAuth
```http
GET /api/auth/google
```

#### Facebook OAuth
```http
GET /api/auth/facebook
```

### User Endpoints

#### Get User Profile
```http
GET /api/users/profile
Authorization: Bearer {token}
```

#### Update User Profile
```http
PUT /api/users/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890"
}
```

#### Get User Dashboard
```http
GET /api/users/dashboard
Authorization: Bearer {token}
```

### Ticket Endpoints

#### Create Ticket Listing
```http
POST /api/tickets
Authorization: Bearer {token}
Content-Type: application/json

{
  "eventName": "Concert 2026",
  "eventDate": "2026-12-31T20:00:00Z",
  "eventLocation": "New York",
  "eventVenue": "Madison Square Garden",
  "ticketType": "VIP",
  "seatNumber": "A15",
  "section": "Floor",
  "quantity": 1,
  "originalPrice": 150,
  "resalePrice": 200,
  "ticketBarcode": "ABC123XYZ789",
  "description": "Great seats!"
}
```

#### Get All Tickets (with filters)
```http
GET /api/tickets?search=concert&location=new%20york&minPrice=50&maxPrice=300
```

#### Get Ticket Details
```http
GET /api/tickets/:id
```

#### Update Ticket
```http
PUT /api/tickets/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "resalePrice": 180,
  "description": "Updated description"
}
```

#### Delete/Cancel Ticket
```http
DELETE /api/tickets/:id
Authorization: Bearer {token}
```

### Payment Endpoints

#### Create Payment Intent
```http
POST /api/payments/create-payment-intent
Authorization: Bearer {token}
Content-Type: application/json

{
  "ticketId": "ticket_id_here"
}
```

#### Confirm Payment
```http
POST /api/payments/confirm-payment
Authorization: Bearer {token}
Content-Type: application/json

{
  "paymentIntentId": "pi_xxx",
  "ticketId": "ticket_id_here"
}
```

#### Get Transactions
```http
GET /api/payments/transactions?type=purchases
Authorization: Bearer {token}
```

## Project Structure

```
ticket/
├── server/
│   ├── config/
│   │   └── passport.js          # Passport authentication strategies
│   ├── controllers/             # Request handlers (future expansion)
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication middleware
│   │   └── validate.js          # Request validation middleware
│   ├── models/
│   │   ├── User.js              # User data model
│   │   ├── Ticket.js            # Ticket data model
│   │   └── Transaction.js       # Transaction data model
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── user.js              # User management routes
│   │   ├── ticket.js            # Ticket CRUD routes
│   │   └── payment.js           # Payment processing routes
│   └── server.js                # Main server file
├── client/
│   ├── index.html               # Homepage
│   ├── login.html               # Login page
│   ├── register.html            # Registration page
│   └── dashboard.html           # User dashboard
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── package.json                 # Project dependencies
└── README.md                    # This file
```

## Database Models

### User Model
- email (unique)
- password (hashed)
- firstName, lastName
- phoneNumber
- googleId, facebookId (OAuth)
- avatar
- verified status
- listings, purchases, sales references

### Ticket Model
- seller reference
- event details (name, date, location, venue)
- ticket details (type, seat, section, quantity)
- pricing (original, resale)
- barcode (unique)
- validation status
- listing status
- images

### Transaction Model
- buyer and seller references
- ticket reference
- amount breakdown
- Stripe payment details
- transaction status
- seller payout information

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- HTTP-only cookie support (optional)
- CORS configuration
- Input validation
- SQL injection prevention (MongoDB)
- XSS protection
- Secure Stripe integration

## Development

### Running in Development Mode
```bash
npm run dev
```

### Testing API Endpoints
You can use tools like Postman, Insomnia, or curl to test the API endpoints.

Example with curl:
```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

## Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Use a production MongoDB instance (MongoDB Atlas recommended)
3. Configure production Stripe keys
4. Set secure JWT secret
5. Configure OAuth redirect URLs for production domain

### Recommended Platforms
- **Backend**: Heroku, DigitalOcean, AWS, Railway
- **Database**: MongoDB Atlas
- **Frontend**: Netlify, Vercel, GitHub Pages

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC License

## Support

For issues and questions, please open an issue on the GitHub repository.

## Roadmap

- [ ] Email verification
- [ ] Password reset functionality
- [ ] Advanced search filters
- [ ] Ticket QR code generation
- [ ] Real-time notifications
- [ ] Admin panel for ticket validation
- [ ] Reviews and ratings system
- [ ] Mobile application (React Native)
- [ ] Enhanced analytics dashboard

---

Built with ❤️ using Node.js, Express, MongoDB, and Stripe
