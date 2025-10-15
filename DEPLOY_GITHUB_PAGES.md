# Deploy to GitHub Pages

## ✅ Your Project is Ready for GitHub Pages!

Since you've hardcoded the Supabase credentials in `supabase-client.js`, the project will work on GitHub Pages.

## Deployment Steps

### 1. Create GitHub Repository

```bash
cd "/home/ashraf/Desktop/New Folder 2"
git init
git add .
git commit -m "Initial commit: Restaurant QR Ordering System"
```

### 2. Push to GitHub

```bash
# Create a new repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **main** branch
4. Click **Save**
5. Your site will be live at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

## Important Notes

### ⚠️ Security Warning

Your Supabase credentials are now **publicly visible** in the JavaScript file. This is acceptable for the **anon key** (it's designed to be public), but you should:

1. **Enable Row Level Security (RLS)** in Supabase (already done in setup.sql)
2. **Never commit** service role keys or private keys
3. **Set up proper RLS policies** for production

### 📱 URLs on GitHub Pages

Your URLs will be:
- **Landing**: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`
- **Customer**: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/customer.html?table=ID&lang=en`
- **Staff**: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/staff.html?lang=en`
- **Admin**: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/admin.html?lang=en`

### 🔧 Update QR Codes

After deployment, regenerate QR codes in the admin panel with your GitHub Pages URL instead of localhost.

## Alternative: Deploy to Netlify/Vercel (Recommended)

For better performance and features:

### Netlify (Easier)
1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import from Git"
4. Select your repository
5. Click "Deploy"

### Vercel
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your repository
5. Click "Deploy"

Both services:
- ✅ Serve static files correctly
- ✅ Provide HTTPS automatically
- ✅ Give you a custom domain
- ✅ Have better performance than GitHub Pages

## Testing Before Deploy

Test locally first:
```bash
python server.py 3000
```

Then visit http://localhost:3000 to ensure everything works.

## Troubleshooting

### JavaScript not loading on GitHub Pages

If you see errors, check:

1. **CORS issues**: Supabase should allow requests from your GitHub Pages domain
2. **HTTPS**: GitHub Pages uses HTTPS, ensure Supabase URL is also HTTPS (it is)
3. **Module paths**: All imports use relative paths starting with `/` or `./`

### Real-time not working

Real-time subscriptions require WebSocket support. GitHub Pages supports this, but ensure:
- Supabase real-time is enabled for the `orders` table
- Your browser allows WebSocket connections

## Post-Deployment Checklist

- [ ] Test all pages (index, customer, staff, admin)
- [ ] Test in different browsers
- [ ] Test on mobile devices
- [ ] Verify Supabase connection works
- [ ] Test order creation and updates
- [ ] Generate new QR codes with production URL
- [ ] Enable RLS policies in Supabase
- [ ] Test real-time updates

---

**Your restaurant ordering system is ready for the world! 🚀**
