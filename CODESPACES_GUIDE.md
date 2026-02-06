# 🚀 GitHub Codespaces Guide for TicketSwap

**YES! You should absolutely use Codespaces!** It's the easiest way to run TicketSwap without installing anything on your computer.

---

## 🌟 Why Use GitHub Codespaces?

✅ **No Installation Required** - Everything runs in your browser
✅ **Pre-configured Environment** - Node.js, npm, and everything ready to go
✅ **Works on Any Device** - Chromebook, tablet, even your phone!
✅ **Free Tier Available** - 60 hours/month free
✅ **Automatic Setup** - Dependencies install automatically
✅ **Easy MongoDB Setup** - Use cloud MongoDB (no local installation)

---

## 🎯 Complete Codespaces Setup (5 Minutes)

### STEP 1: Open GitHub Codespaces

**Method A: From the Repository Page**

1. Go to https://github.com/gioliviusa/ticket
2. Click the green **"Code"** button
3. Click the **"Codespaces"** tab
4. Click **"Create codespace on main"**

**Method B: Direct Link**

Click this link: https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=gioliviusa/ticket

**What happens next:**
- A new browser tab opens
- You see "Setting up your codespace..." (takes 1-2 minutes)
- A VS Code editor appears in your browser
- Terminal at the bottom shows installation progress

✅ **Success:** You see a VS Code interface with your files on the left and a terminal at the bottom.

---

### STEP 2: Wait for Automatic Setup

**You'll see in the terminal:**
```
Installing dependencies...
npm install
```

This happens automatically! Just wait until you see:
```
added 143 packages
```

✅ **Success:** Terminal shows a prompt like `@username ➜ /workspaces/ticket (main) $`

---

### STEP 3: Set Up MongoDB Atlas (Cloud Database)

Since we're in the cloud, we'll use MongoDB Atlas (also cloud-based).

**3A: Sign up for MongoDB Atlas**

1. Open a new browser tab: https://www.mongodb.com/cloud/atlas/register
2. Sign up with your email (it's free!)
3. Verify your email

**3B: Create a Free Cluster**

1. Click **"Build a Database"**
2. Choose **"M0 FREE"** (should be selected)
3. Pick a cloud provider (AWS is fine)
4. Choose a region close to you
5. Click **"Create"**
6. **Wait 2-3 minutes** for cluster creation

**3C: Create Database User**

1. You'll see "Security Quickstart"
2. Username: `ticketswap`
3. Click **"Autogenerate Secure Password"**
4. **COPY THE PASSWORD!** Save it somewhere safe
5. Click **"Create User"**

**3D: Allow Connection from Anywhere**

1. Scroll to "Where would you like to connect from?"
2. Click **"Add My Current IP Address"**
3. Then click **"Allow Access from Anywhere"** (for Codespaces)
4. Click **"Finish and Close"**

**3E: Get Connection String**

1. Click **"Connect"** button on your cluster
2. Click **"Drivers"**
3. Copy the connection string (looks like):
   ```
   mongodb+srv://ticketswap:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password
5. Add `/ticketswap` before the `?`:
   ```
   ******cluster0.xxxxx.mongodb.net/ticketswap?retryWrites=true&w=majority
   ```

---

### STEP 4: Create .env File in Codespaces

**In your Codespaces terminal (bottom of screen):**

**Copy and paste this command:**
```bash
cat > .env << 'EOF'
PORT=5000
NODE_ENV=development
JWT_SECRET=$(openssl rand -base64 32)
CLIENT_URL=https://$(echo $CODESPACE_NAME)-3000.app.github.dev
MONGODB_URI=your_connection_string_here
SERVICE_FEE_RATE=0.10
EOF
```

**Then press Enter**

**Now edit the .env file:**

1. In the left sidebar (file explorer), click on `.env` file
2. Find the line: `MONGODB_URI=your_connection_string_here`
3. Replace `your_connection_string_here` with your MongoDB Atlas connection string
4. **Save the file:** Press `Ctrl+S` (or `Cmd+S` on Mac)

✅ **Success:** Your .env file now has your MongoDB connection string.

---

### STEP 5: Start the TicketSwap Server

**In the terminal (bottom of screen), type:**

```bash
npm start
```

**Press Enter**

**What you'll see:**
```
> ticket@1.0.0 start
> node server/server.js

Server is running on port 5000
MongoDB connected successfully
```

✅ **Success:** Server is running!

**Important:** A popup will appear saying "Your application running on port 5000 is available."
- Click **"Open in Browser"** or **"Make Public"**

---

### STEP 6: Load Sample Data

**Open a NEW terminal:**
1. Click the **"+"** button in the terminal panel (top right of terminal)
2. Or press ``Ctrl+Shift+` `` (backtick key)

**In the NEW terminal, type:**

```bash
npm run seed
```

**Press Enter**

**You'll see:**
```
🌱 Starting database seeding...
✅ Connected to MongoDB
👥 Creating sample users...
✅ Created user: alice@example.com
...
✅ Database seeded successfully!
```

✅ **Success:** Sample data loaded!

**Sample Login:**
- Email: `alice@example.com`
- Password: `password123`

---

### STEP 7: Open the Application

**You have two options:**

**Option A: Using the Ports Tab (Recommended)**

1. Look at the bottom of Codespaces - find the **"PORTS"** tab
2. Click it (next to "TERMINAL")
3. You'll see port 5000 listed
4. Hover over port 5000
5. Click the **globe icon** 🌐 (opens in new tab)

**Option B: Using Simple HTTP Server for Frontend**

**In a terminal, type:**
```bash
cd client
python3 -m http.server 3000
```

Then in the PORTS tab, click the globe icon next to port 3000.

---

### STEP 8: Test Everything!

**Test 1: API Health Check**

In the PORTS tab:
1. Right-click on port 5000
2. Click "Copy Local Address"
3. Open new browser tab
4. Paste the address and add `/api/health`
5. You should see: `{"status":"OK","message":"TicketSwap API is running"}`

**Test 2: Browse Tickets**

1. Open the frontend (port 3000 from PORTS tab)
2. Navigate to `tickets.html`
3. You should see 5 sample tickets!

**Test 3: Login**

1. Navigate to `login.html`
2. Email: `alice@example.com`
3. Password: `password123`
4. Click Login
5. You're redirected to the dashboard!

---

## 🎮 Using Codespaces - Quick Tips

### Opening Terminal
- **Already open!** Look at the bottom of your screen
- To open another: Press ``Ctrl+Shift+` ``
- Or click the **"+"** button in terminal panel

### Running Commands
Just type (or copy/paste) into the terminal at the bottom:
```bash
npm start          # Start server
npm run seed       # Load sample data
npm run test:api   # Test API
npm run dev        # Development mode
```

### Viewing Files
- Click files in the left sidebar to edit
- Changes save automatically (or Ctrl+S)

### Viewing the Application
- Use the **PORTS** tab at the bottom
- Click globe icon 🌐 to open in browser

### Stopping the Server
- Click in the terminal where server is running
- Press `Ctrl+C`

---

## 💰 Codespaces Pricing

**Free Tier:**
- 60 hours/month free
- 15 GB storage
- Perfect for learning and testing

**After Free Tier:**
- ~$0.18 per hour (very affordable)
- Only charges when actively using

**Pro Tip:** Stop your Codespace when not using it!
- Codespaces auto-stop after 30 minutes of inactivity
- You won't be charged when stopped

---

## 🐛 Codespaces Troubleshooting

### Problem: "Port 5000 not available"
**Solution:** 
1. Stop the server (Ctrl+C in terminal)
2. Wait 5 seconds
3. Start again: `npm start`

---

### Problem: "Cannot connect to MongoDB"
**Solution:** 
1. Check your .env file has the correct connection string
2. Make sure you replaced `<password>` with your actual password
3. Verify the connection string ends with `/ticketswap?retryWrites=true&w=majority`

---

### Problem: "Login doesn't work"
**Solution:**
1. Make sure you ran `npm run seed`
2. Check the terminal for "Database seeded successfully"
3. Use credentials: alice@example.com / password123

---

### Problem: "Page not loading"
**Solution:**
1. Check the PORTS tab - is port 5000 listed?
2. If not, server isn't running - run `npm start`
3. Click the globe icon 🌐 next to port 5000

---

### Problem: "Frontend shows old data"
**Solution:**
1. In Codespaces, you need to update the API URL
2. Open `client/login.html` (or any HTML file)
3. Find: `const API_URL = 'http://localhost:5000/api';`
4. Replace with: `const API_URL = 'https://' + window.location.hostname.replace(/^(\d+)-/, '5000-') + '/api';`

Or use the Python server method (Step 7, Option B).

---

## 📊 Codespaces vs Local Setup

| Feature | Codespaces | Local Setup |
|---------|-----------|-------------|
| **Installation** | None needed | Install Node.js, MongoDB |
| **Setup Time** | 5 minutes | 10-20 minutes |
| **Disk Space** | None (cloud) | ~500MB |
| **Works On** | Any device | Your computer only |
| **Cost** | Free (60hrs/month) | Free (hardware cost) |
| **Speed** | Internet dependent | Full speed |
| **Access** | From anywhere | Only on your device |

**Recommendation:**
- 🏆 **Codespaces** if you're just testing or don't want to install anything
- 🖥️ **Local** if you're developing long-term or have slow internet

---

## 🎯 Quick Reference - Codespaces Commands

```bash
# Start server (first terminal)
npm start

# Load sample data (second terminal)
npm run seed

# Test API (third terminal)
npm run test:api

# Start frontend server (optional)
cd client && python3 -m http.server 3000

# Stop server
Ctrl+C
```

---

## 🎉 You're All Set!

You've learned:
- ✅ How to create a GitHub Codespace
- ✅ How to set up MongoDB Atlas
- ✅ How to configure environment variables
- ✅ How to start the server
- ✅ How to load sample data
- ✅ How to view the application
- ✅ How to troubleshoot issues

**Now you can develop TicketSwap from any device with a browser!** 🎫

---

## 🔄 Next Time You Use Codespaces

**Returning to Your Codespace:**

1. Go to https://github.com/codespaces
2. Click on your existing codespace
3. It will reopen with everything saved!

**Starting the Server Again:**

1. Open terminal
2. Type: `npm start`
3. Open PORTS tab
4. Click globe icon on port 5000

**Your MongoDB and .env are saved!**

---

## 🆘 Need More Help?

- **Codespaces Docs:** https://docs.github.com/en/codespaces
- **TicketSwap Docs:** See [GETTING_STARTED.md](GETTING_STARTED.md)
- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com/

---

**Enjoy coding from anywhere! ☁️ 🎫**
