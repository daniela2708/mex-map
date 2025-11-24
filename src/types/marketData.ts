export interface StateMarketData {
  pepsi: number;
  cocaCola: number;
  pepsiVolume: number;
  colaVolume: number;
  name: string;
}

export interface MarketDataMap {
  [stateCode: string]: StateMarketData;
}

export interface MapDataPoint {
  'hc-key': string;
  value: number;
}
