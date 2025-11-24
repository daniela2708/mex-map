# Ejemplo de comportamiento de la gráfica de ranking

Este documento resume el diseño esperado para la gráfica de ranking de países por inversión en I+D. Incluye un ejemplo de componente React con Chart.js, el diseño del contenedor con scroll y la lógica del tooltip personalizado.

## Reglas de interacción

- **Filtrado por año y sector:** la gráfica muestra únicamente el año y sector seleccionado; los promedios de UE/Zona Euro se normalizan al número de países para el modo en millones de euros.
- **Ordenación:** los países se ordenan de mayor a menor valor y, en caso de empate, alfabéticamente para mantener un orden estable.
- **Colores:**
  - España se resalta en rojo.
  - Unión Europea en amarillo.
  - Zona Euro en verde.
  - El resto usa el color del sector elegido.
- **Altura dinámica:** la altura del lienzo se ajusta a `max(400px, países * 25px)` y se envuelve en un contenedor con scroll vertical y bordes suaves.

## Tooltip personalizado

- Se desactiva el tooltip nativo de Chart.js y se renderiza HTML propio.
- El tooltip incluye bandera (vía `country_flags.json`), nombre localizado, valor principal (en % PIB o millones €), etiqueta de fiabilidad, variación interanual y comparativas contra UE, España y Canarias.
- La posición se actualiza con `mousemove`, evitando que el tooltip se salga de la ventana.
- Al salir del gráfico se oculta con una transición suave.

## Ejemplo de implementación

A continuación se muestra un componente completo que aplica las reglas anteriores:

```tsx
// src/components/CountryRankingChart.tsx (ejemplo)
import React, { memo, useRef, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import * as d3 from 'd3';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartEvent
} from 'chart.js';
import { EuropeCSVData } from '../data/rdInvestment';
import { EU_COLORS, SECTOR_COLORS } from '../utils/colors';
import countryFlagsData from '../logos/country_flags.json';
import { DataDisplayType } from './DataTypeSelector';

interface CountryFlag {
  country: string;
  code: string;
  iso3: string;
  flag: string;
}

const countryFlags = countryFlagsData as CountryFlag[];

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface CountryRankingChartProps {
  data: EuropeCSVData[];
  selectedYear: number;
  language: 'es' | 'en';
  selectedSector?: string;
  autonomousCommunitiesData?: AutonomousCommunityData[];
  dataDisplayType?: DataDisplayType;
}

// ... el resto del componente define:
// - Paleta de colores, textos y mapeos por sector.
// - Filtrado de datos por año/sector y normalización de valores promedio.
// - Generación de labels y colores por país, resaltando España/UE/Zona Euro.
// - Tooltip HTML con bandera, variación interanual, ranking y comparativas.
// - Listeners de mouse para mostrar, mover y ocultar el tooltip.
// - Contenedor con scroll (400px de alto, borde y radio suaves).

export default memo(CountryRankingChart);
```

Este ejemplo sirve como referencia para implementar o validar el comportamiento esperado del ranking, el diseño del scroll y el funcionamiento del tooltip.
