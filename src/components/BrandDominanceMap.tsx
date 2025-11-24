import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './BrandDominanceMap.css';

interface BrandDominanceMapProps {
  mapOptions: Highcharts.Options;
}

export const BrandDominanceMap: React.FC<BrandDominanceMapProps> = ({ mapOptions }) => {
  return (
    <div className="map-container">
      <div className="map-title-bar">
        <h3 className="map-title">Brand Dominance Across Mexican States</h3>
      </div>

      <div className="map-chart-wrapper">
        <div className="map-chart-inner">
          <HighchartsReact
            highcharts={Highcharts}
            constructorType={'mapChart'}
            options={mapOptions}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="legend">
        <div className="legend-title">Dominant Brand</div>
        <div className="brand-label pepsi-label">
          <span className="brand-dot pepsi"></span>
          <span>Pepsi</span>
        </div>

        <div className="brand-label coke-label">
          <span className="brand-dot coke"></span>
          <span>Coca-Cola</span>
        </div>

        <div className="brand-label others-label">
          <span className="brand-dot others"></span>
          <span>Others</span>
        </div>
      </div>
    </div>
  );
};
