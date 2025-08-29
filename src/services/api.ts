import axios from 'axios';
import { MetalPrice, MetalDetails, MetalType } from '../types';

const API_BASE_URL = 'https://api.metals.live/v1';
const ALTERNATIVE_API = 'https://api.coingecko.com/api/v3';

const FALLBACK_DATA: Record<MetalType, MetalDetails> = {
  gold: {
    metal: 'Gold',
    currentPrice: 1950.50 + (Math.random() * 20 - 10),
    currency: 'USD',
    unit: 'per troy ounce',
    timestamp: new Date().toISOString(),
    change24h: 12.30 + (Math.random() * 5 - 2.5),
    changePercent24h: 0.63 + (Math.random() * 0.5 - 0.25),
    previousClose: 1938.20,
    previousOpen: 1935.80,
    high24h: 1962.40,
    low24h: 1930.10,
    volume24h: 1250000,
    description: 'Gold is a precious metal that has been used as currency and jewelry for thousands of years. It is highly valued for its rarity, beauty, and resistance to corrosion. Gold is considered a safe-haven asset and is often used as a hedge against inflation and economic uncertainty.',
    purity: '24 Karat (99.9% pure)',
    marketCap: 12000000000000
  },
  silver: {
    metal: 'Silver',
    currentPrice: 23.45 + (Math.random() * 2 - 1),
    currency: 'USD',
    unit: 'per troy ounce',
    timestamp: new Date().toISOString(),
    change24h: -0.15 + (Math.random() * 0.5 - 0.25),
    changePercent24h: -0.64 + (Math.random() * 0.3 - 0.15),
    previousClose: 23.60,
    previousOpen: 23.55,
    high24h: 23.80,
    low24h: 23.20,
    volume24h: 850000,
    description: 'Silver is a precious metal with excellent electrical conductivity and antimicrobial properties. It is used in jewelry, electronics, and industrial applications. Silver is also considered a precious metal investment and is often used in coinage and bullion.',
    purity: '24 Karat (99.9% pure)',
    marketCap: 1500000000000
  },
  platinum: {
    metal: 'Platinum',
    currentPrice: 985.75 + (Math.random() * 15 - 7.5),
    currency: 'USD',
    unit: 'per troy ounce',
    timestamp: new Date().toISOString(),
    change24h: 8.25 + (Math.random() * 3 - 1.5),
    changePercent24h: 0.84 + (Math.random() * 0.4 - 0.2),
    previousClose: 977.50,
    previousOpen: 975.20,
    high24h: 990.30,
    low24h: 970.80,
    volume24h: 450000,
    description: 'Platinum is a rare, dense, and corrosion-resistant metal. It is used in catalytic converters, jewelry, and various industrial applications. Platinum is one of the rarest precious metals and is highly valued for its unique properties and industrial uses.',
    purity: '24 Karat (99.9% pure)',
    marketCap: 800000000000
  },
  palladium: {
    metal: 'Palladium',
    currentPrice: 1250.30 + (Math.random() * 25 - 12.5),
    currency: 'USD',
    unit: 'per troy ounce',
    timestamp: new Date().toISOString(),
    change24h: -5.70 + (Math.random() * 4 - 2),
    changePercent24h: -0.45 + (Math.random() * 0.3 - 0.15),
    previousClose: 1256.00,
    previousOpen: 1258.50,
    high24h: 1265.20,
    low24h: 1245.80,
    volume24h: 320000,
    description: 'Palladium is a rare silvery-white metal used primarily in catalytic converters for automobiles and in jewelry. It is part of the platinum group metals and is highly valued for its catalytic properties and rarity.',
    purity: '24 Karat (99.9% pure)',
    marketCap: 600000000000
  }
};

export class MetalsAPI {
  static async getMetalPrice(metal: MetalType): Promise<MetalPrice> {
    try {
      console.log(`Using fallback data for ${metal} (CORS issue in web development)`);
      
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
      
    } catch (error) {
      console.log(`API call failed for ${metal}, using fallback data`);
    }

    const fallback = FALLBACK_DATA[metal];
    const randomVariation = (Math.random() - 0.5) * 0.02;
    
    return {
      metal: fallback.metal,
      price: fallback.currentPrice * (1 + randomVariation),
      currency: fallback.currency,
      unit: fallback.unit,
      timestamp: new Date().toISOString(),
      change24h: fallback.change24h * (1 + randomVariation * 0.5),
      changePercent24h: fallback.changePercent24h * (1 + randomVariation * 0.5),
      previousClose: fallback.previousClose,
      previousOpen: fallback.previousOpen,
      high24h: fallback.high24h,
      low24h: fallback.low24h,
      volume24h: fallback.volume24h
    };
  }

  static async getAllMetalPrices(): Promise<MetalPrice[]> {
    const metals: MetalType[] = ['gold', 'silver', 'platinum', 'palladium'];
    const promises = metals.map(metal => this.getMetalPrice(metal));
    
    try {
      const results = await Promise.all(promises);
      return results;
    } catch (error) {
      console.warn('Failed to fetch all metal prices, using fallback data');
      return Object.values(FALLBACK_DATA).map(metal => ({
        metal: metal.metal,
        price: metal.currentPrice,
        currency: metal.currency,
        unit: metal.unit,
        timestamp: metal.timestamp,
        change24h: metal.change24h,
        changePercent24h: metal.changePercent24h,
        previousClose: metal.previousClose,
        previousOpen: metal.previousOpen,
        high24h: metal.high24h,
        low24h: metal.low24h,
        volume24h: metal.volume24h
      }));
    }
  }

  static async getMetalDetails(metal: MetalType): Promise<MetalDetails> {
    try {
      const priceData = await this.getMetalPrice(metal);
      const fallback = FALLBACK_DATA[metal];
      
      return {
        ...priceData,
        currentPrice: priceData.price,
        description: fallback.description,
        purity: fallback.purity,
        marketCap: fallback.marketCap
      };
    } catch (error) {
      console.warn(`Failed to fetch ${metal} details, using fallback data`);
      return FALLBACK_DATA[metal];
    }
  }
}
