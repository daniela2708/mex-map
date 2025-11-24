# Deployment Guide

## Deploy to Vercel (Recommended)

### Option 1: Vercel Dashboard (Easiest)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite configuration
   - Click "Deploy"

3. **Done!**
   - Your site will be live at `https://your-project.vercel.app`
   - Automatic deployments on every git push

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

## Deploy to Netlify

1. **Push to GitHub** (same as above)

2. **Import to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select your repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Click "Deploy site"

## Deploy to GitHub Pages

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json**
   ```json
   {
     "homepage": "https://YOUR_USERNAME.github.io/YOUR_REPO",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Update vite.config.ts**
   ```typescript
   export default defineConfig({
     base: '/YOUR_REPO/',
     plugins: [react()],
   })
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

## Environment Variables

This project doesn't require any environment variables. All data is embedded in the application.

If you need to add environment variables in the future:

1. Create `.env.local` file
2. Add variables with `VITE_` prefix:
   ```
   VITE_API_KEY=your_key_here
   ```
3. Access in code:
   ```typescript
   const apiKey = import.meta.env.VITE_API_KEY;
   ```

## Build Optimization

The production build is already optimized with:
- ✅ Code splitting
- ✅ Minification
- ✅ Tree shaking
- ✅ Asset optimization

## Custom Domain

### On Vercel:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### On Netlify:
1. Go to Domain Settings
2. Add custom domain
3. Follow DNS configuration steps

## Troubleshooting

### Build fails
- Make sure Node.js version is 18.x or higher
- Clear `node_modules` and reinstall: `rm -rf node_modules package-lock.json && npm install`

### Map not showing
- Check browser console for errors
- Ensure internet connection (map data is fetched from Highcharts CDN)

### Deployment issues
- Verify build works locally: `npm run build && npm run preview`
- Check Vercel/Netlify build logs for specific errors
