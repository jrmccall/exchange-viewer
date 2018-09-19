export interface OrderBook {
  pair: string;
  asks: any[];
  bids: any[];
  isFrozen: string;
  seq: number;
  last: string;
  baseVolume: string;
  quoteVolume: string;
  obMetric1: number;
  obMetric10: number;
  obMetricAll: number;
  baseCoin: string;
  quoteCoin: string;
  coin: string;
  base: string;
  mktCap: number;
}
