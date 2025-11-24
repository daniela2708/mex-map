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
    const totalStates =
      rankingOptions?.series && rankingOptions.series[0] &&
      Array.isArray((rankingOptions.series[0] as Highcharts.SeriesOptionsType & { data?: Highcharts.PointOptionsObject[] }).data)
        ? ((rankingOptions.series[0] as Highcharts.SeriesOptionsType & { data?: Highcharts.PointOptionsObject[] }).data as Highcharts.PointOptionsObject[]).length
        : 0;

    return {
      ...rankingOptions,
      tooltip: {
        useHTML: true,
        borderRadius: 8,
        backgroundColor: '#ffffff',
        borderColor: '#e5e5e5',
        shadow: { color: 'rgba(0, 0, 0, 0.15)', offsetX: 0, offsetY: 4, width: 12 },
        padding: 0,
        style: {
          zIndex: 10000
        },
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

          const rank = typeof this.index === 'number' ? this.index + 1 : null;

          const formatBrandRow = (
            label: string,
            percentage: number,
            volume: number,
            color: string
          ) => `
            <div class="ranking-tooltip-metric">
              <div class="ranking-tooltip-metric-header">
                <div class="ranking-tooltip-brand">
                  <span class="ranking-tooltip-dot" style="background: ${color};"></span>
                  <span>${label}</span>
                </div>
                <div class="ranking-tooltip-values">
                  <span class="ranking-tooltip-percentage">${percentage}%</span>
                  <span class="ranking-tooltip-volume">${volume.toFixed(1)}M units</span>
                </div>
              </div>
              <div class="ranking-tooltip-bar-bg">
                <div class="ranking-tooltip-bar" style="width: ${percentage}%; background: ${color};"></div>
              </div>
            </div>
          `;

          return `
            <div class="ranking-tooltip-card">
              <div class="ranking-tooltip-header">
                <div class="ranking-tooltip-header-content">
                  ${flagUrl ? `<img src="${flagUrl}" alt="${stateData.name} coat of arms" class="ranking-tooltip-flag" onerror="this.style.display='none';" />` : ''}
                  <div class="ranking-tooltip-title-wrap">
                    <p class="ranking-tooltip-title">${stateData.name}</p>
                    ${rank ? `<p class="ranking-tooltip-subtitle">Rank #${rank}${totalStates ? ` of ${totalStates}` : ''}</p>` : ''}
                  </div>
                  <span class="ranking-tooltip-chip" style="color: ${dominantColor}; background: ${dominantColor}15;">Top ${dominant}</span>
                </div>
              </div>

              <div class="ranking-tooltip-content">
                <div class="ranking-tooltip-dominant">
                  <strong style="color: ${dominantColor};">${dominant}</strong> leads with ${max}% share
                </div>

                ${formatBrandRow('Pepsi', pepsiPercentage, pepsiVol, '#1c52a2')}
                ${formatBrandRow('Coca-Cola', colaPercentage, colaVol, '#f40000')}
                ${formatBrandRow('Others', othersPercentage, othersVol, '#b0b0b0')}

                <div class="ranking-tooltip-total">
                  <span class="ranking-tooltip-total-label">Total Volume</span>
                  <span class="ranking-tooltip-total-value">${totalVol.toFixed(1)}M units</span>
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
