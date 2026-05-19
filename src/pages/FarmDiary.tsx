import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Plus,
  Calendar,
  Search,
  Sprout,
  Droplets,
  Leaf,
  Bug,
  Wheat,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from 'lucide-react'

interface DiaryEntry {
  id: string
  title: string
  content: string
  category: 'planting' | 'irrigation' | 'fertilizing' | 'pest_control' | 'harvest' | 'general'
  date: string
  field: string
  weather: string
  mood: 'excellent' | 'good' | 'average' | 'poor'
}

const categoryConfig = {
  planting: { label: 'Planting', icon: Sprout, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/20', variant: 'success' as const },
  irrigation: { label: 'Irrigation', icon: Droplets, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/20', variant: 'default' as const },
  fertilizing: { label: 'Fertilizing', icon: Leaf, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/20', variant: 'success' as const },
  pest_control: { label: 'Pest Control', icon: Bug, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/20', variant: 'destructive' as const },
  harvest: { label: 'Harvest', icon: Wheat, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/20', variant: 'warning' as const },
  general: { label: 'General', icon: BookOpen, color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-900/20', variant: 'secondary' as const },
}

const initialEntries: DiaryEntry[] = [
  {
    id: '1',
    title: 'Maize top dressing applied',
    content: 'Applied Compound D fertilizer at 300kg/ha to Field A. Plants are at V6 stage and looking healthy. Good moisture levels in the soil after last week\'s rains.',
    category: 'fertilizing',
    date: '2025-01-15',
    field: 'Field A - North',
    weather: 'Partly cloudy, 28°C',
    mood: 'good',
  },
  {
    id: '2',
    title: 'Irrigated wheat fields',
    content: 'Ran centre pivot irrigation for 6 hours on Field B. Soil moisture was at 45%, brought up to 75%. Wheat is at heading stage, looking promising for a good yield.',
    category: 'irrigation',
    date: '2025-01-14',
    field: 'Field B - East',
    weather: 'Hot and dry, 34°C',
    mood: 'good',
  },
  {
    id: '3',
    title: 'Fall armyworm spotted in Field A',
    content: 'Found fall armyworm larvae on 3 out of 20 maize plants inspected. Larvae are in early instars. Applied Emamectin benzoate at 0.4g/L. Will monitor closely over the next 3 days.',
    category: 'pest_control',
    date: '2025-01-13',
    field: 'Field A - North',
    weather: 'Overcast, 25°C',
    mood: 'average',
  },
  {
    id: '4',
    title: 'Soybean planting completed',
    content: 'Finished planting 3 hectares of soybeans (variety Irene) in Field C. Used 80kg/ha seed rate with inoculant. Row spacing at 45cm. Hoping for good rains this week.',
    category: 'planting',
    date: '2025-01-10',
    field: 'Field C - South',
    weather: 'Clear skies, 30°C',
    mood: 'excellent',
  },
  {
    id: '5',
    title: 'Tobacco harvest begins',
    content: 'Started priming Virginia Gold tobacco in Field D. First picking of 8 leaves per plant. Quality looks good with proper leaf maturity. Curing barn is prepared.',
    category: 'harvest',
    date: '2025-01-08',
    field: 'Field D - West',
    weather: 'Warm and humid, 29°C',
    mood: 'excellent',
  },
  {
    id: '6',
    title: 'Farm meeting with agronomist',
    content: 'Met with AGRITEX officer to discuss Pfumvudza inputs allocation for next season. Received recommendation for soil amendments. Planning to lime Field B before winter wheat.',
    category: 'general',
    date: '2025-01-05',
    field: 'General',
    weather: 'Mild, 24°C',
    mood: 'good',
  },
]

export default function FarmDiary() {
  const [entries, setEntries] = useState<DiaryEntry[]>(initialEntries)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 0, 1))
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    category: 'general' as DiaryEntry['category'],
    field: '',
    weather: '',
    mood: 'good' as DiaryEntry['mood'],
  })

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.field.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || entry.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const handleAddEntry = () => {
    const entry: DiaryEntry = {
      id: Date.now().toString(),
      title: newEntry.title,
      content: newEntry.content,
      category: newEntry.category,
      date: new Date().toISOString().split('T')[0],
      field: newEntry.field,
      weather: newEntry.weather,
      mood: newEntry.mood,
    }
    setEntries([entry, ...entries])
    setNewEntry({ title: '', content: '', category: 'general', field: '', weather: '', mood: 'good' })
    setIsAddOpen(false)
  }

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'excellent': return 'Excellent'
      case 'good': return 'Good'
      case 'average': return 'Average'
      case 'poor': return 'Poor'
      default: return mood
    }
  }

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']

  const categoryEntries = entries.reduce((acc, entry) => {
    acc[entry.category] = (acc[entry.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Farm Diary</h1>
          <p className="text-muted-foreground">
            Record and track your daily farming activities
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>New Diary Entry</DialogTitle>
              <DialogDescription>Record a farming activity or observation</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  placeholder="e.g., Maize top dressing applied"
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={newEntry.category}
                    onValueChange={(v) => setNewEntry({ ...newEntry, category: v as DiaryEntry['category'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categoryConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Field</label>
                  <Input
                    placeholder="e.g., Field A - North"
                    value={newEntry.field}
                    onChange={(e) => setNewEntry({ ...newEntry, field: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  placeholder="Describe the activity, observations, or notes..."
                  rows={4}
                  value={newEntry.content}
                  onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Weather</label>
                  <Input
                    placeholder="e.g., Sunny, 28°C"
                    value={newEntry.weather}
                    onChange={(e) => setNewEntry({ ...newEntry, weather: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Day Rating</label>
                  <Select
                    value={newEntry.mood}
                    onValueChange={(v) => setNewEntry({ ...newEntry, mood: v as DiaryEntry['mood'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="average">Average</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleAddEntry} className="w-full" disabled={!newEntry.title}>
                Save Entry
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{entries.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{entries.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories Used</CardTitle>
            <Sprout className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(categoryEntries).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Active</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Field A</div>
          </CardContent>
        </Card>
      </div>

      {/* Month navigator */}
      <Card>
        <CardContent className="flex items-center justify-between py-3">
          <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="list" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="categories">By Category</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="list" className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search entries..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.entries(categoryConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Entries List */}
          <div className="space-y-4">
            {filteredEntries.map((entry) => {
              const config = categoryConfig[entry.category]
              const Icon = config.icon
              return (
                <Card key={entry.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`rounded-full p-2 ${config.bg}`}>
                          <Icon className={`h-4 w-4 ${config.color}`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{entry.title}</CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            {new Date(entry.date).toLocaleDateString('en-ZW', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={config.variant}>{config.label}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{entry.content}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {entry.field}
                      </span>
                      <span>{entry.weather}</span>
                      <span>Day: {getMoodEmoji(entry.mood)}</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {filteredEntries.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No diary entries found.</p>
                <p className="text-sm">Add your first entry to start tracking your farm activities.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(categoryConfig).map(([key, config]) => {
              const Icon = config.icon
              const count = categoryEntries[key] || 0
              return (
                <Card key={key} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`rounded-full p-3 ${config.bg}`}>
                        <Icon className={`h-5 w-5 ${config.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{config.label}</CardTitle>
                        <CardDescription>{count} entries</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {entries
                        .filter((e) => e.category === key)
                        .slice(0, 2)
                        .map((entry) => (
                          <div key={entry.id} className="text-sm">
                            <p className="font-medium">{entry.title}</p>
                            <p className="text-xs text-muted-foreground">{entry.date}</p>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

