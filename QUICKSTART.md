# Quick Start Guide - Mini InsightOps

## 🚀 Get Running in 3 Minutes

### 1. Install Dependencies (1 minute)
```bash
cd mini-insights-ops
npm install
```

### 2. Start the Server (30 seconds)
```bash
npm run dev
```

### 3. Open Browser (30 seconds)
Navigate to: **http://localhost:3000**

You'll be automatically redirected to the login page.

## 🔑 Test Accounts

Click any account button on the login page, or enter manually:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@test.com | password |
| **Analyst** | analyst@test.com | password |
| **Viewer** | viewer@test.com | password |

## 📋 Demo Checklist

### As Admin (Full Access)
- [x] Login and view Dashboard
- [x] Navigate to Map, apply filters
- [x] Go to Events, sort and search
- [x] Create a new event
- [x] View event details, delete an event
- [x] Go to Users page, change a user's role
- [x] Logout

### As Analyst (Create/Edit)
- [x] Login and view Dashboard
- [x] Navigate to Events
- [x] Create a new event
- [x] Try to access Users page (should redirect)
- [x] Logout

### As Viewer (Read-Only)
- [x] Login and view Dashboard
- [x] Navigate to Map and Events
- [x] Notice no "Create" buttons
- [x] Try to access Users page (should redirect)
- [x] Logout

## 🎯 Key Features to Show

1. **Dashboard** - Charts update in real-time with data
2. **Map** - Interactive markers, click to see details, use filters
3. **Events Table** - Sort by any column, paginate, search
4. **Create Event** - Form with validation (Admin/Analyst only)
5. **User Management** - Change roles (Admin only)

## 📦 What's Included

- ✅ 32 seeded events across 6 categories
- ✅ 3 test users (1 per role)
- ✅ Full RBAC implementation
- ✅ Interactive map with OpenStreetMap
- ✅ Dashboard with charts and insights
- ✅ Comprehensive documentation

## 🔧 Troubleshooting

**Port 3000 already in use?**
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9
# Or use a different port
PORT=3001 npm run dev
```

**Module not found errors?**
```bash
# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Build errors?**
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

## 📚 More Information

- **README.md** - Complete setup and usage guide
- **AI_NOTES.md** - Development process and AI usage
- **DEPLOYMENT.md** - How to deploy to Vercel/Netlify
- **PROJECT_SUMMARY.md** - Feature checklist and assessment

## ✨ Production Build

To test the production build locally:

```bash
npm run build
npm start
```

## 🌐 Deploy to Vercel (Optional)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Follow the prompts, and you'll get a live URL in seconds!

## 🐛 Known Limitations

- **In-Memory Storage**: Data resets on server restart
- **OpenStreetMap**: Uses free tiles (for production, consider Mapbox)
- **No Persistence**: Events/users reset to defaults on restart

These are intentional for the prototype. See AI_NOTES.md for production improvements.

## 💬 Need Help?

All functionality should work out of the box. If you encounter issues:
1. Check that Node.js 18+ is installed (`node --version`)
2. Ensure dependencies installed successfully
3. Review console for error messages
4. Check README.md for detailed troubleshooting

---

**Ready to explore!** Start with the admin account to see all features. 🎉
