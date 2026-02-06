# 🎫 TicketSwap - Complete Step-by-Step Guide

**Perfect for absolute beginners!** This guide tells you exactly what to do, where to click, and what to copy/paste.

---

## 📋 Before You Start

### Check if You Have These Installed

**1. Check Node.js**
```bash
node --version
```
- ✅ If you see a version like `v18.x.x` or `v20.x.x` - **You're good!**
- ❌ If you see "command not found" - **Install Node.js first** (see below)

**2. Check if you have Git**
```bash
git --version
```
- ✅ If you see a version - **You're good!**
- ❌ If not - **Install Git first** (see below)

### Install Missing Software

**Need Node.js?**
1. Go to https://nodejs.org/
2. Click the big green button that says "LTS" (Recommended)
3. Download and install
4. Close and reopen your terminal

**Need Git?**
1. Go to https://git-scm.com/downloads
2. Download for your operating system
3. Install with default settings
4. Close and reopen your terminal

---

## 🚀 STEP 1: Open Your Terminal

**On Mac:**
1. Press `Cmd + Space`
2. Type "Terminal"
3. Press Enter

**On Windows:**
1. Press `Windows Key`
2. Type "cmd" or "PowerShell"
3. Press Enter

**On Linux:**
1. Press `Ctrl + Alt + T`

You should see a black/white window with a cursor blinking. This is your terminal!

---

## 📥 STEP 2: Download TicketSwap

**Copy this command EXACTLY** (click the copy button or select and copy):

```bash
git clone https://github.com/gioliviusa/ticket.git
```

**Where to paste:**
1. Click inside your terminal window
2. **Paste** the command:
   - **Mac:** Press `Cmd + V` or right-click → Paste
   - **Windows:** Right-click → Paste or press `Shift + Insert`
   - **Linux:** Right-click → Paste or press `Ctrl + Shift + V`
3. Press `Enter`

**What you'll see:**
```
Cloning into 'ticket'...
remote: Enumerating objects: 100, done.
remote: Counting objects: 100% (100/100), done.
...
```

**✅ Success:** You'll see "done" at the end and return to the command prompt.

---

## 📁 STEP 3: Enter the TicketSwap Folder

**Copy this command:**

```bash
cd ticket
```

**Paste it in your terminal** and press `Enter`.

**What this does:** Changes your location to inside the "ticket" folder.

**✅ Success:** Your terminal prompt will now show "ticket" in the path, like:
```
~/ticket$
```
or
```
C:\Users\YourName\ticket>
```

---

## 🔧 STEP 4: Run the Automated Setup

This magical command will set everything up for you automatically!

**Copy this command:**

```bash
npm run setup
```

**Paste it** and press `Enter`.

**What you'll see:**
```
🎫 TicketSwap Setup Script
==========================

Checking Node.js...
✅ Node.js v18.x.x installed
✅ npm x.x.x installed

📦 Installing dependencies...
```

This will take **1-2 minutes**. You'll see lots of text scrolling by. **This is normal!**

**Wait until you see:**
```
✅ Setup Complete!

📋 Next Steps:
   1. Start MongoDB (if using locally):
      mongod
   ...
```

**✅ Success:** You see "Setup Complete!" and instructions for next steps.

---

## 🗄️ STEP 5: Set Up the Database (MongoDB)

You have **two options**: Easy (Cloud) or Local.

### Option A: MongoDB Atlas (Cloud) - EASIEST ⭐ Recommended

**Why this is easier:** No installation needed, works from anywhere, completely free.

**Step 5A-1:** Go to https://www.mongodb.com/cloud/atlas/register

**Step 5A-2:** Sign up for a free account
- Use your email
- Create a password
- Check the box for terms

**Step 5A-3:** Create a FREE cluster
1. Click "Create" or "Build a Database"
2. Choose **"M0 Free"** (should be selected by default)
3. Click "Create" or "Create Deployment"
4. **Wait 2-3 minutes** for it to be created

**Step 5A-4:** Create a database user
1. You'll see a screen asking for username/password
2. Choose a username: `ticketswap`
3. Click "Autogenerate Secure Password" - **COPY THIS PASSWORD!** (you'll need it)
4. Click "Create User"

**Step 5A-5:** Allow connection from anywhere (for testing)
1. Scroll down to "Where would you like to connect from?"
2. Click "Add My Current IP Address" 
3. Or click "Allow Access from Anywhere" (easier for testing)
4. Click "Finish and Close"

**Step 5A-6:** Get your connection string
1. Click "Connect" button
2. Click "Drivers"
3. You'll see a connection string that looks like:
   ```
   mongodb+srv://ticketswap:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. **Copy this entire string**
5. Replace `<password>` with the password you copied earlier
6. Add `/ticketswap` before the `?`, like:
   ```
   mongodb+srv://ticketswap:YourPassword123@cluster0.xxxxx.mongodb.net/ticketswap?retryWrites=true&w=majority
   ```

**Step 5A-7:** Update your .env file

**On Mac/Linux:**
```bash
nano .env
```

**On Windows:**
```bash
notepad .env
```

1. Find the line that says:
   ```
   MONGODB_URI=mongodb://localhost:27017/ticketswap
   ```

2. Replace it with your connection string:
   ```
   MONGODB_URI=mongodb+srv://ticketswap:YourPassword123@cluster0.xxxxx.mongodb.net/ticketswap?retryWrites=true&w=majority
   ```

3. **Save the file:**
   - **nano (Mac/Linux):** Press `Ctrl + X`, then `Y`, then `Enter`
   - **notepad (Windows):** File → Save, then close

**✅ Success:** Your .env file now has the MongoDB Atlas connection string.

---

### Option B: Local MongoDB (More Complex)

**Only choose this if you want to run MongoDB on your computer.**

**Step 5B-1:** Install MongoDB

**Mac:**
```bash
brew tap mongodb/brew
brew install mongodb-community
```

**Windows:**
1. Go to https://www.mongodb.com/try/download/community
2. Download the installer
3. Run it with default settings

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install -y mongodb
```

**Step 5B-2:** Start MongoDB

**Mac:**
```bash
brew services start mongodb-community
```

**Windows:**
- MongoDB should start automatically
- Or search for "Services" → Find "MongoDB" → Click "Start"

**Linux:**
```bash
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

**✅ Success:** MongoDB is running in the background.

---

## 🚀 STEP 6: Start the TicketSwap Server

**Copy this command:**

```bash
npm start
```

**Paste it** and press `Enter`.

**What you'll see:**
```
> ticket@1.0.0 start
> node server/server.js

Server is running on port 5000
MongoDB connected successfully
```

**✅ Success:** You see "Server is running" and "MongoDB connected successfully"

**❌ Error?** See troubleshooting section below.

**Important:** Leave this terminal window open! The server needs to keep running.

---

## 🎯 STEP 7: Load Sample Data (Optional but Recommended)

This adds test users and tickets so you can try everything immediately!

**Open a NEW terminal window** (keep the first one running!)

**Navigate to the ticket folder again:**
```bash
cd ticket
```
*(Replace with the full path if needed, like `cd C:\Users\YourName\ticket`)*

**Copy this command:**

```bash
npm run seed
```

**Paste it** and press `Enter`.

**What you'll see:**
```
🌱 Starting database seeding...

📡 Connecting to MongoDB...
✅ Connected to MongoDB

👥 Creating sample users...
   ✅ Created user: alice@example.com
   ✅ Created user: bob@example.com
   ✅ Created user: charlie@example.com

🎫 Creating sample tickets...
   ✅ Created ticket: Taylor Swift - The Eras Tour
   ✅ Created ticket: Coachella 2026
   ...

✅ Database seeded successfully!
🚀 You can now test the application with sample data.
```

**✅ Success:** You see "Database seeded successfully!"

**Sample Login Credentials:**
- Email: `alice@example.com`
- Password: `password123`

---

## 🌐 STEP 8: Open TicketSwap in Your Browser

**Step 8-1:** Open your web browser (Chrome, Firefox, Safari, Edge)

**Step 8-2:** Open the homepage

**Method 1: Direct File (Simplest)**
1. Open your file explorer
2. Navigate to where you downloaded the `ticket` folder
3. Go into the `client` folder
4. **Double-click** `index.html`

**Method 2: Type the path**

**Mac/Linux:**
```
file:///Users/YourUsername/ticket/client/index.html
```
*(Replace YourUsername with your actual username)*

**Windows:**
```
file:///C:/Users/YourUsername/ticket/client/index.html
```
*(Replace YourUsername with your actual username)*

**✅ Success:** You see the TicketSwap homepage with:
- 🎫 TicketSwap logo at the top
- "Secure Ticket Resale Marketplace" heading
- "Get Started" and "Browse Tickets" buttons
- Six feature cards with emojis

---

## 🎮 STEP 9: Test the Application

### Test 1: Browse Tickets (See Sample Data)

1. In the file explorer, open `client/tickets.html` (same folder)
2. **Or** click "Browse Tickets" button on the homepage

**You should see:** 5 sample tickets including:
- Taylor Swift - The Eras Tour
- Coachella 2026
- NBA Finals Game 7
- Ed Sheeran Live
- Broadway: Hamilton

**✅ Success:** You see ticket cards with prices and details.

---

### Test 2: Login to Dashboard

1. In file explorer, open `client/login.html`
2. **Or** navigate to that file in your browser

**Enter these credentials:**
- Email: `alice@example.com`
- Password: `password123`

3. Click "Login"

**✅ Success:** You're redirected to the dashboard showing:
- Welcome message
- Statistics (Active Listings, Total Sales, etc.)
- Your tickets tabs

---

### Test 3: Create a Ticket Listing

1. On the dashboard, click "Create New Listing"
2. Fill in the form:
   - **Event Name:** My Concert *(type anything you want)*
   - **Event Date:** *(click and choose a future date)*
   - **Location:** New York, NY
   - **Venue:** Madison Square Garden
   - **Ticket Type:** *(select VIP)*
   - **Quantity:** 1
   - **Section:** Floor
   - **Seat Number:** A25
   - **Ticket Barcode:** MYTICKET123 *(must be unique!)*
   - **Original Price:** 150
   - **Resale Price:** 200
   - **Description:** Great seats!

3. Click "Create Listing"

**✅ Success:** You see "Ticket listed successfully!" and are redirected to your dashboard.

---

### Test 4: Test the API

Open a new terminal and run:

```bash
npm run test:api
```

**You should see:**
```
🧪 TicketSwap Test Script
========================

1. Testing server health...
✅ Server is running

2. Testing user registration...
✅ Registration endpoint works

3. Testing tickets endpoint...
✅ Tickets endpoint accessible

4. Testing config endpoint...
✅ Config endpoint works
```

**✅ Success:** All tests pass with green checkmarks.

---

## 🎉 Congratulations! You've Successfully Set Up TicketSwap!

### What You Can Do Now:

✅ **Browse Tickets** - See all available tickets
✅ **Login** - Use alice@example.com / password123
✅ **View Dashboard** - See your statistics
✅ **Create Listings** - Add your own tickets
✅ **Search & Filter** - Find specific tickets
✅ **Test API** - All endpoints work

---

## 🐛 Troubleshooting

### Problem: "npm: command not found"
**Solution:** Node.js is not installed or not in PATH
```bash
# Check if Node.js is installed
node --version

# If nothing, install Node.js from https://nodejs.org/
```

---

### Problem: "MongoDB connection error"
**Solution:** MongoDB is not running or wrong connection string

**If using Atlas:**
1. Check your .env file has the correct connection string
2. Make sure you replaced `<password>` with your actual password
3. Check if you added `/ticketswap` before the `?`

**If using local MongoDB:**
```bash
# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongodb

# Windows
# Search for "Services" → Find "MongoDB" → Start
```

---

### Problem: "Port 5000 already in use"
**Solution:** Something else is using port 5000

**Option 1:** Stop the other service using port 5000

**Option 2:** Change TicketSwap's port
1. Open `.env` file
2. Change `PORT=5000` to `PORT=5001`
3. Restart server with `npm start`

---

### Problem: "Cannot find module"
**Solution:** Dependencies not installed
```bash
npm install
```

---

### Problem: "Page shows 'can't connect'"
**Solution:** Server is not running

1. Check your terminal with `npm start` - is it still running?
2. If closed, start it again: `npm start`
3. Make sure you see "Server is running on port 5000"

---

### Problem: "Login doesn't work"
**Solution:** Make sure sample data is loaded
```bash
npm run seed
```
Then try logging in with:
- Email: alice@example.com
- Password: password123

---

## 📚 What's Next?

Now that you have TicketSwap running:

1. **Explore the Application**
   - Try creating different types of tickets
   - Test search and filters
   - View your dashboard statistics

2. **Customize It**
   - Edit HTML files in `client/` folder
   - Change colors and styling
   - Add your own features

3. **Deploy It Online**
   - See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
   - Deploy to Heroku, AWS, or DigitalOcean

4. **Learn More**
   - [README.md](README.md) - API documentation
   - [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - Technical details

---

## 🆘 Still Need Help?

1. **Read the error message carefully** - It usually tells you what's wrong
2. **Check the terminal** - Look for red text with error details
3. **Try the troubleshooting section** above
4. **Review the documentation:**
   - [QUICKSTART.md](QUICKSTART.md) - Quick reference
   - [HOW_TO_CHECK_OUT.md](HOW_TO_CHECK_OUT.md) - Testing guide
   - [GETTING_STARTED.md](GETTING_STARTED.md) - Overview

---

## 📝 Quick Reference - All Commands

```bash
# Initial Setup
git clone https://github.com/gioliviusa/ticket.git
cd ticket
npm run setup

# Start Server
npm start

# Load Sample Data
npm run seed

# Test API
npm run test:api

# Development Mode (auto-reload)
npm run dev
```

---

## 🎯 Summary

You've learned:
- ✅ How to install Node.js and Git
- ✅ How to download TicketSwap
- ✅ How to set up MongoDB (cloud or local)
- ✅ How to start the server
- ✅ How to load sample data
- ✅ How to open the application
- ✅ How to test all features
- ✅ How to troubleshoot problems

**You're now ready to use TicketSwap!** 🎫

---

*Made with ❤️ for beginners*
