import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './StateRankingsChart.css';

interface StateRankingsChartProps {
  rankingOptions: Highcharts.Options;
  stateFlags: Record<string, string>;
}

export const StateRankingsChart: React.FC<StateRankingsChartProps> = ({ rankingOptions, stateFlags }) => {
  const modifiedOptions: Highcharts.Options = useMemo(() => {
    return {
      ...rankingOptions,
      tooltip: {
        useHTML: true,
        borderRadius: 8,
        backgroundColor: '#ffffff',
        borderColor: '#e5e5e5',
        shadow: { color: 'rgba(0, 0, 0, 0.15)', offsetX: 0, offsetY: 4, width: 12 },
        padding: 0,
        outside: true,
        formatter: function (this: Highcharts.Point) {
          const stateData = (this.options as Highcharts.PointOptionsObject & { data?: any }).data;

          if (!stateData) {
            return '';
          }

          const pepsiPercentage = stateData.pepsi;
          const colaPercentage = stateData.cocaCola;
          const othersPercentage = stateData.others;
          const pepsiVol = stateData.pepsiVolume;
          const colaVol = stateData.colaVolume;
          const othersVol = stateData.othersVolume;
          const totalVol = pepsiVol + colaVol + othersVol;

          const max = Math.max(pepsiPercentage, colaPercentage, othersPercentage);
          let dominant = 'Pepsi';
          let dominantColor = '#1c52a2';

          if (colaPercentage === max) {
            dominant = 'Coca-Cola';
            dominantColor = '#f40000';
          } else if (othersPercentage === max) {
            dominant = 'Others';
            dominantColor = '#b0b0b0';
          }

          const flagUrl = stateFlags[stateData.name] || '';

          return `
            <div style="padding: 16px; min-width: 220px; font-family: 'Inter', sans-serif; background: #ffffff; border: 1px solid #e5e5e5; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
              <div style="font-size: 13px; font-weight: 600; color: #1a1a1a; margin-bottom: 8px; display: flex; align-items: center; gap: 10px;">
                ${flagUrl ? `<img src="${flagUrl}" alt="${stateData.name} coat of arms" style="width: 36px; height: auto; border: 1px solid #e5e5e5; border-radius: 3px; flex-shrink: 0;" onerror="this.style.display='none';" />` : ''}
                <span>${stateData.name}</span>
              </div>

              <div style="text-align: left; font-size: 11px; color: #666; font-weight: 500; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #e5e5e5;">
                <strong style="color: ${dominantColor}; font-weight: 600;">${dominant}</strong> leads
              </div>

              <div style="margin: 10px 0;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="width: 6px; height: 6px; background: #1c52a2; border-radius: 50%; display: inline-block;"></span>
                    <span style="color: #666; font-weight: 500; font-size: 11px;">Pepsi</span>
                  </div>
                  <div style="text-align: right;">
                    <div style="font-weight: 600; font-size: 15px; color: #1a1a1a; line-height: 1;">${pepsiPercentage}%</div>
                    <div style="font-size: 9px; color: #999; font-weight: 400; margin-top: 2px;">${pepsiVol}M units</div>
                  </div>
                </div>
                <div style="width: 100%; height: 4px; background: #f0f0f0; border-radius: 2px; overflow: hidden;">
                  <div style="width: ${pepsiPercentage}%; height: 100%; background: #1c52a2; border-radius: 2px;"></div>
                </div>
              </div>

              <div style="margin: 10px 0;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="width: 6px; height: 6px; background: #f40000; border-radius: 50%; display: inline-block;"></span>
                    <span style="color: #666; font-weight: 500; font-size: 11px;">Coca-Cola</span>
                  </div>
                  <div style="text-align: right;">
                    <div style="font-weight: 600; font-size: 15px; color: #1a1a1a; line-height: 1;">${colaPercentage}%</div>
                    <div style="font-size: 9px; color: #999; font-weight: 400; margin-top: 2px;">${colaVol}M units</div>
                  </div>
                </div>
                <div style="width: 100%; height: 4px; background: #f0f0f0; border-radius: 2px; overflow: hidden;">
                  <div style="width: ${colaPercentage}%; height: 100%; background: #f40000; border-radius: 2px;"></div>
                </div>
              </div>

              <div style="margin: 10px 0;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="width: 6px; height: 6px; background: #b0b0b0; border-radius: 50%; display: inline-block;"></span>
                    <span style="color: #666; font-weight: 500; font-size: 11px;">Others</span>
                  </div>
                  <div style="text-align: right;">
                    <div style="font-weight: 600; font-size: 15px; color: #1a1a1a; line-height: 1;">${othersPercentage}%</div>
                    <div style="font-size: 9px; color: #999; font-weight: 400; margin-top: 2px;">${othersVol}M units</div>
                  </div>
                </div>
                <div style="width: 100%; height: 4px; background: #f0f0f0; border-radius: 2px; overflow: hidden;">
                  <div style="width: ${othersPercentage}%; height: 100%; background: #b0b0b0; border-radius: 2px;"></div>
                </div>
              </div>

              <div style="margin-top: 12px; padding-top: 10px; border-top: 1px solid #f0f0f0;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 9px; color: #999; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Total Volume</span>
                  <span style="font-size: 10px; color: #666; font-weight: 500;">${totalVol.toFixed(1)}M units</span>
                </div>
              </div>
            </div>
          `;
        }
      }
    };
  }, [rankingOptions, stateFlags]);

  return (
    <div className="ranking-container">
      <div className="ranking-title-bar">
        <h3 className="ranking-title">State Rankings by Total Market Volume</h3>
      </div>

      <div className="ranking-chart-wrapper">
        <div className="ranking-chart-inner">
          <HighchartsReact
            highcharts={Highcharts}
            options={modifiedOptions}
          />
        </div>
      </div>
    </div>
  );
};
