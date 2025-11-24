# Beverage Market Analysis - Mexico

An interactive data visualization showing the market share distribution of Pepsi vs Coca-Cola across Mexican states.

## Features

- **Interactive Heat Map**: Visualize brand dominance across all 33 Mexican states
- **Detailed Tooltips**: Hover over states to view market share percentages and volume data
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Data**: Market share percentages and volume metrics (millions of units)
- **Professional UI**: Clean, minimalist design with brand colors

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Highcharts** - Interactive map visualization
- **CSS3** - Styling and responsive design

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx       # Page header with metadata
│   ├── MapSection.tsx   # Interactive map component
│   └── Insights.tsx     # Market insights section
├── data/               # Data files
│   └── mexicoMarketData.ts  # Market share data
├── types/              # TypeScript type definitions
│   └── marketData.ts   # Data interfaces
├── App.tsx             # Main application component
├── index.css           # Global styles
└── main.tsx            # Application entry point
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project on [Vercel](https://vercel.com)
3. Vercel will automatically detect Vite and configure build settings
4. Click "Deploy"

Or use the Vercel CLI:

```bash
npm i -g vercel
vercel
```

## Data Structure

Market data includes:
- **pepsi**: Pepsi market share percentage (0-100)
- **cocaCola**: Coca-Cola market share percentage (0-100)
- **pepsiVolume**: Volume in millions of units
- **colaVolume**: Volume in millions of units
- **name**: State name in English

## Color Scale

The heat map uses a gradient from Pepsi blue (#1C52A2) to Coca-Cola red (#F40000), with neutral purple tones in balanced markets (50/50).

## License

MIT License - feel free to use this project for your own market research visualizations.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
