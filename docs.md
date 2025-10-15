# Restaurant QR Ordering System - Documentation

## Project Structure

```
/
├── assets/
│   ├── css/
│   │   └── main.css          # Global styles and responsive design
│   └── js/
│       ├── config.js         # Environment configuration loader
│       ├── supabase-client.js # Database connection handler
│       └── utils.js          # Utility functions
├── lang/
│   ├── en.json              # English translations
│   ├── fr.json              # French translations
│   └── ar.json              # Arabic translations
├── .env                     # Environment variables (development)
├── index.html               # Main landing page
├── customer.html            # Customer ordering interface
├── staff.html               # Staff dashboard
├── admin.html               # Admin panel
└── server.py                # Development server
```

## Getting Started

### Development Setup

1. **Configure Supabase credentials** in `.env` file:
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   ```

2. **Start the development server**:
   ```bash
   python3 server.py
   ```
   
   The server will run on `http://localhost:8000` by default.

3. **Access the interfaces**:
   - Main page: `http://localhost:8000`
   - Customer ordering: `http://localhost:8000/customer.html`
   - Staff dashboard: `http://localhost:8000/staff.html`
   - Admin panel: `http://localhost:8000/admin.html`

### Configuration

The system uses a modular configuration approach:

- **Environment variables** are loaded via `config.js`
- **Language files** support internationalization (i18n)
- **Database connection** is managed through `supabase-client.js`

### Core Components

1. **Config Module** (`assets/js/config.js`)
   - Loads Supabase credentials from environment
   - Handles development vs production configuration
   - Validates configuration completeness

2. **Supabase Client** (`assets/js/supabase-client.js`)
   - Manages database connections
   - Provides CRUD operations interface
   - Handles connection state

3. **Utilities** (`assets/js/utils.js`)
   - Common helper functions
   - URL parameter handling
   - Currency formatting
   - Loading state management

4. **Internationalization**
   - JSON-based language files
   - Support for English, French, and Arabic
   - Structured translation keys

### Development Server

The Python development server (`server.py`) provides:
- Static file serving with proper MIME types
- CORS headers for development
- SPA-like routing
- Custom port configuration

### Next Steps

After completing the project structure setup, the next tasks will involve:
1. Implementing core data models
2. Setting up database schema
3. Building the customer ordering interface
4. Creating the staff dashboard
5. Developing the admin panel

## Architecture Notes

- **Frontend-only approach**: No backend API, direct Supabase integration
- **Mobile-first design**: Responsive CSS with mobile optimization
- **Modular JavaScript**: ES6 modules for clean code organization
- **Multi-language support**: Built-in internationalization
- **Real-time updates**: Supabase real-time subscriptions for live updates