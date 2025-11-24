import React, { useRef, useEffect, useCallback } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './StateRankingsChart.css';

interface StateRankingsChartProps {
  rankingOptions: Highcharts.Options;
  stateFlags: Record<string, string>;
}

export const StateRankingsChart: React.FC<StateRankingsChartProps> = ({ rankingOptions, stateFlags }) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HighchartsReact.RefObject>(null);
  const stateFlagsRef = useRef(stateFlags);

  // Debug: verificar banderas recibidas
  useEffect(() => {
    console.log('🏳️ StateRankingsChart - Banderas recibidas:', Object.keys(stateFlags).length, 'estados');
    console.log('🏳️ Primeras banderas:', Object.keys(stateFlags).slice(0, 5));
  }, [stateFlags]);

  // Actualizar la referencia cuando cambien las banderas
  useEffect(() => {
    stateFlagsRef.current = stateFlags;
  }, [stateFlags]);

  // Función para manejar el movimiento del mouse y actualizar la posición del tooltip
  const handleMouseMove = (e: MouseEvent) => {
    if (!tooltipRef.current) return;

    const tooltip = tooltipRef.current;
    if (tooltip.style.display === 'none') return;

    // Obtener las dimensiones del tooltip
    const tooltipRect = tooltip.getBoundingClientRect();
    const padding = 15; // Espacio entre el cursor y el tooltip

    // Calcular la posición inicial (a la derecha del cursor)
    let left = e.clientX + padding;
    let top = e.clientY + padding;

    // Ajustar si se sale por la derecha de la pantalla
    if (left + tooltipRect.width > window.innerWidth) {
      left = e.clientX - tooltipRect.width - padding;
    }

    // Ajustar si se sale por abajo de la pantalla
    if (top + tooltipRect.height > window.innerHeight) {
      top = e.clientY - tooltipRect.height - padding;
    }

    // Aplicar la posición
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  };

  // Función para ocultar el tooltip
  const hideTooltip = () => {
    if (!tooltipRef.current) return;

    tooltipRef.current.style.opacity = '0';
    setTimeout(() => {
      if (tooltipRef.current && tooltipRef.current.style.opacity === '0') {
        tooltipRef.current.style.display = 'none';
      }
    }, 100);
  };

  // Configurar los eventos del mouse
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);

    const currentContainer = containerRef.current;
    if (currentContainer) {
      currentContainer.addEventListener('mouseleave', hideTooltip);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (currentContainer) {
        currentContainer.removeEventListener('mouseleave', hideTooltip);
      }
      if (tooltipRef.current) {
        tooltipRef.current.style.display = 'none';
      }
    };
  }, []);

  // Configurar el callback del chart cuando esté listo
  const chartCallback = useCallback((chart: Highcharts.Chart) => {
    // Configurar eventos de hover para cada punto
    chart.series[0].points.forEach((point: any) => {
      const element = point.graphic?.element;
      if (!element || !tooltipRef.current) return;

      element.addEventListener('mouseenter', () => {
        const tooltip = tooltipRef.current;
        if (!tooltip) return;

        const stateData = point.data;
        if (!stateData) return;

        console.log('🔍 State data:', stateData);
        console.log('🔍 State flags available:', stateFlagsRef.current);

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

        // Obtener la URL de la bandera usando la referencia actualizada
        const flagUrl = stateFlagsRef.current[stateData.name] || '';
        console.log('🔍 Flag URL for', stateData.name, ':', flagUrl);

        // Crear el HTML del tooltip usando el mismo diseño que el mapa
        tooltip.innerHTML = `
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

        tooltip.style.display = 'block';
        tooltip.style.opacity = '1';
      });

      element.addEventListener('mouseleave', () => {
        hideTooltip();
      });
    });
  }, []);

  // Modificar las opciones para deshabilitar el tooltip nativo
  const modifiedOptions: Highcharts.Options = {
    ...rankingOptions,
    tooltip: {
      enabled: false
    }
  };

  return (
    <div className="ranking-container" ref={containerRef}>
      <div className="ranking-title-bar">
        <h3 className="ranking-title">State Rankings by Total Market Volume</h3>
      </div>

      <div className="ranking-chart-wrapper">
        <div className="ranking-chart-inner">
          <HighchartsReact
            ref={chartRef}
            highcharts={Highcharts}
            options={modifiedOptions}
            callback={chartCallback}
          />
        </div>
      </div>

      {/* Tooltip personalizado */}
      <div
        ref={tooltipRef}
        className="ranking-tooltip"
        style={{
          display: 'none',
          position: 'fixed',
          opacity: 0,
          transition: 'opacity 0.1s ease-in-out',
          zIndex: 9999,
          pointerEvents: 'none'
        }}
      />
    </div>
  );
};
