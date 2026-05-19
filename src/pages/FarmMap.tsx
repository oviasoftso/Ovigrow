import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
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
import { MapPin, Layers, Plus, Sprout, Droplets, Eye, Maximize2 } from 'lucide-react'

interface Field {
  id: string
  name: string
  crop: string
  area: number
  lat: number
  lng: number
  status: 'planted' | 'growing' | 'ready' | 'fallow'
  soilType: string
  lastTested: string
  color: string
}

interface MapMarker {
  id: string
  lat: number
  lng: number
  type: 'field' | 'soil_test' | 'water' | 'building'
  label: string
}

const fields: Field[] = [
  {
    id: '1',
    name: 'Field A - North',
    crop: 'Maize (SC 403)',
    area: 5,
    lat: -19.0154,
    lng: 29.1549,
    status: 'growing',
    soilType: 'Red clay loam',
    lastTested: '2024-12-15',
    color: '#22c55e',
  },
  {
    id: '2',
    name: 'Field B - East',
    crop: 'Wheat (PAN 3195)',
    area: 8,
    lat: -19.018,
    lng: 29.16,
    status: 'growing',
    soilType: 'Sandy loam',
    lastTested: '2024-12-10',
    color: '#3b82f6',
  },
  {
    id: '3',
    name: 'Field C - South',
    crop: 'Soybeans (Irene)',
    area: 3,
    lat: -19.022,
    lng: 29.155,
    status: 'planted',
    soilType: 'Red laterite',
    lastTested: '2024-12-01',
    color: '#f59e0b',
  },
  {
    id: '4',
    name: 'Field D - West',
    crop: 'Tobacco (Virginia Gold)',
    area: 2,
    lat: -19.013,
    lng: 29.148,
    status: 'ready',
    soilType: 'Dark vertisol',
    lastTested: '2024-11-20',
    color: '#ef4444',
  },
  {
    id: '5',
    name: 'Field E - Central',
    crop: 'Sugar Beans',
    area: 4,
    lat: -19.019,
    lng: 29.152,
    status: 'fallow',
    soilType: 'Sandy clay',
    lastTested: '2024-10-15',
    color: '#8b5cf6',
  },
]

const mapMarkers: MapMarker[] = [
  { id: 'm1', lat: -19.0154, lng: 29.1549, type: 'field', label: 'Field A' },
  { id: 'm2', lat: -19.018, lng: 29.16, type: 'field', label: 'Field B' },
  { id: 'm3', lat: -19.022, lng: 29.155, type: 'field', label: 'Field C' },
  { id: 'm4', lat: -19.013, lng: 29.148, type: 'field', label: 'Field D' },
  { id: 'm5', lat: -19.019, lng: 29.152, type: 'field', label: 'Field E' },
  { id: 's1', lat: -19.016, lng: 29.156, type: 'soil_test', label: 'Soil Test Point 1' },
  { id: 's2', lat: -19.02, lng: 29.153, type: 'soil_test', label: 'Soil Test Point 2' },
  { id: 'w1', lat: -19.017, lng: 29.15, type: 'water', label: 'Borehole' },
  { id: 'w2', lat: -19.021, lng: 29.158, type: 'water', label: 'Dam' },
  { id: 'b1', lat: -19.014, lng: 29.152, type: 'building', label: 'Farm House' },
  { id: 'b2', lat: -19.016, lng: 29.149, type: 'building', label: 'Storage Shed' },
]

export default function FarmMap() {
  const [selectedField, setSelectedField] = useState<Field | null>(null)
  const [mapLayer, setMapLayer] = useState<'satellite' | 'terrain' | 'hybrid'>('satellite')
  const [showLayers, setShowLayers] = useState({
    fields: true,
    soilTests: true,
    water: true,
    buildings: true,
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planted': return 'secondary' as const
      case 'growing': return 'default' as const
      case 'ready': return 'success' as const
      case 'fallow': return 'outline' as const
      default: return 'secondary' as const
    }
  }

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'field': return <Sprout className="h-4 w-4" />
      case 'soil_test': return <Layers className="h-4 w-4" />
      case 'water': return <Droplets className="h-4 w-4" />
      case 'building': return <MapPin className="h-4 w-4" />
      default: return <MapPin className="h-4 w-4" />
    }
  }

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'field': return 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-400'
      case 'soil_test': return 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400'
      case 'water': return 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400'
      case 'building': return 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-900/30 dark:text-gray-400'
      default: return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const filteredMarkers = mapMarkers.filter((m) => {
    if (m.type === 'field') return showLayers.fields
    if (m.type === 'soil_test') return showLayers.soilTests
    if (m.type === 'water') return showLayers.water
    if (m.type === 'building') return showLayers.buildings
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Farm Map</h1>
          <p className="text-muted-foreground">
            Interactive map of your farm fields and infrastructure
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Field
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Field</DialogTitle>
              <DialogDescription>Define a new field boundary on your farm map</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Field Name</label>
                <Input placeholder="e.g., Field F - River" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Crop</label>
                  <Input placeholder="e.g., Maize" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Area (ha)</label>
                  <Input type="number" placeholder="e.g., 5" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Latitude</label>
                  <Input type="number" step="0.0001" placeholder="-19.0154" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Longitude</label>
                  <Input type="number" step="0.0001" placeholder="29.1549" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Soil Type</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select soil type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="red-clay">Red clay loam</SelectItem>
                    <SelectItem value="sandy-loam">Sandy loam</SelectItem>
                    <SelectItem value="red-laterite">Red laterite</SelectItem>
                    <SelectItem value="dark-vertisol">Dark vertisol</SelectItem>
                    <SelectItem value="sandy-clay">Sandy clay</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full">Save Field</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fields</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fields.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Area</CardTitle>
            <Sprout className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fields.reduce((s, f) => s + f.area, 0)} ha</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Crops</CardTitle>
            <Sprout className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fields.filter((f) => f.status !== 'fallow').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Water Sources</CardTitle>
            <Droplets className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mapMarkers.filter((m) => m.type === 'water').length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        {/* Map Display */}
        <div className="lg:col-span-3">
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div>
                <CardTitle className="text-lg">Farm Overview</CardTitle>
                <CardDescription>
                  Center: -19.0154, 29.1549 (Zimbabwe)
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Select value={mapLayer} onValueChange={(v) => setMapLayer(v as typeof mapLayer)}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="satellite">Satellite</SelectItem>
                    <SelectItem value="terrain">Terrain</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {/* Simulated map container */}
              <div
                className="relative w-full h-[500px] bg-gradient-to-br from-green-100 via-green-50 to-amber-50 dark:from-green-950/40 dark:via-green-900/20 dark:to-amber-950/20 overflow-hidden"
                style={{ minHeight: '500px' }}
              >
                {/* Grid lines for map effect */}
                <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                      <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>

                {/* Field boundaries (simulated polygon areas) */}
                {showLayers.fields && fields.map((field) => {
                  const x = ((field.lng - 29.14) / 0.03) * 100
                  const y = ((field.lat - (-19.025)) / 0.02) * 100
                  return (
                    <div
                      key={field.id}
                      className="absolute cursor-pointer transition-transform hover:scale-105"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      onClick={() => setSelectedField(field)}
                    >
                      <div
                        className="border-2 rounded-lg px-3 py-2 text-xs font-medium shadow-md backdrop-blur-sm"
                        style={{
                          borderColor: field.color,
                          backgroundColor: `${field.color}20`,
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <Sprout className="h-3 w-3" style={{ color: field.color }} />
                          <span>{field.name}</span>
                        </div>
                        <span className="text-muted-foreground">{field.crop}</span>
                      </div>
                    </div>
                  )
                })}

                {/* Markers */}
                {filteredMarkers.filter((m) => m.type !== 'field').map((marker) => {
                  const x = ((marker.lng - 29.14) / 0.03) * 100
                  const y = ((marker.lat - (-19.025)) / 0.02) * 100
                  return (
                    <div
                      key={marker.id}
                      className="absolute cursor-pointer"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      title={marker.label}
                    >
                      <div className={`rounded-full p-1.5 border shadow-sm ${getMarkerColor(marker.type)}`}>
                        {getMarkerIcon(marker.type)}
                      </div>
                    </div>
                  )
                })}

                {/* Map attribution */}
                <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
                  OviGrow Farm Map | Lat: -19.0154, Lng: 29.1549
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Layer Controls */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Map Layers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { key: 'fields', label: 'Field Boundaries', color: 'text-green-600' },
                { key: 'soilTests', label: 'Soil Test Points', color: 'text-amber-600' },
                { key: 'water', label: 'Water Sources', color: 'text-blue-600' },
                { key: 'buildings', label: 'Buildings', color: 'text-gray-600' },
              ].map((layer) => (
                <label
                  key={layer.key}
                  className="flex items-center gap-2 cursor-pointer text-sm"
                >
                  <input
                    type="checkbox"
                    checked={showLayers[layer.key as keyof typeof showLayers]}
                    onChange={(e) =>
                      setShowLayers({ ...showLayers, [layer.key]: e.target.checked })
                    }
                    className="rounded"
                  />
                  <span className={layer.color}>{layer.label}</span>
                </label>
              ))}
            </CardContent>
          </Card>

          {/* Fields List */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Fields</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {fields.map((field) => (
                <div
                  key={field.id}
                  className="flex items-center justify-between rounded-lg border p-2 cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => setSelectedField(field)}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: field.color }}
                    />
                    <div>
                      <p className="text-xs font-medium">{field.name}</p>
                      <p className="text-xs text-muted-foreground">{field.area} ha</p>
                    </div>
                  </div>
                  <Badge variant={getStatusColor(field.status)} className="text-xs">
                    {field.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Field Detail Dialog */}
      {selectedField && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="h-4 w-4 rounded-full"
                    style={{ backgroundColor: selectedField.color }}
                  />
                  <CardTitle>{selectedField.name}</CardTitle>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedField(null)}>
                  Close
                </Button>
              </div>
              <CardDescription>{selectedField.crop}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Area</p>
                  <p className="text-sm font-medium">{selectedField.area} hectares</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge variant={getStatusColor(selectedField.status)}>
                    {selectedField.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Soil Type</p>
                  <p className="text-sm font-medium">{selectedField.soilType}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Last Tested</p>
                  <p className="text-sm font-medium">{new Date(selectedField.lastTested).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Coordinates</p>
                <p className="text-sm font-medium">{selectedField.lat.toFixed(4)}, {selectedField.lng.toFixed(4)}</p>
              </div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" className="flex-1">View Details</Button>
                <Button variant="outline" size="sm" className="flex-1">Edit Field</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
