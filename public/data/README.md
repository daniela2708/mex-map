# Map Data

This folder contains all the data files for the map visualizations.

## Current Files

- `market-data.json` - **Market share data** for Pepsi vs Coca-Cola by Mexican state (REPLACE THIS WITH REAL DATA)
- `mx-all.topo.json` - TopoJSON file containing the geographic topology data for all Mexican states

## How to Update Market Data

**IMPORTANT: The current market data is dummy/sample data for demonstration purposes only.**

To replace with real market data:

1. Edit `market-data.json`
2. Keep the same structure for each state:
   ```json
   {
     "mx-ag": {
       "pepsi": 38,           // Pepsi market share percentage (0-100)
       "cocaCola": 62,         // Coca-Cola market share percentage (0-100)
       "pepsiVolume": 4.2,     // Pepsi volume in millions of units
       "colaVolume": 6.8,      // Coca-Cola volume in millions of units
       "name": "Aguascalientes" // State name
     }
   }
   ```
3. Save the file
4. Refresh the application to see the new data

## How to Update Geographic Map Data

If you need to update the map topology:

1. Download the new TopoJSON file from [Highcharts Map Collection](https://code.highcharts.com/mapdata/)
2. For Mexico: https://code.highcharts.com/mapdata/countries/mx/mx-all.topo.json
3. Replace `mx-all.topo.json` in this folder
4. The application will automatically use the new data on the next reload

## Data Format

- `market-data.json` - Standard JSON format
- `mx-all.topo.json` - TopoJSON format (more compact than GeoJSON)
