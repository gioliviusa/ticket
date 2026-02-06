#!/bin/bash

# TicketSwap Test Script
# Quick script to test if the application is working

echo "🧪 TicketSwap Test Script"
echo "========================"
echo ""

API_URL="http://localhost:5000/api"

# Check if server is running
echo "1. Testing server health..."
HEALTH=$(curl -s "$API_URL/health" 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ Server is running"
    echo "   Response: $HEALTH"
else
    echo "❌ Server is not running!"
    echo "   Start it with: npm start"
    exit 1
fi
echo ""

# Test registration endpoint
echo "2. Testing user registration..."
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
    -H "Content-Type: application/json" \
    -d '{
        "email": "test_'"$(date +%s)"'@example.com",
        "password": "testpassword123",
        "firstName": "Test",
        "lastName": "User"
    }' 2>/dev/null)

if echo "$REGISTER_RESPONSE" | grep -q "token"; then
    echo "✅ Registration endpoint works"
    
    # Extract token
    TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    echo "   Token received: ${TOKEN:0:20}..."
else
    echo "⚠️  Registration might need MongoDB"
    echo "   Response: $REGISTER_RESPONSE"
fi
echo ""

# Test tickets endpoint (public)
echo "3. Testing tickets endpoint..."
TICKETS=$(curl -s "$API_URL/tickets" 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ Tickets endpoint accessible"
    TICKET_COUNT=$(echo $TICKETS | grep -o '"tickets":\[' | wc -l)
    if [ $TICKET_COUNT -gt 0 ]; then
        echo "   Found tickets data"
    else
        echo "   No tickets yet (this is normal for a fresh install)"
    fi
else
    echo "❌ Tickets endpoint failed"
fi
echo ""

# Test config endpoint
echo "4. Testing config endpoint..."
CONFIG=$(curl -s "$API_URL/config/stripe" 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ Config endpoint works"
    echo "   Response: $CONFIG"
else
    echo "❌ Config endpoint failed"
fi
echo ""

# Summary
echo "📊 Test Summary"
echo "==============="
echo ""
echo "✅ Server is running and responding"

if [ -z "$MONGODB_URI" ] && [ -z "$TOKEN" ]; then
    echo "⚠️  MongoDB might not be configured"
    echo "   Check your .env file and ensure MongoDB is running"
fi

echo ""
echo "🎯 Test the full application:"
echo "   1. Open client/index.html in your browser"
echo "   2. Click 'Sign Up' and create an account"
echo "   3. Login and explore the dashboard"
echo "   4. Create a ticket listing"
echo "   5. Browse tickets"
echo ""
echo "For more tests, see QUICKSTART.md"
