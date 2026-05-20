export interface CropPrice {
  crop: string
  currentPrice: number
  previousPrice: number
  unit: string
  market: string
  change: number
  trend: 'up' | 'down' | 'stable'
  lastUpdated: string
}

export interface MarketNews {
  id: number
  title: string
  summary: string
  date: string
  impact: 'positive' | 'negative'
}

// Base prices (USD/ton) - realistic Zimbabwe market data
const BASE_PRICES: Omit<CropPrice, 'currentPrice' | 'change' | 'trend' | 'lastUpdated'>[] = [
  { crop: 'Maize (White)', previousPrice: 260, unit: 'USD/ton', market: 'Harare' },
  { crop: 'Maize (Yellow)', previousPrice: 295, unit: 'USD/ton', market: 'Harare' },
  { crop: 'Wheat', previousPrice: 440, unit: 'USD/ton', market: 'Bulawayo' },
  { crop: 'Soybeans', previousPrice: 510, unit: 'USD/ton', market: 'Harare' },
  { crop: 'Cotton', previousPrice: 175, unit: 'USD/ton', market: 'Gweru' },
  { crop: 'Tobacco (Virginia)', previousPrice: 3100, unit: 'USD/ton', market: 'Harare' },
  { crop: 'Sugar Beans', previousPrice: 700, unit: 'USD/ton', market: 'Harare' },
  { crop: 'Groundnuts', previousPrice: 820, unit: 'USD/ton', market: 'Mutare' },
  { crop: 'Sorghum', previousPrice: 215, unit: 'USD/ton', market: 'Masvingo' },
  { crop: 'Millet', previousPrice: 210, unit: 'USD/ton', market: 'Masvingo' },
]

const NEWS_ITEMS: MarketNews[] = [
  {
    id: 1,
    title: 'Maize prices surge on strong demand',
    summary: 'White maize prices have increased due to strong demand from millers and reduced supply from farmers holding stocks.',
    date: '2 hours ago',
    impact: 'positive',
  },
  {
    id: 2,
    title: 'Wheat imports expected to increase',
    summary: 'Government announces plans to increase wheat imports to meet domestic demand as local production falls short of targets.',
    date: '5 hours ago',
    impact: 'negative',
  },
  {
    id: 3,
    title: 'Tobacco auction season begins',
    summary: 'The tobacco auction season has officially opened with prices expected to remain firm due to global supply constraints.',
    date: '1 day ago',
    impact: 'positive',
  },
  {
    id: 4,
    title: 'Soybean demand rises from oil processors',
    summary: 'Local oil processing companies are increasing soybean procurement, pushing prices upward in major markets.',
    date: '1 day ago',
    impact: 'positive',
  },
  {
    id: 5,
    title: 'Cotton sector faces global price pressure',
    summary: 'International cotton prices have softened, affecting local buying prices. Farmers advised to explore value addition.',
    date: '2 days ago',
    impact: 'negative',
  },
]

const CACHE_KEY = 'ovigrow-market-cache'
const CACHE_TTL = 60 * 60 * 1000 // 1 hour

function simulatePriceVariation(basePrice: number): number {
  // Simulate -3% to +3% variation
  const variation = (Math.random() - 0.5) * 0.06
  return Math.round(basePrice * (1 + variation))
}

export function fetchMarketPrices(): CropPrice[] {
  // Check cache
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (raw) {
      const cached = JSON.parse(raw)
      if (Date.now() - cached.fetchedAt < CACHE_TTL) {
        return cached.prices
      }
    }
  } catch {
    // ignore
  }

  const now = new Date().toISOString()
  const prices: CropPrice[] = BASE_PRICES.map(base => {
    const currentPrice = simulatePriceVariation(base.previousPrice)
    const change = Math.round(((currentPrice - base.previousPrice) / base.previousPrice) * 1000) / 10
    return {
      ...base,
      currentPrice,
      change,
      trend: change > 0.5 ? 'up' : change < -0.5 ? 'down' : 'stable',
      lastUpdated: now,
    }
  })

  // Cache
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ prices, fetchedAt: Date.now() }))
  } catch {
    // ignore
  }

  return prices
}

export function getMarketNews(): MarketNews[] {
  return NEWS_ITEMS
}

export function clearMarketCache(): void {
  localStorage.removeItem(CACHE_KEY)
}
