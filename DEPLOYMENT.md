# Deployment Guide

## Deploying to Vercel (Recommended)

Vercel is the easiest way to deploy this Next.js application.

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Visit [vercel.com](https://vercel.com) and sign in

3. Click "Add New Project"

4. Import your Git repository

5. Configure the project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: .next
   
6. Add Environment Variables (optional):
   ```
   JWT_SECRET=your-production-secret-key-here
   NODE_ENV=production
   ```

7. Click "Deploy"

Your app will be live at `https://your-app-name.vercel.app`

### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Follow the prompts. Your app will be deployed!

## Deploying to Netlify

1. Push your code to a Git repository

2. Visit [netlify.com](https://netlify.com) and sign in

3. Click "Add new site" → "Import an existing project"

4. Connect your Git repository

5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Functions directory**: Leave empty

6. Add Environment Variables:
   ```
   JWT_SECRET=your-production-secret-key-here
   NODE_ENV=production
   ```

7. Click "Deploy site"

## Deploying to Other Platforms

### Requirements
- Node.js 18+ runtime
- Support for Next.js 16
- Environment variable support

### Build Commands
```bash
npm install
npm run build
npm start
```

### Environment Variables
Set these in your hosting platform:
- `JWT_SECRET`: Your secret key for JWT tokens
- `NODE_ENV`: Set to `production`

## Post-Deployment Checklist

- [ ] Test all three user roles (admin, analyst, viewer)
- [ ] Verify login/logout works correctly
- [ ] Test CRUD operations on events
- [ ] Check dashboard charts render properly
- [ ] Verify map displays correctly
- [ ] Test user role management (admin only)
- [ ] Ensure mobile responsiveness
- [ ] Check browser console for errors

## Custom Domain (Optional)

### Vercel
1. Go to your project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### Netlify
1. Go to Site settings → Domain management
2. Add custom domain
3. Configure DNS records

## Monitoring & Logs

### Vercel
- View logs in the Vercel dashboard under "Deployments" → Select deployment → "Logs"
- Real-time logs available via CLI: `vercel logs`

### Netlify
- View logs in the Netlify dashboard under "Site overview" → "Functions"

## Troubleshooting

### Build Fails
- Check Node.js version (should be 18+)
- Verify all dependencies are in package.json
- Review build logs for specific errors

### Runtime Errors
- Check environment variables are set correctly
- Ensure JWT_SECRET is configured
- Review server logs for errors

### Map Not Loading
- This is expected with free OpenStreetMap tiles (no API key required)
- For production, consider upgrading to Mapbox or Google Maps with proper API keys

## Performance Optimization

For production deployments, consider:

1. **Enable caching** for static assets
2. **Add CDN** for global distribution
3. **Implement rate limiting** on API routes
4. **Use a real database** (PostgreSQL) instead of in-memory storage
5. **Add monitoring** (Sentry, LogRocket, etc.)
6. **Enable HTTPS** (automatic on Vercel/Netlify)
7. **Implement CI/CD** for automated testing and deployment

## Support

If you encounter issues during deployment:
1. Check the platform's status page
2. Review deployment logs
3. Verify environment variables
4. Test locally with `npm run build && npm start`
