# Deployment Guide - TicketSwap

Complete guide for deploying TicketSwap to production environments.

## 📋 Table of Contents

- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Local Development Deployment](#local-development-deployment)
- [Production Deployment Options](#production-deployment-options)
  - [Heroku](#option-1-heroku-easiest)
  - [DigitalOcean](#option-2-digitalocean-app-platform)
  - [AWS EC2](#option-3-aws-ec2)
  - [Railway](#option-4-railway)
- [Database Deployment](#database-deployment)
- [Frontend Deployment](#frontend-deployment)
- [Environment Configuration](#environment-configuration)
- [Security Considerations](#security-considerations)
- [Monitoring and Maintenance](#monitoring-and-maintenance)

---

## Pre-Deployment Checklist

Before deploying to production:

- [ ] All environment variables configured
- [ ] MongoDB production instance ready
- [ ] Stripe API keys obtained (production keys)
- [ ] OAuth credentials configured (if using)
- [ ] Domain name purchased (optional but recommended)
- [ ] SSL certificate ready (most platforms provide free SSL)
- [ ] Rate limits reviewed and adjusted
- [ ] Error logging configured
- [ ] Backup strategy in place

---

## Local Development Deployment

See [QUICKSTART.md](QUICKSTART.md) for local development setup.

---

## Production Deployment Options

### Option 1: Heroku (Easiest)

Heroku provides a simple deployment experience with built-in MongoDB support.

#### Step 1: Install Heroku CLI
```bash
# Mac
brew tap heroku/brew && brew install heroku

# Windows
# Download from https://devcenter.heroku.com/articles/heroku-cli

# Linux
curl https://cli-assets.heroku.com/install.sh | sh
```

#### Step 2: Login and Create App
```bash
heroku login
heroku create ticketswap-app-name
```

#### Step 3: Add MongoDB
```bash
# Add MongoDB Atlas or mLab
heroku addons:create mongolab:sandbox
# OR
heroku addons:create mongodb-atlas:M0
```

#### Step 4: Configure Environment Variables
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=$(openssl rand -base64 32)
heroku config:set STRIPE_SECRET_KEY=sk_live_your_key
heroku config:set STRIPE_PUBLISHABLE_KEY=pk_live_your_key
heroku config:set CLIENT_URL=https://your-frontend-domain.com
heroku config:set SERVICE_FEE_RATE=0.10

# Optional OAuth
heroku config:set GOOGLE_CLIENT_ID=your_client_id
heroku config:set GOOGLE_CLIENT_SECRET=your_client_secret
heroku config:set GOOGLE_CALLBACK_URL=https://your-app.herokuapp.com/api/auth/google/callback
```

#### Step 5: Deploy
```bash
git push heroku main
```

#### Step 6: Verify
```bash
heroku open
heroku logs --tail
```

**Frontend Deployment:**
Deploy the `client` folder to Netlify, Vercel, or GitHub Pages (see [Frontend Deployment](#frontend-deployment))

---

### Option 2: DigitalOcean App Platform

#### Step 1: Prepare Your Repository
Ensure your code is in a GitHub repository.

#### Step 2: Create App on DigitalOcean
1. Go to https://cloud.digitalocean.com/apps
2. Click "Create App"
3. Connect your GitHub repository
4. Select the `ticket` repository

#### Step 3: Configure Build Settings
```yaml
name: ticketswap
services:
  - name: api
    github:
      repo: gioliviusa/ticket
      branch: main
    build_command: npm install
    run_command: npm start
    environment_slug: node-js
    instance_count: 1
    instance_size_slug: basic-xxs
    routes:
      - path: /api
    envs:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: "8080"
```

#### Step 4: Add Database
1. In DigitalOcean, go to Databases
2. Create a MongoDB cluster
3. Copy the connection string
4. Add as environment variable

#### Step 5: Configure Environment Variables
Add in DigitalOcean App Platform settings:
- `NODE_ENV=production`
- `MONGODB_URI=your_mongodb_connection_string`
- `JWT_SECRET=your_secret`
- `STRIPE_SECRET_KEY=sk_live_xxx`
- `CLIENT_URL=https://your-frontend.com`

#### Step 6: Deploy
Click "Deploy" in the DigitalOcean dashboard.

---

### Option 3: AWS EC2

#### Step 1: Launch EC2 Instance
1. Go to AWS EC2 Console
2. Launch new instance (Ubuntu 22.04 LTS)
3. Choose t2.micro (free tier eligible)
4. Configure security group:
   - Port 22 (SSH)
   - Port 80 (HTTP)
   - Port 443 (HTTPS)
   - Port 5000 (API - temporarily)

#### Step 2: Connect and Setup
```bash
# Connect to instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB (optional, use Atlas instead)
# See: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx (reverse proxy)
sudo apt install -y nginx
```

#### Step 3: Clone and Setup Application
```bash
# Clone repository
git clone https://github.com/gioliviusa/ticket.git
cd ticket

# Install dependencies
npm install --production

# Create .env file
nano .env
# Add all production environment variables
```

#### Step 4: Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/ticketswap
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        root /home/ubuntu/ticket/client;
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/ticketswap /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 5: Start Application with PM2
```bash
cd /home/ubuntu/ticket
pm2 start server/server.js --name ticketswap
pm2 startup
pm2 save
```

#### Step 6: Setup SSL with Let's Encrypt
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

### Option 4: Railway

Railway provides a modern deployment experience.

#### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
```

#### Step 2: Login and Initialize
```bash
railway login
railway init
```

#### Step 3: Add MongoDB
```bash
railway add mongodb
```

#### Step 4: Deploy
```bash
railway up
```

#### Step 5: Set Environment Variables
```bash
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=your_secret
railway variables set STRIPE_SECRET_KEY=sk_live_xxx
```

---

## Database Deployment

### MongoDB Atlas (Recommended)

#### Step 1: Create Cluster
1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a free M0 cluster
3. Choose a cloud provider and region
4. Create cluster (takes 3-5 minutes)

#### Step 2: Create Database User
1. Database Access → Add New Database User
2. Username: `ticketswap`
3. Password: Generate secure password
4. User Privileges: Read and write to any database

#### Step 3: Configure Network Access
1. Network Access → Add IP Address
2. For development: Allow access from anywhere (0.0.0.0/0)
3. For production: Add specific IP addresses

#### Step 4: Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy connection string
4. Replace `<password>` with your database user password
5. Replace `<dbname>` with `ticketswap`

Example:
```
mongodb+srv://ticketswap:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/ticketswap?retryWrites=true&w=majority
```

#### Step 5: Create Indexes
Connect to your database and run:
```javascript
// Text search index for tickets
db.tickets.createIndex({ 
  eventName: "text", 
  eventLocation: "text", 
  eventVenue: "text" 
})

// Performance indexes
db.tickets.createIndex({ eventDate: 1, status: 1 })
db.tickets.createIndex({ seller: 1 })
db.transactions.createIndex({ buyer: 1, createdAt: -1 })
db.transactions.createIndex({ seller: 1, createdAt: -1 })
db.users.createIndex({ email: 1 }, { unique: true })
db.tickets.createIndex({ ticketBarcode: 1 }, { unique: true })
```

---

## Frontend Deployment

### Option 1: Netlify

#### Using Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Navigate to client folder
cd client

# Deploy
netlify deploy --prod
```

#### Using Netlify Web Interface
1. Go to https://app.netlify.com
2. Drag and drop the `client` folder
3. Update API URLs in HTML files to point to your backend
4. Configure custom domain (optional)

### Option 2: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd client
vercel --prod
```

### Option 3: GitHub Pages

```bash
# Enable GitHub Pages for your repository
# Settings → Pages → Source → main branch → /client folder

# Your site will be available at:
# https://gioliviusa.github.io/ticket/
```

**Important:** Update API URLs in all HTML files:
```javascript
// Change from
const API_URL = 'http://localhost:5000/api';

// To
const API_URL = 'https://your-backend-domain.com/api';
```

### Option 4: Same Server (with Nginx)

Already configured in the AWS EC2 setup above. Nginx serves static files from `/client` directory.

---

## Environment Configuration

### Production Environment Variables

Create a `.env` file with:

```env
# Server
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/ticketswap

# JWT (Generate with: openssl rand -base64 32)
JWT_SECRET=your_super_secure_random_string_here

# Stripe (PRODUCTION keys from dashboard.stripe.com)
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxx

# OAuth (Optional)
GOOGLE_CLIENT_ID=xxxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxx
GOOGLE_CALLBACK_URL=https://your-domain.com/api/auth/google/callback

FACEBOOK_APP_ID=xxxxxxxxxxxxx
FACEBOOK_APP_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
FACEBOOK_CALLBACK_URL=https://your-domain.com/api/auth/facebook/callback

# Frontend URL
CLIENT_URL=https://your-frontend-domain.com

# Service Fee (10% = 0.10)
SERVICE_FEE_RATE=0.10
```

### Security Best Practices

1. **Never commit .env files**
   ```bash
   # Already in .gitignore, but verify:
   echo ".env" >> .gitignore
   ```

2. **Use strong secrets**
   ```bash
   # Generate strong JWT secret
   openssl rand -base64 32
   ```

3. **Rotate secrets regularly**
   - Change JWT_SECRET every 90 days
   - Rotate database passwords
   - Update OAuth credentials

4. **Use environment-specific configs**
   - Development: `.env.development`
   - Production: `.env.production`
   - Test: `.env.test`

---

## Security Considerations

### Before Going Live

1. **Rate Limiting**: Already configured, but review limits in `server/middleware/rateLimiter.js`

2. **HTTPS Only**: Ensure all production traffic uses HTTPS

3. **Secure Headers**: Consider adding helmet.js
   ```bash
   npm install helmet
   ```
   
   ```javascript
   // In server/server.js
   const helmet = require('helmet');
   app.use(helmet());
   ```

4. **Input Validation**: Already implemented with express-validator

5. **MongoDB Security**:
   - Use strong passwords
   - Enable IP whitelisting
   - Use connection string encryption

6. **Stripe Webhooks**: 
   - Configure webhook endpoint: `https://your-domain.com/api/payments/webhook`
   - Use webhook secret for verification

7. **CORS Configuration**: Update CLIENT_URL to production frontend

---

## Monitoring and Maintenance

### Logging

Add production logging:
```bash
npm install winston
```

### Health Checks

Monitor these endpoints:
- `GET /api/health` - Server health
- MongoDB connection status
- Stripe API connectivity

### Backup Strategy

1. **Database Backups**:
   - MongoDB Atlas: Automatic daily backups
   - Self-hosted: Use `mongodump`
   ```bash
   mongodump --uri="mongodb://..." --out=/backup/$(date +%Y%m%d)
   ```

2. **Code Backups**:
   - Git repository (already handled)
   - Regular commits and tags

### Monitoring Services

Consider using:
- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Error Tracking**: Sentry, Rollbar
- **Performance**: New Relic, DataDog
- **Logs**: Loggly, Papertrail

### Scaling Considerations

1. **Horizontal Scaling**: Deploy multiple instances behind a load balancer
2. **Database**: Use MongoDB replica sets
3. **Caching**: Add Redis for session storage
4. **CDN**: Use Cloudflare for static assets

---

## Troubleshooting Production Issues

### Server Won't Start
```bash
# Check logs
pm2 logs ticketswap
# or
heroku logs --tail
```

### Database Connection Fails
```bash
# Test MongoDB connection
mongo "mongodb+srv://cluster.mongodb.net/test" --username user
```

### Payment Issues
- Verify Stripe webhook configuration
- Check Stripe dashboard for failed payments
- Ensure webhook secret matches

### OAuth Not Working
- Check redirect URLs match exactly
- Verify OAuth credentials
- Enable OAuth consent screen

---

## Post-Deployment Checklist

After deployment:

- [ ] Test user registration
- [ ] Test login (email and OAuth)
- [ ] Create a test ticket listing
- [ ] Browse tickets
- [ ] Test search and filters
- [ ] Test payment flow (with test cards)
- [ ] Check error logging
- [ ] Monitor server resources
- [ ] Setup backup schedule
- [ ] Configure monitoring alerts
- [ ] Document deployment process
- [ ] Share access credentials with team

---

## Support

For deployment issues:
- Check logs first
- Review error messages
- Consult platform documentation
- Open a GitHub issue

---

**Deployment Complete! Your TicketSwap marketplace is now live! 🎉**
