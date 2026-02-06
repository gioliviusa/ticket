# TicketSwap - Secure Ticket Resale Marketplace

A modern, secure web application for buying and selling event tickets with built-in validation and Stripe payment integration.

## Features

- **User Authentication**: Secure signup/login system with JWT tokens
- **Ticket Listing with Validation**: 
  - Transferability check
  - 72-hour minimum event date requirement
  - Price cap verification (≤120% of face value)
- **Marketplace Discovery**: Browse and filter tickets by event, price, and status
- **Stripe Integration**: Mock Stripe checkout for secure payments
- **Escrow System**: Payment held until ticket transfer is confirmed
- **User Dashboard**: Track listings, purchases, and sales
- **Transaction History**: Complete view of all ticket transactions

## Technology Stack

- **Frontend**: React 19, Vite
- **Backend**: Node.js, Express
- **Authentication**: JWT, bcryptjs
- **Payment**: Stripe (mock for prototype)
- **Styling**: Custom CSS with modern design

## Installation

1. Clone the repository:
```bash
git clone https://github.com/gioliviusa/ticket.git
cd ticket
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration (optional for development)

## Running the Application

### Development Mode

Run the frontend and backend separately:

**Terminal 1 - Frontend (Vite Dev Server):**
```bash
npm run dev
```

**Terminal 2 - Backend (Express Server):**
```bash
npm run server
```

The frontend will be available at `http://localhost:5173` (or the port Vite assigns)
The backend API runs on `http://localhost:3000`

### Production Mode

1. Build the frontend:
```bash
npm run build
```

2. Set environment to production in `.env`:
```
NODE_ENV=production
```

3. Start the server:
```bash
npm start
```

The application will serve the built frontend and API from `http://localhost:3000`

## Usage

### For Sellers:
1. Sign up or log in
2. Click "Sell Ticket"
3. Fill out the ticket details
4. Watch the real-time validation checks
5. Submit the listing

### For Buyers:
1. Browse the marketplace
2. Filter tickets by event, price, or status
3. View ticket details
4. Click "Buy Now" to purchase (mock Stripe checkout)
5. Confirm receipt after receiving the ticket

## Project Structure

```
ticket/
├── server/
│   ├── index.js              # Express server
│   └── routes/
│       ├── auth.js           # Authentication routes
│       ├── listings.js       # Ticket listing routes
│       └── checkout.js       # Payment and transaction routes
├── src/
│   ├── components/
│   │   └── Header.jsx        # Navigation header
│   ├── pages/
│   │   ├── Login.jsx         # Login page
│   │   ├── Signup.jsx        # Signup page
│   │   ├── Marketplace.jsx   # Browse tickets
│   │   ├── SellTicket.jsx    # Create listing
│   │   ├── ListingDetail.jsx # Ticket details
│   │   └── Dashboard.jsx     # User dashboard
│   ├── styles/
│   │   └── index.css         # Global styles
│   ├── App.jsx               # Main app component
│   └── main.jsx              # React entry point
├── index.html                # HTML template
├── vite.config.js            # Vite configuration
└── package.json              # Dependencies and scripts
```

## Security Features

- ✓ Password hashing with bcryptjs
- ✓ JWT token authentication
- ✓ Input validation
- ✓ CORS protection
- ✓ Escrow payment system
- ✓ SSL/HTTPS ready (configure in production)

## Design

Clean, modern interface with:
- Deep blue primary color (#1e40af)
- Green accents for success states (#059669)
- Orange CTAs for important actions (#f97316)
- Responsive design for all screen sizes
- Trust badges (SSL, Stripe)

## Development Notes

- In-memory data storage (for prototype - replace with database for production)
- Mock Stripe integration (integrate real Stripe API for production)
- No file upload implemented yet (planned for ticket proof documents)

## Future Enhancements

- [ ] Real database integration (MongoDB/PostgreSQL)
- [ ] Actual Stripe payment processing
- [ ] File upload for ticket documents
- [ ] Email notifications
- [ ] User ratings and reviews
- [ ] Admin panel for moderation
- [ ] Mobile app
- [ ] Social login (Google, Facebook)

## License

ISC

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

