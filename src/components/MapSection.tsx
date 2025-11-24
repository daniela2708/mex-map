import React, { useEffect, useState, useRef } from 'react';
import Highcharts from 'highcharts';
import { BrandDominanceMap } from './BrandDominanceMap';
import { StateRankingsChart } from './StateRankingsChart';
import './MapSection.css';

export const MapSection: React.FC = () => {
  const [mapOptions, setMapOptions] = useState<Highcharts.Options | null>(null);
  const [rankingOptions, setRankingOptions] = useState<Highcharts.Options | null>(null);
  const [stateFlags, setStateFlags] = useState<Record<string, string>>({});
  const mapInitialized = useRef(false);

  useEffect(() => {
    // Initialize Highcharts Map module only once
    if (!mapInitialized.current) {
      import('highcharts/modules/map').then((module: any) => {
        const initMap = module.default;
        if (typeof initMap === 'function') {
          initMap(Highcharts);
        }

        // Disable accessibility warning
        Highcharts.setOptions({
          accessibility: {
            enabled: false
          }
        });

        mapInitialized.current = true;
      });
    }
  }, []);

  useEffect(() => {
    // Fetch market data, topology, and state flags in parallel
    Promise.all([
      fetch('/data/market-data.json').then(res => {
        if (!res.ok) throw new Error(`Failed to fetch market data: ${res.status}`);
        return res.json();
      }),
      fetch('/data/mx-all.topo.json').then(res => {
        if (!res.ok) throw new Error(`Failed to fetch topology: ${res.status}`);
        return res.json();
      }),
      fetch('/mexico_state_flags/state_flags.json').then(res => {
        if (!res.ok) throw new Error(`Failed to fetch state flags: ${res.status}`);
        return res.json();
      })
    ])
      .then(([marketDataJson, topology, stateFlagsJson]) => {
        // Guardar las banderas en el estado
        setStateFlags(stateFlagsJson);

        // Transform data for Highcharts - assign color based on dominant brand
        const data = Object.keys(marketDataJson).map(key => {
          const stateData = marketDataJson[key];
          const max = Math.max(stateData.pepsi, stateData.cocaCola, stateData.others);

          let color;
          if (stateData.pepsi === max) {
            color = '#1C52A2'; // Pepsi blue
          } else if (stateData.cocaCola === max) {
            color = '#F40000'; // Coca-Cola red
          } else {
            color = '#B0B0B0'; // Others gray
          }

          return {
            'hc-key': key,
            value: max,
            color: color
          };
        });

        console.log('🔍 DEBUG: Transformed data:', data);

        // Prepare ranking data - calculate total volume for each state
        const rankingData = Object.keys(marketDataJson)
          .filter(key => !/^\d+$/.test(key.split('-')[1])) // Filter out numeric codes like mx-3622
          .map(key => {
            const stateData = marketDataJson[key];
            const abbr = key.split('-')[1];
            const totalVolume = stateData.pepsiVolume + stateData.colaVolume + stateData.othersVolume;

            return {
              name: `${stateData.name} (${abbr ? abbr.toUpperCase() : ''})`,
              stateName: stateData.name,
              y: totalVolume,
              data: stateData
            };
          })
          .sort((a, b) => b.y - a.y); // Sort by total volume descending

        const options: Highcharts.Options = {
          chart: {
            map: topology as any,
            backgroundColor: '#ffffff',
            height: 330,
            spacing: [10, 10, 10, 10]
          },
          credits: {
            enabled: false
          },
          title: {
            text: undefined
          },
          mapNavigation: {
            enabled: true,
            buttonOptions: {
              verticalAlign: 'bottom',
              theme: {
                fill: '#1a1a1a',
                'stroke-width': 0,
                r: 4,
                style: {
                  color: '#ffffff',
                  fontWeight: '500'
                },
                states: {
                  hover: {
                    fill: '#333333'
                  }
                }
              }
            }
          },
          legend: {
            enabled: false
          },
          tooltip: {
            backgroundColor: '#ffffff',
            borderWidth: 1,
            borderColor: '#e5e5e5',
            borderRadius: 6,
            shadow: {
              color: 'rgba(0,0,0,0.08)',
              offsetX: 0,
              offsetY: 2,
              width: 8
            },
            useHTML: true,
            style: {
              padding: '0'
            },
            formatter: function() {
              const stateCode = (this as any).point?.['hc-key'] as string;
              const stateData = marketDataJson[stateCode];

              if (!stateData) return '';

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

              const flagUrl = stateFlagsJson[stateData.name] || '';

              return `
                <div style="padding: 16px; min-width: 220px; font-family: 'Inter', sans-serif;">
                  <div style="font-size: 13px; font-weight: 600; color: #1a1a1a; margin-bottom: 8px; display: flex; align-items: center; gap: 10px;">
                    ${flagUrl ? `<img src="${flagUrl}" alt="${stateData.name} coat of arms" style="width: 36px; height: auto; border: 1px solid #e5e5e5; border-radius: 3px; flex-shrink: 0;" />` : ''}
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
          },
          series: [{
            type: 'map',
            data: data as any,
            name: 'Market Share',
            showInLegend: false,
            enableMouseTracking: true,
            states: {
              hover: {
                brightness: 0.05,
                borderColor: '#1a1a1a',
                borderWidth: 1.5
              }
            },
            dataLabels: {
              enabled: true,
              formatter: function() {
                // Extract state abbreviation from hc-key (e.g., 'mx-ag' -> 'AG')
                const key = (this as any).point?.['hc-key'] as string;
                if (!key) return '';
                const abbr = key.split('-')[1];
                // Don't show numeric codes (like mx-3622)
                if (abbr && /^\d+$/.test(abbr)) return '';
                return abbr ? abbr.toUpperCase() : '';
              },
              style: {
                fontSize: '7px',
                fontWeight: '500',
                color: '#333',
                textOutline: '1.5px white',
                fontFamily: 'Inter, sans-serif'
              },
              allowOverlap: true
            },
            borderColor: '#ffffff',
            borderWidth: 1.5
          }]
        };

        setMapOptions(options);

        const rankingChartHeight = Math.max(rankingData.length * 32, 500);

        const rankingChartOptions: Highcharts.Options = {
          chart: {
            type: 'bar',
            backgroundColor: '#ffffff',
            height: rankingChartHeight,
            marginLeft: 160,
            marginRight: 10
          },
          credits: {
            enabled: false
          },
          title: {
            text: undefined
          },
          xAxis: {
            type: 'category',
            labels: {
              style: {
                fontSize: '10px',
                fontFamily: 'Inter, sans-serif',
                color: '#666'
              }
            }
          },
          yAxis: {
            min: 0,
            title: {
              text: undefined
            },
            labels: {
              enabled: false
            },
            gridLineWidth: 0
          },
          legend: {
            enabled: false
          },
          plotOptions: {
            bar: {
              dataLabels: {
                enabled: false
              },
              colorByPoint: false,
              pointPadding: 0.15,
              groupPadding: 0.05,
              borderRadius: 4
            }
          },
          series: [{
            type: 'bar',
            name: 'Total Volume',
            data: rankingData,
            color: {
              linearGradient: { x1: 0, y1: 0, x2: 1, y2: 0 },
              stops: [
                [0, '#48a999'],
                [1, '#5dc9b8']
              ]
            }
          }]
        };

        setRankingOptions(rankingChartOptions);
      })
      .catch(error => {
        console.error('Failed to load map data:', error);
      });
  }, []);

  if (!mapOptions) {
    return (
      <section className="map-section">
        <div className="loading">Loading map...</div>
      </section>
    );
  }

  return (
    <section className="map-section">
      <div className="map-header">
        <h2 className="section-title">Mexico Beverage Industry</h2>
        <h3 className="section-subtitle">Market Share Analysis</h3>
        <p className="section-description">
          This comprehensive study examines the competitive landscape of Mexico's carbonated soft drink market, focusing on the strategic positioning and regional market penetration of the two dominant players: PepsiCo and The Coca-Cola Company. Through detailed geographic analysis across all 32 Mexican states, this research reveals significant regional variations in consumer preferences and brand loyalty patterns.
        </p>
        <p className="section-description">
          The Mexican beverage market represents one of the world's most competitive territories for soft drink manufacturers, with annual consumption rates among the highest globally. Understanding the nuanced state-by-state distribution of market share provides critical insights for strategic planning, distribution optimization, and targeted marketing initiatives. This interactive visualization synthesizes market data to illustrate territorial dominance, competitive dynamics, and opportunities for market expansion.
        </p>
      </div>

      <div className="map-intro">
        <h4 className="map-intro-title">Geographic State-Level Analysis</h4>
        <p className="map-intro-text">
          The following interactive visualization presents market dominance patterns across Mexico's 32 states. Each region is color-coded by the leading brand, revealing distinct geographic preferences and competitive territories throughout the country.
        </p>
      </div>

      <div className="charts-grid">
        {/* Ranking Chart */}
        {rankingOptions && Object.keys(stateFlags).length > 0 && (
          <StateRankingsChart rankingOptions={rankingOptions} stateFlags={stateFlags} />
        )}

        {/* Map Chart */}
        {mapOptions && <BrandDominanceMap mapOptions={mapOptions} />}
      </div>
    </section>
  );
};
