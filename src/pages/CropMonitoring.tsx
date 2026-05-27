import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Search, Sprout, Calendar, MapPin, TrendingUp, Sparkles, Loader2, Bot } from 'lucide-react'
import { useStore } from '@/lib/store'
import { streamChatCompletion, type ChatMessage } from '@/lib/openrouter'
import { toast } from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Crop {
  id: string
  name: string
  variety: string
  field: string
  plantingDate: string
  expectedHarvest: string
  status: 'planted' | 'growing' | 'ready' | 'harvested'
  progress: number
  area: number
  notes: string
}

const initialCrops: Crop[] = [
  {
    id: '1',
    name: 'Maize',
    variety: 'SC 403',
    field: 'Field A - North',
    plantingDate: '2024-10-15',
    expectedHarvest: '2025-02-15',
    status: 'growing',
    progress: 65,
    area: 5,
    notes: 'Good growth, some leaf discoloration on edges',
  },
  {
    id: '2',
    name: 'Wheat',
    variety: 'PAN 3195',
    field: 'Field B - East',
    plantingDate: '2024-11-01',
    expectedHarvest: '2025-03-01',
    status: 'growing',
    progress: 80,
    area: 8,
    notes: 'Excellent condition, ready for top dressing',
  },
  {
    id: '3',
    name: 'Soybeans',
    variety: 'Irene',
    field: 'Field C - South',
    plantingDate: '2024-11-15',
    expectedHarvest: '2025-03-15',
    status: 'planted',
    progress: 35,
    area: 3,
    notes: 'Recently planted, monitoring for germination',
  },
  {
    id: '4',
    name: 'Tobacco',
    variety: 'Virginia Gold',
    field: 'Field D - West',
    plantingDate: '2024-09-01',
    expectedHarvest: '2025-01-15',
    status: 'ready',
    progress: 95,
    area: 2,
    notes: 'Ready for harvest, leaves turning golden',
  },
]

const SYSTEM_PROMPT = `You are OviGrow AI, a crop specialist for Zimbabwe.
Provide insights and recommendations based on the current crop monitoring data.
Include growth stage analysis and potential risks.
Use markdown formatting.`

export default function CropMonitoring() {
  const [crops, setCrops] = useState<Crop[]>(initialCrops)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiReport, setAiReport] = useState('')
  const { selectedModel } = useStore()

  const [newCrop, setNewCrop] = useState({
    name: '',
    variety: '',
    field: '',
    plantingDate: '',
    expectedHarvest: '',
    area: '',
    notes: '',
  })

  const filteredCrops = crops.filter(
    (crop) =>
      crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crop.field.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddCrop = () => {
    const crop: Crop = {
      id: Date.now().toString(),
      ...newCrop,
      status: 'planted',
      progress: 0,
      area: parseFloat(newCrop.area),
    }
    setCrops([...crops, crop])
    setNewCrop({
      name: '',
      variety: '',
      field: '',
      plantingDate: '',
      expectedHarvest: '',
      area: '',
      notes: '',
    })
    setIsAddDialogOpen(false)
  }

  const handleAIAdvisor = async () => {
    if (crops.length === 0) return

    setIsAnalyzing(true)
    setAiReport('')

    const messages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Analyze my current crops:
        ${crops.map(c => `- ${c.name} (${c.variety}) in ${c.field}: ${c.status}, ${c.progress}% progress`).join('\n')}`
      }
    ]

    try {
      await streamChatCompletion(
        {
          model: selectedModel,
          messages,
        },
        (chunk) => {
          setAiReport(prev => prev + chunk)
        },
        () => {
          setIsAnalyzing(false)
          toast.success('Crop Insights Generated!')
        },
        (error) => {
          setIsAnalyzing(false)
          toast.error(`AI Error: ${error.message}`)
        }
      )
    } catch (error) {
      setIsAnalyzing(false)
      toast.error('Failed to connect to AI service.')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planted':
        return 'secondary'
      case 'growing':
        return 'default'
      case 'ready':
        return 'success'
      case 'harvested':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Crop Monitoring</h1>
          <p className="text-muted-foreground">
            Track and manage your crops from planting to harvest
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleAIAdvisor} disabled={isAnalyzing || crops.length === 0}>
            {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            AI Advisor
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Crop
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Crop</DialogTitle>
                <DialogDescription>
                  Record a new crop planting in your farm
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Crop Name</label>
                    <Input
                      placeholder="e.g., Maize"
                      value={newCrop.name}
                      onChange={(e) =>
                        setNewCrop({ ...newCrop, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Variety</label>
                    <Input
                      placeholder="e.g., SC 403"
                      value={newCrop.variety}
                      onChange={(e) =>
                        setNewCrop({ ...newCrop, variety: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Field/Location</label>
                  <Input
                    placeholder="e.g., Field A - North"
                    value={newCrop.field}
                    onChange={(e) =>
                      setNewCrop({ ...newCrop, field: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Planting Date</label>
                    <Input
                      type="date"
                      value={newCrop.plantingDate}
                      onChange={(e) =>
                        setNewCrop({ ...newCrop, plantingDate: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Expected Harvest</label>
                    <Input
                      type="date"
                      value={newCrop.expectedHarvest}
                      onChange={(e) =>
                        setNewCrop({ ...newCrop, expectedHarvest: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Area (hectares)</label>
                  <Input
                    type="number"
                    placeholder="e.g., 5"
                    value={newCrop.area}
                    onChange={(e) =>
                      setNewCrop({ ...newCrop, area: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Notes</label>
                  <Textarea
                    placeholder="Any additional notes..."
                    value={newCrop.notes}
                    onChange={(e) =>
                      setNewCrop({ ...newCrop, notes: e.target.value })
                    }
                  />
                </div>
                <Button onClick={handleAddCrop} className="w-full">
                  Add Crop
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {aiReport && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              AI Crop Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {aiReport}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search crops or fields..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Crop Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Crops</CardTitle>
            <Sprout className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{crops.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growing</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {crops.filter((c) => c.status === 'growing').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ready to Harvest</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {crops.filter((c) => c.status === 'ready').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Area</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {crops.reduce((sum, c) => sum + c.area, 0)} ha
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Crop List */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredCrops.map((crop) => (
          <Card key={crop.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{crop.name}</CardTitle>
                <Badge variant={getStatusColor(crop.status) as any}>
                  {crop.status.charAt(0).toUpperCase() + crop.status.slice(1)}
                </Badge>
              </div>
              <CardDescription>
                {crop.variety} • {crop.field}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{crop.progress}%</span>
              </div>
              <Progress value={crop.progress} className="h-2" />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Planted</p>
                  <p className="font-medium">
                    {new Date(crop.plantingDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Expected Harvest</p>
                  <p className="font-medium">
                    {new Date(crop.expectedHarvest).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Area</p>
                  <p className="font-medium">{crop.area} hectares</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-medium capitalize">{crop.status}</p>
                </div>
              </div>
              {crop.notes && (
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-sm text-muted-foreground">{crop.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
