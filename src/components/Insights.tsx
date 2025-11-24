import React from 'react';
import './Insights.css';

export const Insights: React.FC = () => {
  return (
    <section className="insights">
      <div className="insight">
        <h3 className="insight-title">Market Segmentation</h3>
        <p className="insight-text">
          States are color-coded based on market share dominance, with intensity representing the strength of brand preference in each region.
        </p>
      </div>

      <div className="insight">
        <h3 className="insight-title">Interactive Analytics</h3>
        <p className="insight-text">
          Hover over any state to access detailed market metrics including precise percentage breakdowns and regional competitive dynamics.
        </p>
      </div>

      <div className="insight">
        <h3 className="insight-title">Regional Patterns</h3>
        <p className="insight-text">
          Analysis reveals distinct geographic preferences, with northern states showing stronger Pepsi presence and southern regions favoring Coca-Cola.
        </p>
      </div>
    </section>
  );
};
