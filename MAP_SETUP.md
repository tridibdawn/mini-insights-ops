# Map Setup Guide

## Quick Fix: Map Not Loading

### Problem: You have a Secret Token (sk.)

If your `.env` file has a token starting with `sk.`, that's a **secret token** which cannot be used in the browser for security reasons.

### Solution: Get a Public Token (pk.)

1. **Go to Mapbox Dashboard:**
   - Visit: https://account.mapbox.com/access-tokens/

2. **Create or Copy a Public Token:**
   - Click "Create a token" or copy an existing public token
   - Make sure it starts with `pk.` (not `sk.`)
   - For scopes, you need at least:
     - ✅ `styles:read`
     - ✅ `fonts:read`
     - ✅ `tiles:read`

3. **Update Your .env File:**
   ```bash
   NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_actual_public_token_here
   ```

4. **Restart the Dev Server:**
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

5. **Refresh the Browser:**
   - Go to http://localhost:3000/map
   - The map should now load with Mapbox styles

## Alternative: Use OpenStreetMap (No Token Required)

If you don't want to use Mapbox, you can use OpenStreetMap instead:

1. **Remove or comment out the token in .env:**
   ```bash
   # NEXT_PUBLIC_MAPBOX_TOKEN=
   ```

2. **Restart the server:**
   ```bash
   npm run dev
   ```

The map will automatically fall back to OpenStreetMap tiles (free, no API key needed).

## Token Types Explained

### Secret Token (sk.)
- ❌ **Cannot** be used in the browser
- ❌ **Cannot** be in client-side code
- ✅ **Can** be used in server-side API calls
- 🔒 Should never be committed to Git

### Public Token (pk.)
- ✅ **Can** be used in the browser
- ✅ **Can** be in client-side code
- ✅ Safe to include in frontend applications
- 🌐 Restricted by URL domains you specify

## Troubleshooting

### Map Shows Error Message
1. Check browser console (F12) for error details
2. Verify your token starts with `pk.` not `sk.`
3. Ensure you restarted the dev server after changing .env
4. Try removing the token to use OpenStreetMap fallback

### Map Container is Blank
1. Check if events are loading (open browser console)
2. Make sure you're logged in
3. Verify the map container has height (should be full viewport)
4. Check for JavaScript errors in console

### "Unauthorized" Error
- Your token might be invalid or expired
- Create a new public token in Mapbox dashboard
- Update .env and restart server

### Map Loads but No Style
- Token might not have correct scopes
- Go to Mapbox dashboard → Edit token → Enable:
  - Styles: Read
  - Fonts: Read  
  - Tiles: Read

## Current Setup

The application is configured to:

1. **Check for a valid Mapbox token** (`pk.` prefix)
2. **Use Mapbox styles** if token is valid
3. **Fall back to OpenStreetMap** if no token or invalid token
4. **Show error message** if there's a configuration issue

## Getting Help

If the map still doesn't load after following these steps:

1. Check the browser console (F12) for errors
2. Verify `.env` file is in the project root
3. Ensure the server was restarted after changes
4. Try clearing browser cache and hard refresh (Ctrl+Shift+R)

## Example Working Configuration

**With Mapbox:**
```bash
# .env
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example
```

**With OpenStreetMap (No Token):**
```bash
# .env
# NEXT_PUBLIC_MAPBOX_TOKEN=
```

Both configurations will work! Choose whichever you prefer.
