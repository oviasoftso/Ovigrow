import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Upload,
  Search,
  AlertTriangle,
  CheckCircle,
  Bug,
  Leaf,
  Shield,
  Camera,
  Loader2,
  ImageIcon,
} from 'lucide-react'

interface Pest {
  id: string
  name: string
  scientificName: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  crop: string
  category: string
  description: string
  treatment: string
  prevention: string
}

const commonPests: Pest[] = [
  {
    id: '1',
    name: 'Fall Armyworm',
    scientificName: 'Spodoptera frugiperda',
    severity: 'critical',
    crop: 'Maize, Sorghum, Millet',
    category: 'Caterpillar',
    description: 'Larvae feed on leaves and bore into stems. Major threat to maize production across Zimbabwe. Can cause 20-70% yield loss if untreated.',
    treatment: 'Apply Bacillus thuringiensis or emamectin benzoate. Use push-pull technology with Napier grass and Desmodium.',
    prevention: 'Early planting, use of resistant varieties (SC 403, SC 529), biological control with Trichogramma wasps.',
  },
  {
    id: '2',
    name: 'Aphids',
    scientificName: 'Aphis spp.',
    severity: 'medium',
    crop: 'Beans, Groundnuts, Vegetables',
    category: 'Sucking Insect',
    description: 'Small sap-sucking insects that weaken plants and spread viral diseases. Common in dry seasons across Mashonaland provinces.',
    treatment: 'Introduce ladybugs, apply neem oil spray (5ml/L), or use reflective mulch to disorient them.',
    prevention: 'Encourage natural predators, maintain field hygiene, avoid excessive nitrogen fertilization.',
  },
  {
    id: '3',
    name: 'Stem Borer',
    scientificName: 'Chilo partellus',
    severity: 'high',
    crop: 'Maize, Sorghum',
    category: 'Caterpillar',
    description: 'Larvae bore into stems causing deadhearts and lodging. A persistent pest in the Lowveld and Middleveld regions.',
    treatment: 'Release Trichogramma wasps (50,000/ha), apply granular insecticide (carbofuran) at whorl stage.',
    prevention: 'Destroy crop residues after harvest, intercrop with silverleaf Desmodium, plant resistant varieties.',
  },
  {
    id: '4',
    name: 'Whitefly',
    scientificName: 'Bemisia tabaci',
    severity: 'medium',
    crop: 'Tomatoes, Beans, Cassava',
    category: 'Sucking Insect',
    description: 'Tiny white insects that transmit viral diseases such as cassava mosaic virus and tomato yellow leaf curl.',
    treatment: 'Use yellow sticky traps (20/ha), apply neem oil, remove and destroy infected plants immediately.',
    prevention: 'Use resistant varieties, practice crop rotation, install fine mesh netting in greenhouses.',
  },
  {
    id: '5',
    name: 'Termites',
    scientificName: 'Macrotermes spp.',
    severity: 'medium',
    crop: 'Multiple crops',
    category: 'Social Insect',
    description: 'Attack roots and stems, especially in dry conditions. Can devastate newly planted fields in sandy soils common in Masvingo and Matabeleland.',
    treatment: 'Apply chlorpyrifos granules around affected plants. Use bait stations with diflubenzuron near mounds.',
    prevention: 'Maintain soil moisture with mulching, remove old mounds before ploughing, use resistant varieties.',
  },
  {
    id: '6',
    name: 'Cutworm',
    scientificName: 'Agrotis spp.',
    severity: 'low',
    crop: 'Seedlings (all types)',
    category: 'Caterpillar',
    description: 'Larvae cut seedlings at the base at night. Most problematic during early planting season (October-November).',
    treatment: 'Apply insecticide baits (chlorpyrifos + bran) around seedlings in the evening.',
    prevention: 'Use collar barriers around seedlings, plough fields early to expose larvae to predators, firm soil around transplants.',
  },
  {
    id: '7',
    name: 'Red Spider Mite',
    scientificName: 'Tetranychus urticae',
    severity: 'medium',
    crop: 'Tomatoes, Tea, Citrus',
    category: 'Mite',
    description: 'Tiny mites feeding on leaf undersides, causing stippling and bronzing. Thrives in hot, dry conditions of the Lowveld.',
    treatment: 'Apply abamectin or spiromesifen. Use overhead irrigation to dislodge mites.',
    prevention: 'Avoid water stress, encourage predatory mites (Phytoseiulus persimilis), reduce dust on leaves.',
  },
  {
    id: '8',
    name: 'Bollworm',
    scientificName: 'Helicoverpa armigera',
    severity: 'high',
    crop: 'Cotton, Tomatoes',
    category: 'Caterpillar',
    description: 'Polyphagous pest feeding on flowers, buds, and fruits. Major pest of the cotton belt in Gokwe and Sanyati.',
    treatment: 'Apply indoxacarb or chlorantraniliprole. Use Bt-based biopesticides for organic control.',
    prevention: 'Use pheromone traps (5/ha), plant trap crops like sunflower, practice crop rotation with non-host crops.',
  },
]

type DetectionState = 'idle' | 'analyzing' | 'complete'

export default function PestDetection() {
  const [detectionState, setDetectionState] = useState<DetectionState>('idle')
  const [progress, setProgress] = useState(0)
  const [detectedPest, setDetectedPest] = useState<Pest | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [symptomNotes, setSymptomNotes] = useState('')
  const [selectedPest, setSelectedPest] = useState<Pest | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredPests = commonPests.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const simulateDetection = () => {
    setDetectionState('analyzing')
    setDetectedPest(null)
    setProgress(0)
    let p = 0
    const interval = setInterval(() => {
      p += Math.random() * 18 + 5
      if (p >= 100) {
        p = 100
        clearInterval(interval)
        setDetectedPest(commonPests[Math.floor(Math.random() * commonPests.length)])
        setDetectionState('complete')
      }
      setProgress(p)
    }, 250)
  }

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case 'low': return 'secondary' as const
      case 'medium': return 'warning' as const
      case 'high': return 'destructive' as const
      case 'critical': return 'destructive' as const
      default: return 'secondary' as const
    }
  }

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-600 dark:bg-green-900/20'
      case 'medium': return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20'
      case 'high': return 'bg-orange-100 text-orange-600 dark:bg-orange-900/20'
      case 'critical': return 'bg-red-100 text-red-600 dark:bg-red-900/20'
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-900/20'
    }
  }

  const scanHistory = [
    { id: 1, date: 'Today, 10:30 AM', crop: 'Maize - Field A', result: 'Fall Armyworm detected', severity: 'critical' as const },
    { id: 2, date: 'Today, 9:15 AM', crop: 'Tomatoes - Greenhouse', result: 'No pests detected', severity: 'low' as const },
    { id: 3, date: 'Yesterday, 4:00 PM', crop: 'Beans - Field B', result: 'No pests detected', severity: 'low' as const },
    { id: 4, date: '2 days ago', crop: 'Cotton - Field D', result: 'Aphids - low level', severity: 'medium' as const },
    { id: 5, date: '3 days ago', crop: 'Maize - Field C', result: 'Stem borer signs found', severity: 'high' as const },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pest Detection</h1>
        <p className="text-muted-foreground">
          AI-powered pest identification and treatment recommendations for Zimbabwean farms
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scans Today</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">2 healthy, 1 alert</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Threats Found</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">1</div>
            <p className="text-xs text-muted-foreground">Requires immediate action</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Known Pests</CardTitle>
            <Bug className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{commonPests.length}</div>
            <p className="text-xs text-muted-foreground">In Zimbabwe database</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Detection Accuracy</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">96.2%</div>
            <p className="text-xs text-muted-foreground">AI model confidence</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="detect" className="space-y-4">
        <TabsList>
          <TabsTrigger value="detect">Detect Pest</TabsTrigger>
          <TabsTrigger value="gallery">Common Pests</TabsTrigger>
          <TabsTrigger value="history">Scan History</TabsTrigger>
        </TabsList>

        <TabsContent value="detect" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Upload Card */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Image for AI Analysis</CardTitle>
                <CardDescription>
                  Take a clear photo of the affected plant part for identification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={simulateDetection}
                />

                {detectionState === 'idle' ? (
                  <div
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-sm font-medium">Click to upload or drag image</p>
                    <p className="text-xs text-muted-foreground">Supports JPG, PNG, WebP up to 10MB</p>
                  </div>
                ) : detectionState === 'analyzing' ? (
                  <div className="space-y-6 p-8 text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                    <div className="space-y-2">
                      <p className="font-medium text-lg">Analyzing image with AI...</p>
                      <p className="text-sm text-muted-foreground">
                        Identifying pest species and assessing damage level
                      </p>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <p className="text-sm text-muted-foreground">{Math.round(progress)}% complete</p>
                  </div>
                ) : null}

                <div className="space-y-2">
                  <label className="text-sm font-medium">Describe symptoms (optional)</label>
                  <Textarea
                    placeholder="e.g., Holes in leaves, wilting, discoloration, larvae visible..."
                    value={symptomNotes}
                    onChange={(e) => setSymptomNotes(e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={simulateDetection}
                    className="flex-1"
                    disabled={detectionState === 'analyzing'}
                  >
                    {detectionState === 'analyzing' ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Analyze with AI
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={simulateDetection} disabled={detectionState === 'analyzing'}>
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Result Card */}
            <Card>
              <CardHeader>
                <CardTitle>Detection Result</CardTitle>
                <CardDescription>AI analysis of the uploaded image</CardDescription>
              </CardHeader>
              <CardContent>
                {detectionState === 'analyzing' ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" />
                    <p className="text-sm text-muted-foreground">Processing with OviGrow AI...</p>
                  </div>
                ) : detectedPest ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-full p-3 ${getSeverityBg(detectedPest.severity)}`}>
                        <Bug className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{detectedPest.name}</h3>
                        <p className="text-xs text-muted-foreground italic">{detectedPest.scientificName}</p>
                      </div>
                      <Badge variant={getSeverityVariant(detectedPest.severity)}>
                        {detectedPest.severity} severity
                      </Badge>
                    </div>
                    <div className="rounded-lg bg-muted p-4 space-y-2">
                      <p className="text-sm"><strong>Affected Crop:</strong> {detectedPest.crop}</p>
                      <p className="text-sm">{detectedPest.description}</p>
                    </div>
                    <div className="rounded-lg border p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-green-600" />
                        <h4 className="font-semibold">Treatment Recommendation</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{detectedPest.treatment}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm">Apply Treatment Plan</Button>
                      <Button variant="outline" size="sm">Share with Agronomist</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Leaf className="h-12 w-12 mb-4" />
                    <p className="text-sm">Upload an image to get AI pest analysis</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="gallery" className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search pests by name, crop, or category..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPests.map((pest) => (
              <Card
                key={pest.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedPest(pest)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`rounded-full p-2 ${getSeverityBg(pest.severity)}`}>
                      <Bug className="h-5 w-5" />
                    </div>
                    <Badge variant={getSeverityVariant(pest.severity)}>
                      {pest.severity}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{pest.name}</CardTitle>
                  <CardDescription className="italic text-xs">
                    {pest.scientificName}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Badge variant="outline">{pest.category}</Badge>
                  <p className="text-xs text-muted-foreground">Affects: {pest.crop}</p>
                  <p className="text-sm line-clamp-2">{pest.description}</p>
                  <div className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                    <span className="text-muted-foreground line-clamp-2">{pest.treatment}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detail overlay */}
          {selectedPest && (
            <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
              <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Bug className="h-5 w-5 text-red-600" />
                        {selectedPest.name}
                      </CardTitle>
                      <CardDescription className="italic">{selectedPest.scientificName}</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedPest(null)}>
                      Close
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Badge variant={getSeverityVariant(selectedPest.severity)}>
                      {selectedPest.severity} severity
                    </Badge>
                    <Badge variant="outline">{selectedPest.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedPest.description}</p>
                  <div>
                    <h4 className="font-medium mb-1">Affected Crops</h4>
                    <p className="text-sm text-muted-foreground">{selectedPest.crop}</p>
                  </div>
                  <div className="rounded-lg border p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      <h4 className="font-medium">Treatment</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedPest.treatment}</p>
                  </div>
                  <div className="rounded-lg border p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-blue-600" />
                      <h4 className="font-medium">Prevention</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedPest.prevention}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Scans</CardTitle>
              <CardDescription>History of pest detection scans on your farm</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {scanHistory.map((scan) => (
                  <div
                    key={scan.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`rounded-full p-2 ${getSeverityBg(scan.severity)}`}>
                        {scan.severity === 'low' ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <AlertTriangle className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{scan.crop}</p>
                        <p className="text-xs text-muted-foreground">{scan.result}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{scan.date}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
