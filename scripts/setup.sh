#!/bin/bash

# TicketSwap Setup Script
# This script helps you set up TicketSwap quickly for development

echo "🎫 TicketSwap Setup Script"
echo "=========================="
echo ""

# Check Node.js
echo "Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi
NODE_VERSION=$(node -v)
echo "✅ Node.js $NODE_VERSION installed"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed!"
    exit 1
fi
NPM_VERSION=$(npm -v)
echo "✅ npm $NPM_VERSION installed"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi
echo "✅ Dependencies installed"
echo ""

# Check for .env file
if [ ! -f .env ]; then
    echo "⚙️  Creating .env file..."
    
    # Generate a random JWT secret
    JWT_SECRET=$(openssl rand -base64 32 2>/dev/null || echo "change_this_secret_key_$(date +%s)")
    
    cat > .env << EOF
# Server Configuration
PORT=5000
NODE_ENV=development

# Database - Update with your MongoDB URI
MONGODB_URI=mongodb://localhost:27017/ticketswap

# JWT Secret - Auto-generated
JWT_SECRET=$JWT_SECRET

# Frontend URL
CLIENT_URL=http://localhost:3000

# Stripe (Optional - Get from https://dashboard.stripe.com/test/apikeys)
# STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
# STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
# STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret

# Google OAuth (Optional)
# GOOGLE_CLIENT_ID=your_google_client_id
# GOOGLE_CLIENT_SECRET=your_google_client_secret
# GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Facebook OAuth (Optional)
# FACEBOOK_APP_ID=your_facebook_app_id
# FACEBOOK_APP_SECRET=your_facebook_app_secret
# FACEBOOK_CALLBACK_URL=http://localhost:5000/api/auth/facebook/callback

# Service Fee (10% = 0.10)
SERVICE_FEE_RATE=0.10
EOF
    
    echo "✅ Created .env file with auto-generated JWT secret"
    echo ""
else
    echo "✅ .env file already exists"
    echo ""
fi

# Check MongoDB
echo "🔍 Checking MongoDB..."
if command -v mongod &> /dev/null; then
    echo "✅ MongoDB is installed locally"
    echo "   Start it with: mongod"
elif command -v mongo &> /dev/null; then
    echo "✅ MongoDB client is installed"
else
    echo "⚠️  MongoDB not found locally"
    echo "   Option 1: Install MongoDB locally"
    echo "   Option 2: Use MongoDB Atlas (cloud)"
    echo "   Visit: https://www.mongodb.com/cloud/atlas"
fi
echo ""

# Summary
echo "✅ Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "   1. Start MongoDB (if using locally):"
echo "      mongod"
echo ""
echo "   2. Update .env file with your MongoDB URI (if needed)"
echo ""
echo "   3. Start the server:"
echo "      npm start"
echo ""
echo "   4. Open the frontend:"
echo "      - Homepage: client/index.html"
echo "      - API Health: http://localhost:5000/api/health"
echo ""
echo "📚 Documentation:"
echo "   - Quick Start: QUICKSTART.md"
echo "   - Deployment: DEPLOYMENT.md"
echo "   - Full Docs: README.md"
echo ""
echo "Happy coding! 🎫"
