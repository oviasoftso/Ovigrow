import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import {
  TrendingUp,
  TrendingDown,
  Search,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'

interface CropPrice {
  crop: string
  currentPrice: number
  previousPrice: number
  unit: string
  market: string
  change: number
  trend: 'up' | 'down' | 'stable'
}

const cropPrices: CropPrice[] = [
  { crop: 'Maize (White)', currentPrice: 285, previousPrice: 260, unit: 'USD/ton', market: 'Harare', change: 9.6, trend: 'up' },
  { crop: 'Maize (Yellow)', currentPrice: 310, previousPrice: 295, unit: 'USD/ton', market: 'Harare', change: 5.1, trend: 'up' },
  { crop: 'Wheat', currentPrice: 420, previousPrice: 440, unit: 'USD/ton', market: 'Bulawayo', change: -4.5, trend: 'down' },
  { crop: 'Soybeans', currentPrice: 520, previousPrice: 510, unit: 'USD/ton', market: 'Harare', change: 2.0, trend: 'up' },
  { crop: 'Cotton', currentPrice: 180, previousPrice: 175, unit: 'USD/ton', market: 'Gweru', change: 2.9, trend: 'up' },
  { crop: 'Tobacco (Virginia)', currentPrice: 3200, previousPrice: 3100, unit: 'USD/ton', market: 'Harare', change: 3.2, trend: 'up' },
  { crop: 'Sugar Beans', currentPrice: 680, previousPrice: 700, unit: 'USD/ton', market: 'Harare', change: -2.9, trend: 'down' },
  { crop: 'Groundnuts', currentPrice: 850, previousPrice: 820, unit: 'USD/ton', market: 'Mutare', change: 3.7, trend: 'up' },
  { crop: 'Sorghum', currentPrice: 220, previousPrice: 215, unit: 'USD/ton', market: 'Masvingo', change: 2.3, trend: 'up' },
  { crop: 'Millet', currentPrice: 200, previousPrice: 210, unit: 'USD/ton', market: 'Masvingo', change: -4.8, trend: 'down' },
]

const marketNews = [
  {
    id: 1,
    title: 'Maize prices surge on strong demand',
    summary: 'White maize prices have increased by 9.6% this week due to strong demand from millers and reduced supply from farmers holding stocks.',
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
    summary: 'The 2025 tobacco auction season has officially opened with prices expected to remain firm due to global supply constraints.',
    date: '1 day ago',
    impact: 'positive',
  },
]

export default function MarketPrices() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPrices = cropPrices.filter(
    (price) =>
      price.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      price.market.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Market Prices</h1>
        <p className="text-muted-foreground">
          Current crop prices and market intelligence for Zimbabwe
        </p>
      </div>

      {/* Market Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crops Tracked</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cropPrices.length}</div>
            <p className="text-xs text-muted-foreground">Across 4 markets</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Price Increases</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {cropPrices.filter((p) => p.trend === 'up').length}
            </div>
            <p className="text-xs text-muted-foreground">Crops trending up</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Price Decreases</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {cropPrices.filter((p) => p.trend === 'down').length}
            </div>
            <p className="text-xs text-muted-foreground">Crops trending down</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="prices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="prices">Crop Prices</TabsTrigger>
          <TabsTrigger value="news">Market News</TabsTrigger>
        </TabsList>

        <TabsContent value="prices" className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search crops or markets..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Price Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium">Crop</th>
                      <th className="text-left p-4 font-medium">Market</th>
                      <th className="text-right p-4 font-medium">Current Price</th>
                      <th className="text-right p-4 font-medium">Previous</th>
                      <th className="text-right p-4 font-medium">Change</th>
                      <th className="text-right p-4 font-medium">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPrices.map((price) => (
                      <tr key={price.crop} className="border-b hover:bg-muted/50">
                        <td className="p-4 font-medium">{price.crop}</td>
                        <td className="p-4 text-muted-foreground">{price.market}</td>
                        <td className="p-4 text-right">
                          ${price.currentPrice}
                          <span className="text-xs text-muted-foreground ml-1">
                            /{price.unit.split('/')[1]}
                          </span>
                        </td>
                        <td className="p-4 text-right text-muted-foreground">
                          ${price.previousPrice}
                        </td>
                        <td className="p-4 text-right">
                          <span
                            className={
                              price.trend === 'up'
                                ? 'text-green-600'
                                : price.trend === 'down'
                                ? 'text-red-600'
                                : 'text-muted-foreground'
                            }
                          >
                            {price.change > 0 ? '+' : ''}
                            {price.change}%
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {price.trend === 'up' ? (
                            <TrendingUp className="h-5 w-5 text-green-600 inline" />
                          ) : price.trend === 'down' ? (
                            <TrendingDown className="h-5 w-5 text-red-600 inline" />
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="news" className="space-y-4">
          {marketNews.map((news) => (
            <Card key={news.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{news.title}</CardTitle>
                  <Badge
                    variant={
                      news.impact === 'positive' ? 'success' : 'destructive'
                    }
                  >
                    {news.impact === 'positive' ? 'Bullish' : 'Bearish'}
                  </Badge>
                </div>
                <CardDescription>{news.date}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{news.summary}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
