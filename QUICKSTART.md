# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Configure Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once created, go to **Project Settings** > **API**
3. Copy your **Project URL** and **anon/public key**
4. Update the `.env` file:

```env
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 2: Set Up Database

1. In your Supabase project, go to **SQL Editor**
2. Copy the entire content of `setup.sql` file
3. Paste and click **Run**
4. Go to **Database** > **Replication** and enable real-time for the `orders` table

### Step 3: Start the Server

```bash
python server.py 3000
```

Then open your browser to: **http://localhost:3000**

---

## 📱 Testing the System

### 1. Admin Panel
- Go to: http://localhost:3000/admin.html?lang=en
- You'll see sample tables and menu items already created
- Click on "View QR" next to any table to see the QR code

### 2. Customer Ordering
- Go to: http://localhost:3000/customer.html?table=TABLE_ID&lang=en
- Replace `TABLE_ID` with an actual table ID from the admin panel
- Browse menu, add items to cart, and place an order

### 3. Staff Dashboard
- Go to: http://localhost:3000/staff.html?lang=en
- You'll see orders appear in real-time
- Update order status (Pending → Preparing → Ready → Served)

---

## 🌍 Language URLs

Each interface supports 3 languages via URL parameter:

- **English**: `?lang=en`
- **French**: `?lang=fr`
- **Arabic**: `?lang=ar`

Example:
- http://localhost:3000/customer.html?table=xxx&lang=fr
- http://localhost:3000/staff.html?lang=ar
- http://localhost:3000/admin.html?lang=en

---

## 🔧 Troubleshooting

### "Failed to load configuration"
- Make sure `.env` file has valid Supabase credentials
- Restart the server after updating `.env`

### "Database connection failed"
- Check that you ran the `setup.sql` in Supabase
- Verify your Supabase project is active
- Check the credentials in `.env` are correct

### No real-time updates
- Enable real-time for `orders` table in Supabase Dashboard
- Go to: Database > Replication > Enable for `orders`

---

## 📊 How It Works

1. **Customer scans QR code** → Opens customer.html with table ID
2. **Customer orders** → Order saved to Supabase
3. **Staff sees order** → Real-time update in staff dashboard
4. **Staff updates status** → Customer can see status updates
5. **Admin manages** → Tables, menu items, view all orders

---

## 🎯 Next Steps

1. **Customize menu items** in the admin panel
2. **Generate QR codes** for each table
3. **Print QR codes** and place on tables
4. **Train staff** on using the dashboard
5. **Deploy** to production (see README.md for deployment tips)

---

## 📝 Important Notes

- Each table needs a separate entry for each language
- Menu items are language-specific
- Orders are linked to specific tables
- Real-time updates require WebSocket support
- Current setup is for development (see README.md for production security)

---

Need help? Check the full **README.md** for detailed documentation!
