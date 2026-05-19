import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, Plus, MapPin, Star, MessageSquare, Filter, ShoppingCart } from 'lucide-react'

interface Product {
  id: string
  name: string
  category: string
  price: number
  unit: string
  seller: string
  location: string
  rating: number
  reviews: number
  image: string
  inStock: boolean
  description: string
}

const products: Product[] = [
  { id: '1', name: 'SC 403 Maize Seed (10kg)', category: 'seeds', price: 15, unit: 'per kg', seller: 'SeedCo Zimbabwe', location: 'Harare', rating: 4.8, reviews: 124, image: '', inStock: true, description: 'High-yielding maize variety suitable for all regions of Zimbabwe.' },
  { id: '2', name: 'Compound D Fertilizer (50kg)', category: 'fertilizers', price: 45, unit: 'per bag', seller: 'Windmill Pvt Ltd', location: 'Harare', rating: 4.5, reviews: 89, image: '', inStock: true, description: 'Basal fertilizer for maize, wheat, and barley.' },
  { id: '3', name: 'Knapsack Sprayer 20L', category: 'equipment', price: 35, unit: 'each', seller: 'Farm & City', location: 'Bulawayo', rating: 4.2, reviews: 56, image: '', inStock: true, description: 'Manual pressure sprayer for pesticide and herbicide application.' },
  { id: '4', name: 'Fresh Tomatoes', category: 'produce', price: 2, unit: 'per kg', seller: 'Green Valley Farm', location: 'Mutare', rating: 4.9, reviews: 203, image: '', inStock: true, description: 'Grade 1 fresh tomatoes, available in bulk.' },
  { id: '5', name: 'Ammonium Nitrate (50kg)', category: 'fertilizers', price: 38, unit: 'per bag', seller: 'ZFC Pvt Ltd', location: 'Harare', rating: 4.6, reviews: 167, image: '', inStock: true, description: 'Top-dressing fertilizer for maize and small grains.' },
  { id: '6', name: 'Drip Irrigation Kit (1ha)', category: 'equipment', price: 850, unit: 'per kit', seller: 'Irrigation Solutions', location: 'Harare', rating: 4.7, reviews: 34, image: '', inStock: false, description: 'Complete drip irrigation system for 1 hectare.' },
  { id: '7', name: 'Soybean Seed Irene (25kg)', category: 'seeds', price: 12, unit: 'per kg', seller: 'Pannar Seed', location: 'Gweru', rating: 4.4, reviews: 72, image: '', inStock: true, description: 'Early maturing soybean variety, 90-100 days.' },
  { id: '8', name: 'Green Maize (100 ears)', category: 'produce', price: 25, unit: 'per bundle', seller: 'Mazoe Valley Farm', location: 'Mazoe', rating: 4.8, reviews: 45, image: '', inStock: true, description: 'Fresh green maize, ready for market.' },
]

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.seller.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = activeTab === 'all' || p.category === activeTab
    return matchesSearch && matchesTab
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <p className="text-muted-foreground">Buy and sell agricultural products across Zimbabwe</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" />List Product</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Products</CardTitle><ShoppingCart className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{products.length}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Seeds</CardTitle><Star className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{products.filter(p => p.category === 'seeds').length}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Equipment</CardTitle><Star className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{products.filter(p => p.category === 'equipment').length}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Produce</CardTitle><Star className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{products.filter(p => p.category === 'produce').length}</div></CardContent></Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search products or sellers..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="seeds">Seeds</TabsTrigger>
          <TabsTrigger value="fertilizers">Fertilizers</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="produce">Produce</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="h-40 bg-muted flex items-center justify-center">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground" />
                </div>
                <CardHeader className="p-4">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-sm leading-tight">{product.name}</CardTitle>
                    <Badge variant={product.inStock ? 'success' : 'destructive'} className="ml-2 flex-shrink-0">
                      {product.inStock ? 'In Stock' : 'Sold Out'}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">${product.price}</span>
                    <span className="text-sm text-muted-foreground">{product.unit}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />{product.location}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{product.rating}</span>
                      <span className="text-xs text-muted-foreground">({product.reviews})</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">by {product.seller}</p>
                  <Button className="w-full" size="sm" disabled={!product.inStock}>
                    <MessageSquare className="mr-2 h-4 w-4" />Contact Seller
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
