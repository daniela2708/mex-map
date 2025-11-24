# Quick Start Guide

## Project Structure ✅

Your project is now properly organized:

```
beverage-market-analysis/
├── src/
│   ├── components/        # React components
│   │   ├── Header.tsx
│   │   ├── MapSection.tsx
│   │   └── Insights.tsx
│   ├── data/             # Market data
│   │   └── mexicoMarketData.ts
│   ├── types/            # TypeScript types
│   │   └── marketData.ts
│   ├── App.tsx           # Main app
│   └── index.css         # Global styles
├── public/               # Static assets
├── dist/                 # Build output
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Commands

### Development
```bash
npm run dev
```
Open http://localhost:5173 in your browser

### Production Build
```bash
npm run build
```
Outputs to `dist/` folder

### Preview Production Build
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

## Next Steps

### 1. Test Locally
```bash
cd /mnt/c/Users/SARA/Mapa_Mex/beverage-market-analysis
npm run dev
```

### 2. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: Beverage Market Analysis"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 3. Deploy to Vercel
- Go to https://vercel.com
- Click "Import Project"
- Select your GitHub repository
- Vercel auto-detects Vite settings
- Click "Deploy"
- Done! 🎉

## Features

✅ React 18 + TypeScript
✅ Vite build tool
✅ Highcharts interactive map
✅ Responsive design
✅ Professional UI
✅ Ready for production

## Customization

### Update Market Data
Edit `src/data/mexicoMarketData.ts`

### Modify Colors
Edit brand colors in CSS files:
- Pepsi: `#1C52A2`
- Coca-Cola: `#F40000`

### Change Layout
Components are in `src/components/`

## Troubleshooting

### Port already in use
```bash
npm run dev -- --port 3000
```

### Clear cache and reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build errors
```bash
npm run build --verbose
```

## Performance

Current build size: ~527KB (gzipped: ~186KB)

To improve:
- Use dynamic imports for Highcharts
- Enable code splitting
- Optimize images

## Support

- 📖 README.md - Full documentation
- 🚀 DEPLOYMENT.md - Deployment guide
- 💬 Issues - Report bugs on GitHub

---

**Ready to launch!** 🚀
