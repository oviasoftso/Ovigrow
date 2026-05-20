import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  TrendingUp,
  TrendingDown,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
} from 'lucide-react'
import { fetchMarketPrices, getMarketNews, clearMarketCache, type CropPrice } from '@/lib/market-data'

export default function MarketPrices() {
  const [searchTerm, setSearchTerm] = useState('')
  const [prices, setPrices] = useState<CropPrice[]>(() => fetchMarketPrices())
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const news = getMarketNews()

  const filteredPrices = prices.filter(
    (price) =>
      price.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      price.market.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleRefresh = () => {
    clearMarketCache()
    setPrices(fetchMarketPrices())
    setLastRefresh(new Date())
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Market Prices</h1>
          <p className="text-muted-foreground">
            Current crop prices and market intelligence for Zimbabwe
            <span className="ml-2 text-xs">(Updated {lastRefresh.toLocaleTimeString()})</span>
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-1" /> Refresh Prices
        </Button>
      </div>

      {/* Market Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crops Tracked</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{prices.length}</div>
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
              {prices.filter((p) => p.trend === 'up').length}
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
              {prices.filter((p) => p.trend === 'down').length}
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
                            <span className="text-muted-foreground">-</span>
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
          {news.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <Badge variant={item.impact === 'positive' ? 'success' : 'destructive'}>
                    {item.impact === 'positive' ? 'Bullish' : 'Bearish'}
                  </Badge>
                </div>
                <CardDescription>{item.date}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{item.summary}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
