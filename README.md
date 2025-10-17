# Restaurant QR Ordering System

A modern, multilingual restaurant ordering system with QR code integration. Built with pure HTML, CSS, and JavaScript with Supabase backend.

## Features

- 🌍 **Multilingual Support**: English, French, and Arabic with RTL support
- 📱 **Mobile-First Design**: Responsive and optimized for all devices
- 🔄 **Real-Time Updates**: Live order updates using Supabase real-time subscriptions
- 📊 **Admin Dashboard**: Manage tables, menu items, and orders
- 👨‍💼 **Staff Interface**: Kitchen and service staff order management
- 🛒 **Customer Ordering**: QR code-based table ordering system
- 👥 **Employee Management**: Add, edit, and manage restaurant staff with roles
- 📈 **Analytics Dashboard**: Track daily revenue, orders, and employee work hours
- ⏰ **Work History**: Monitor employee shifts and hours worked
- 💰 **Business Insights**: View comprehensive performance metrics
- 🤖 **AI Assistant**: Chat with an AI bot to get instant insights about your restaurant data

## Quick Start

### 1. Configure Supabase

Update the `.env` file with your Supabase credentials:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. Set Up Database

Run the SQL migration files in your Supabase SQL Editor:

**Core Database:**
```bash
# Run this first
setup_v3.sql
```

**Employee & Analytics Features (Optional but Recommended):**
```bash
# Run this after setup_v3.sql
setup_employee_shifts.sql
```

Or manually create the required tables:

```sql
-- Create tables table
CREATE TABLE tables (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    table_number INTEGER NOT NULL,
    language VARCHAR(2) NOT NULL DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create menu_items table
CREATE TABLE menu_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    language VARCHAR(2) NOT NULL DEFAULT 'en',
    available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    table_id UUID REFERENCES tables(id),
    items JSONB NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_tables_language ON tables(language);
CREATE INDEX idx_menu_items_language ON menu_items(language);
CREATE INDEX idx_menu_items_category ON menu_items(category);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_table_id ON orders(table_id);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust based on your security needs)
CREATE POLICY "Allow public read access to tables" ON tables FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to tables" ON tables FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to tables" ON tables FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access to tables" ON tables FOR DELETE USING (true);

CREATE POLICY "Allow public read access to menu_items" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to menu_items" ON menu_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to menu_items" ON menu_items FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access to menu_items" ON menu_items FOR DELETE USING (true);

CREATE POLICY "Allow public read access to orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to orders" ON orders FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access to orders" ON orders FOR DELETE USING (true);
```

### 3. Add Sample Data (Optional)

```sql
-- Insert sample tables for each language
INSERT INTO tables (table_number, language) VALUES
(1, 'en'), (2, 'en'), (3, 'en'),
(1, 'fr'), (2, 'fr'), (3, 'fr'),
(1, 'ar'), (2, 'ar'), (3, 'ar');

-- Insert sample menu items (English)
INSERT INTO menu_items (name, description, price, category, language) VALUES
('Caesar Salad', 'Fresh romaine lettuce with Caesar dressing', 8.50, 'appetizers', 'en'),
('Grilled Chicken', 'Tender grilled chicken breast with vegetables', 15.00, 'mains', 'en'),
('Chocolate Cake', 'Rich chocolate cake with vanilla ice cream', 6.50, 'desserts', 'en'),
('Fresh Orange Juice', 'Freshly squeezed orange juice', 4.00, 'drinks', 'en');

-- Insert sample menu items (French)
INSERT INTO menu_items (name, description, price, category, language) VALUES
('Salade César', 'Laitue romaine fraîche avec vinaigrette César', 8.50, 'appetizers', 'fr'),
('Poulet Grillé', 'Poitrine de poulet grillée tendre avec légumes', 15.00, 'mains', 'fr'),
('Gâteau au Chocolat', 'Gâteau au chocolat riche avec glace à la vanille', 6.50, 'desserts', 'fr'),
('Jus d''Orange Frais', 'Jus d''orange fraîchement pressé', 4.00, 'drinks', 'fr');

-- Insert sample menu items (Arabic)
INSERT INTO menu_items (name, description, price, category, language) VALUES
('سلطة سيزر', 'خس روماني طازج مع صلصة سيزر', 8.50, 'appetizers', 'ar'),
('دجاج مشوي', 'صدر دجاج مشوي طري مع خضروات', 15.00, 'mains', 'ar'),
('كعكة الشوكولاتة', 'كعكة شوكولاتة غنية مع آيس كريم الفانيليا', 6.50, 'desserts', 'ar'),
('عصير برتقال طازج', 'عصير برتقال طازج', 4.00, 'drinks', 'ar');
```

### 4. Start the Server

```bash
python server.py 3000
```

Or use the default port (8000):

```bash
python server.py
```

### 5. Access the Application

- **Landing Page**: http://localhost:3000/
- **Customer Interface**: http://localhost:3000/customer.html?table=TABLE_ID&lang=en
- **Staff Dashboard**: http://localhost:3000/staff.html?lang=en
- **Admin Panel**: http://localhost:3000/admin.html?lang=en

## Project Structure

```
/
├── assets/
│   ├── css/
│   │   └── main.css              # Global styles
│   └── js/
│       ├── config.js             # Configuration loader
│       ├── supabase-client.js    # Supabase client
│       └── utils.js              # Utility functions
├── lang/
│   ├── en.json                   # English translations
│   ├── fr.json                   # French translations
│   └── ar.json                   # Arabic translations
├── .env                          # Environment variables
├── index.html                    # Landing page
├── customer.html                 # Customer ordering interface
├── staff.html                    # Staff dashboard
├── admin.html                    # Admin panel
├── server.py                     # Development server
└── README.md                     # This file
```

## URL Structure

### Customer URLs (Each table has its own URL per language)

- English: `/customer.html?table=TABLE_ID&lang=en`
- French: `/customer.html?table=TABLE_ID&lang=fr`
- Arabic: `/customer.html?table=TABLE_ID&lang=ar`

### Staff Dashboard URLs

- English: `/staff.html?lang=en`
- French: `/staff.html?lang=fr`
- Arabic: `/staff.html?lang=ar`

### Admin Panel URLs

- English: `/admin.html?lang=en`
- French: `/admin.html?lang=fr`
- Arabic: `/admin.html?lang=ar`

## Features by Interface

### Customer Interface (`customer.html`)
- Browse menu items by category
- Add items to cart
- Adjust quantities
- Place orders
- Multilingual menu display

### Staff Dashboard (`staff.html`)
- View all orders in real-time
- Filter by status (pending, preparing, ready, served)
- Update order status
- Auto-refresh with real-time updates

### Admin Panel (`admin.html`)
- Manage tables (add, delete, view QR codes)
- Manage menu items (add, edit, delete)
- View order history
- Multi-language data management

## Database Schema

### Tables
- `id`: UUID (Primary Key)
- `table_number`: Integer
- `language`: String (en, fr, ar)
- `created_at`: Timestamp

### Menu Items
- `id`: UUID (Primary Key)
- `name`: String
- `description`: Text
- `price`: Decimal
- `category`: String (appetizers, mains, desserts, drinks)
- `language`: String (en, fr, ar)
- `available`: Boolean
- `created_at`: Timestamp

### Orders
- `id`: UUID (Primary Key)
- `table_id`: UUID (Foreign Key → tables)
- `items`: JSONB (array of order items)
- `total`: Decimal
- `status`: String (pending, preparing, ready, served, cancelled)
- `created_at`: Timestamp
- `updated_at`: Timestamp

## Security Notes

⚠️ **Important**: The current RLS policies allow public access for development. For production:

1. Implement proper authentication
2. Restrict policies based on user roles
3. Use environment-specific API keys
4. Enable HTTPS
5. Add rate limiting

## Customization

### Adding New Languages

1. Create a new JSON file in `/lang/` (e.g., `es.json`)
2. Add the language option to all HTML files
3. Update the `getBrowserLanguage()` function in `utils.js`

### Changing Currency

Update the `formatCurrency()` function in `/assets/js/utils.js`:

```javascript
export function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
}
```

### Styling

All styles are in `/assets/css/main.css`. Modify CSS variables in `:root` for quick theme changes.

## New Features Documentation

### Employee Management & Analytics
For detailed documentation on the new employee management and analytics features:

- 📖 **[Full Documentation](EMPLOYEE_ANALYTICS_FEATURES.md)** - Complete feature guide
- 🚀 **[Quick Setup Guide](SETUP_NEW_FEATURES.md)** - 5-minute setup
- 📊 **[Features Summary](FEATURES_SUMMARY.md)** - Visual overview

**Quick Access:**
- Employee Management: `http://localhost:8000/admin.html` → Employees tab
- Analytics Dashboard: `http://localhost:8000/admin.html` → Analytics tab
- AI Assistant: `http://localhost:8000/admin.html` → AI Assistant tab

### AI Assistant
Ask natural language questions about your restaurant:

- 🤖 **[AI Assistant Guide](AI_ASSISTANT_GUIDE.md)** - Complete usage guide

**Example Questions:**
- "How much revenue did I make in April?"
- "Who is the most active employee?"
- "What were my total orders last month?"
- "Show me employee work hours this week"

## Troubleshooting

### "Failed to load configuration"
- Ensure `.env` file exists and contains valid Supabase credentials
- Check that the server is serving the `.env` file correctly

### "Database connection failed"
- Verify Supabase URL and anon key are correct
- Check Supabase project is active
- Ensure RLS policies are set up correctly

### Orders not updating in real-time
- Check browser console for WebSocket errors
- Verify Supabase real-time is enabled for the `orders` table

### Analytics not showing data
- Run `setup_employee_shifts.sql` migration
- Ensure you have orders in the selected date range
- Check that triggers are enabled in Supabase
- Ensure network allows WebSocket connections

## License

MIT License - Feel free to use this project for your restaurant!
