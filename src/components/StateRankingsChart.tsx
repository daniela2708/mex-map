import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './StateRankingsChart.css';

interface StateRankingsChartProps {
  rankingOptions: Highcharts.Options;
}

export const StateRankingsChart: React.FC<StateRankingsChartProps> = ({ rankingOptions }) => {
  return (
    <div className="ranking-container">
      <div className="ranking-title-bar">
        <h3 className="ranking-title">State Rankings by Total Market Volume</h3>
      </div>

      <div className="ranking-chart-wrapper">
        <div className="ranking-chart-inner">
          <HighchartsReact
            highcharts={Highcharts}
            options={rankingOptions}
          />
        </div>
      </div>
    </div>
  );
};
