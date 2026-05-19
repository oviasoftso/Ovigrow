import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Droplets, Leaf, Zap, TestTube } from 'lucide-react'

interface SoilTest {
  id: string
  fieldName: string
  ph: number
  nitrogen: number
  phosphorus: number
  potassium: number
  moisture: number
  organicMatter: number
  testDate: string
  notes: string
}

const initialTests: SoilTest[] = [
  {
    id: '1',
    fieldName: 'Field A - North',
    ph: 6.5,
    nitrogen: 45,
    phosphorus: 32,
    potassium: 28,
    moisture: 65,
    organicMatter: 3.2,
    testDate: '2024-12-15',
    notes: 'Good overall fertility, may need lime application',
  },
  {
    id: '2',
    fieldName: 'Field B - East',
    ph: 5.8,
    nitrogen: 38,
    phosphorus: 25,
    potassium: 22,
    moisture: 58,
    organicMatter: 2.8,
    testDate: '2024-12-10',
    notes: 'Low pH, recommend lime at 2 tons/ha',
  },
  {
    id: '3',
    fieldName: 'Field C - South',
    ph: 7.2,
    nitrogen: 52,
    phosphorus: 40,
    potassium: 35,
    moisture: 72,
    organicMatter: 4.1,
    testDate: '2024-12-01',
    notes: 'Excellent fertility, optimal for most crops',
  },
]

export default function SoilAnalysis() {
  const [tests, setTests] = useState<SoilTest[]>(initialTests)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newTest, setNewTest] = useState({
    fieldName: '',
    ph: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    moisture: '',
    organicMatter: '',
    notes: '',
  })

  const getPhStatus = (ph: number) => {
    if (ph < 5.5) return { label: 'Acidic', variant: 'destructive' as const }
    if (ph < 6.5) return { label: 'Slightly Acidic', variant: 'warning' as const }
    if (ph < 7.5) return { label: 'Neutral', variant: 'success' as const }
    return { label: 'Alkaline', variant: 'secondary' as const }
  }

  const getNutrientLevel = (value: number) => {
    if (value < 20) return { label: 'Low', color: 'text-red-600' }
    if (value < 40) return { label: 'Medium', color: 'text-yellow-600' }
    return { label: 'High', color: 'text-green-600' }
  }

  const handleAddTest = () => {
    const test: SoilTest = {
      id: Date.now().toString(),
      fieldName: newTest.fieldName,
      ph: parseFloat(newTest.ph),
      nitrogen: parseFloat(newTest.nitrogen),
      phosphorus: parseFloat(newTest.phosphorus),
      potassium: parseFloat(newTest.potassium),
      moisture: parseFloat(newTest.moisture),
      organicMatter: parseFloat(newTest.organicMatter),
      testDate: new Date().toISOString().split('T')[0],
      notes: newTest.notes,
    }
    setTests([test, ...tests])
    setNewTest({
      fieldName: '',
      ph: '',
      nitrogen: '',
      phosphorus: '',
      potassium: '',
      moisture: '',
      organicMatter: '',
      notes: '',
    })
    setIsAddDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Soil Analysis</h1>
          <p className="text-muted-foreground">
            Monitor soil health and nutrient levels across your fields
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Soil Test
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Soil Test Results</DialogTitle>
              <DialogDescription>
                Record new soil test results for your field
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Field Name</label>
                <Input
                  placeholder="e.g., Field A - North"
                  value={newTest.fieldName}
                  onChange={(e) =>
                    setNewTest({ ...newTest, fieldName: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">pH Level</label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="6.5"
                    value={newTest.ph}
                    onChange={(e) =>
                      setNewTest({ ...newTest, ph: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nitrogen (ppm)</label>
                  <Input
                    type="number"
                    placeholder="45"
                    value={newTest.nitrogen}
                    onChange={(e) =>
                      setNewTest({ ...newTest, nitrogen: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phosphorus (ppm)</label>
                  <Input
                    type="number"
                    placeholder="32"
                    value={newTest.phosphorus}
                    onChange={(e) =>
                      setNewTest({ ...newTest, phosphorus: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Potassium (ppm)</label>
                  <Input
                    type="number"
                    placeholder="28"
                    value={newTest.potassium}
                    onChange={(e) =>
                      setNewTest({ ...newTest, potassium: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Moisture (%)</label>
                  <Input
                    type="number"
                    placeholder="65"
                    value={newTest.moisture}
                    onChange={(e) =>
                      setNewTest({ ...newTest, moisture: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Organic Matter (%)</label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="3.2"
                    value={newTest.organicMatter}
                    onChange={(e) =>
                      setNewTest({ ...newTest, organicMatter: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <Textarea
                  placeholder="Any observations or recommendations..."
                  value={newTest.notes}
                  onChange={(e) =>
                    setNewTest({ ...newTest, notes: e.target.value })
                  }
                />
              </div>
              <Button onClick={handleAddTest} className="w-full">
                Save Test Results
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Soil Health Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fields Tested</CardTitle>
            <TestTube className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tests.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg pH</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(tests.reduce((sum, t) => sum + t.ph, 0) / tests.length).toFixed(1)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Nitrogen</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(tests.reduce((sum, t) => sum + t.nitrogen, 0) / tests.length)} ppm
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Organic Matter</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(tests.reduce((sum, t) => sum + t.organicMatter, 0) / tests.length).toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Soil Test Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tests.map((test) => {
          const phStatus = getPhStatus(test.ph)
          return (
            <Card key={test.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{test.fieldName}</CardTitle>
                  <Badge variant={phStatus.variant}>{phStatus.label}</Badge>
                </div>
                <CardDescription>
                  Tested: {new Date(test.testDate).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold">{test.ph}</div>
                  <p className="text-sm text-muted-foreground">pH Level</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Nitrogen</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${getNutrientLevel(test.nitrogen).color}`}>
                        {test.nitrogen} ppm
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {getNutrientLevel(test.nitrogen).label}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={test.nitrogen} className="h-2" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Phosphorus</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${getNutrientLevel(test.phosphorus).color}`}>
                        {test.phosphorus} ppm
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {getNutrientLevel(test.phosphorus).label}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={test.phosphorus} className="h-2" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Potassium</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${getNutrientLevel(test.potassium).color}`}>
                        {test.potassium} ppm
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {getNutrientLevel(test.potassium).label}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={test.potassium} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="text-center">
                    <div className="text-lg font-semibold">{test.moisture}%</div>
                    <p className="text-xs text-muted-foreground">Moisture</p>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{test.organicMatter}%</div>
                    <p className="text-xs text-muted-foreground">Organic Matter</p>
                  </div>
                </div>
                {test.notes && (
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-sm text-muted-foreground">{test.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
