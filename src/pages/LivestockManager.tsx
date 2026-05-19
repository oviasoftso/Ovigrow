import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Beef, Heart, Syringe, Calendar, Search, AlertTriangle, CheckCircle } from 'lucide-react'

interface Animal {
  id: string
  type: string
  breed: string
  count: number
  healthStatus: 'healthy' | 'sick' | 'treatment'
  lastVaccination: string
  nextVaccination: string
  feedingSchedule: string
  notes: string
}

const initialAnimals: Animal[] = [
  { id: '1', type: 'Cattle', breed: 'Brahman', count: 24, healthStatus: 'healthy', lastVaccination: '2024-11-15', nextVaccination: '2025-05-15', feedingSchedule: 'Morning: Silage + Hay, Evening: Supplement', notes: 'Main breeding herd, 8 cows due to calve in March' },
  { id: '2', type: 'Cattle', breed: 'Hereford', count: 12, healthStatus: 'healthy', lastVaccination: '2024-11-15', nextVaccination: '2025-05-15', feedingSchedule: 'Morning: Silage, Evening: Hay + Mineral lick', notes: 'Fattening group, ready for market in 2 months' },
  { id: '3', type: 'Goats', breed: 'Boer', count: 35, healthStatus: 'sick', lastVaccination: '2024-12-01', nextVaccination: '2025-06-01', feedingSchedule: 'Browse + Supplement morning', notes: '3 goats showing signs of pneumonia, under treatment' },
  { id: '4', type: 'Poultry', breed: 'Broiler', count: 500, healthStatus: 'healthy', lastVaccination: '2025-01-10', nextVaccination: '2025-02-10', feedingSchedule: 'Broiler starter mash, 3x daily', notes: 'Batch 12, 4 weeks old, target weight in 3 weeks' },
  { id: '5', type: 'Pigs', breed: 'Large White', count: 15, healthStatus: 'treatment', lastVaccination: '2024-12-20', nextVaccination: '2025-06-20', feedingSchedule: 'Pig grower mash, 2x daily', notes: '2 pigs on antibiotics for skin infection' },
  { id: '6', type: 'Goats', breed: 'Mashona', count: 20, healthStatus: 'healthy', lastVaccination: '2024-12-01', nextVaccination: '2025-06-01', feedingSchedule: 'Free range browse + mineral supplement', notes: 'Indigenous herd, good for crossbreeding program' },
]

const upcomingEvents = [
  { id: 1, event: 'Cattle vaccination (LSD)', date: '2025-05-15', type: 'vaccination', animals: 'All cattle' },
  { id: 2, event: 'Broiler batch ready for market', date: '2025-02-07', type: 'harvest', animals: '500 broilers' },
  { id: 3, event: 'Goat deworming', date: '2025-02-01', type: 'treatment', animals: 'All goats' },
  { id: 4, event: 'Cattle pregnancy check', date: '2025-02-15', type: 'health', animals: '8 breeding cows' },
]

export default function LivestockManager() {
  const [animals, setAnimals] = useState<Animal[]>(initialAnimals)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newAnimal, setNewAnimal] = useState<{ type: string; breed: string; count: string; healthStatus: 'healthy' | 'sick' | 'treatment'; notes: string; feedingSchedule: string }>({ type: '', breed: '', count: '', healthStatus: 'healthy', notes: '', feedingSchedule: '' })

  const filtered = animals.filter(a => a.type.toLowerCase().includes(searchTerm.toLowerCase()) || a.breed.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleAdd = () => {
    if (!newAnimal.type || !newAnimal.count) return
    setAnimals([{ id: Date.now().toString(), ...newAnimal, count: parseInt(newAnimal.count), lastVaccination: '', nextVaccination: '', feedingSchedule: newAnimal.feedingSchedule || 'To be set', notes: newAnimal.notes }, ...animals])
    setNewAnimal({ type: '', breed: '', count: '', healthStatus: 'healthy', notes: '', feedingSchedule: '' })
    setIsAddOpen(false)
  }

  const totalAnimals = animals.reduce((s, a) => s + a.count, 0)
  const healthyCount = animals.filter(a => a.healthStatus === 'healthy').reduce((s, a) => s + a.count, 0)
  const sickCount = animals.filter(a => a.healthStatus === 'sick').reduce((s, a) => s + a.count, 0)

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-600 dark:bg-green-900/20'
      case 'sick': return 'bg-red-100 text-red-600 dark:bg-red-900/20'
      case 'treatment': return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Livestock Manager</h1>
          <p className="text-muted-foreground">Track herds, health, vaccinations, and feeding schedules</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Add Livestock</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Livestock</DialogTitle><DialogDescription>Register a new herd or flock</DialogDescription></DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><label className="text-sm font-medium">Animal Type</label>
                  <Select value={newAnimal.type} onValueChange={(v) => setNewAnimal({ ...newAnimal, type: v })}>
                    <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent>{['Cattle', 'Goats', 'Sheep', 'Poultry', 'Pigs', 'Donkeys'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><label className="text-sm font-medium">Breed</label><Input placeholder="e.g., Brahman" value={newAnimal.breed} onChange={(e) => setNewAnimal({ ...newAnimal, breed: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><label className="text-sm font-medium">Count</label><Input type="number" placeholder="0" value={newAnimal.count} onChange={(e) => setNewAnimal({ ...newAnimal, count: e.target.value })} /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Health Status</label>
                  <Select value={newAnimal.healthStatus} onValueChange={(v) => setNewAnimal({ ...newAnimal, healthStatus: v as 'healthy' | 'sick' | 'treatment' })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="healthy">Healthy</SelectItem><SelectItem value="sick">Sick</SelectItem><SelectItem value="treatment">Under Treatment</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2"><label className="text-sm font-medium">Feeding Schedule</label><Input placeholder="e.g., Morning silage, evening hay" value={newAnimal.feedingSchedule} onChange={(e) => setNewAnimal({ ...newAnimal, feedingSchedule: e.target.value })} /></div>
              <div className="space-y-2"><label className="text-sm font-medium">Notes</label><Textarea placeholder="Additional notes..." value={newAnimal.notes} onChange={(e) => setNewAnimal({ ...newAnimal, notes: e.target.value })} /></div>
              <Button onClick={handleAdd} className="w-full">Add Livestock</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Animals</CardTitle><Beef className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{totalAnimals.toLocaleString()}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Healthy</CardTitle><CheckCircle className="h-4 w-4 text-green-600" /></CardHeader><CardContent><div className="text-2xl font-bold text-green-600">{healthyCount}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Sick</CardTitle><AlertTriangle className="h-4 w-4 text-red-600" /></CardHeader><CardContent><div className="text-2xl font-bold text-red-600">{sickCount}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Herds</CardTitle><Beef className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{animals.length}</div></CardContent></Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search by type or breed..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((animal) => (
          <Card key={animal.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{animal.type}</CardTitle>
                <Badge className={getHealthColor(animal.healthStatus)}>{animal.healthStatus.charAt(0).toUpperCase() + animal.healthStatus.slice(1)}</Badge>
              </div>
              <CardDescription>{animal.breed} • {animal.count} animals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-muted-foreground">Last Vaccination</p><p className="font-medium flex items-center gap-1"><Syringe className="h-3 w-3" />{animal.lastVaccination ? new Date(animal.lastVaccination).toLocaleDateString() : 'N/A'}</p></div>
                <div><p className="text-muted-foreground">Next Vaccination</p><p className="font-medium flex items-center gap-1"><Calendar className="h-3 w-3" />{animal.nextVaccination ? new Date(animal.nextVaccination).toLocaleDateString() : 'N/A'}</p></div>
              </div>
              <div><p className="text-sm text-muted-foreground">Feeding</p><p className="text-sm">{animal.feedingSchedule}</p></div>
              {animal.notes && <div className="rounded-lg bg-muted p-3"><p className="text-sm text-muted-foreground">{animal.notes}</p></div>}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Upcoming Events</CardTitle><CardDescription>Scheduled livestock activities</CardDescription></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center gap-4 rounded-lg border p-4">
                <div className={`rounded-full p-2 ${event.type === 'vaccination' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20' : event.type === 'harvest' ? 'bg-green-100 text-green-600 dark:bg-green-900/20' : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20'}`}>
                  {event.type === 'vaccination' ? <Syringe className="h-4 w-4" /> : event.type === 'harvest' ? <CheckCircle className="h-4 w-4" /> : <Heart className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{event.event}</p>
                  <p className="text-sm text-muted-foreground">{event.animals}</p>
                </div>
                <Badge variant="outline">{new Date(event.date).toLocaleDateString()}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
