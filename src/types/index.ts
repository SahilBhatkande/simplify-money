export interface MetalPrice {
  metal: string;
  price: number;
  currency: string;
  unit: string;
  timestamp: string;
  change24h: number;
  changePercent24h: number;
  previousClose: number;
  previousOpen: number;
  high24h: number;
  low24h: number;
  volume24h: number;
}

export interface MetalDetails {
  metal: string;
  currentPrice: number;
  currency: string;
  unit: string;
  timestamp: string;
  change24h: number;
  changePercent24h: number;
  previousClose: number;
  previousOpen: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  description: string;
  purity: string;
  marketCap?: number;
}

export type MetalType = 'gold' | 'silver' | 'platinum' | 'palladium';

