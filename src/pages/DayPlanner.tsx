import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CalendarCheck,
  Sparkles,
  Plus,
  Clock,
  CheckCircle2,
  Circle,
  ChevronRight,
  AlertCircle,
  CloudSun,
  Droplets,
  Sprout,
  MoreVertical,
  Trash2,
  Calendar as CalendarIcon,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'react-hot-toast'
import { streamChatCompletion, type ChatMessage } from '@/lib/openrouter'
import { useStore } from '@/lib/store'

interface Task {
  id: string
  time: string
  title: string
  description: string
  category: 'irrigation' | 'planting' | 'maintenance' | 'harvest' | 'general'
  completed: boolean
  isAI?: boolean
  sortTime: number // minutes from midnight
}

const parseTimeToMinutes = (timeStr: string): number => {
  try {
    const [time, modifier] = timeStr.split(' ')
    let [hours, minutes] = time.split(':').map(Number)
    if (hours === 12) hours = 0
    if (modifier === 'PM') hours += 12
    return hours * 60 + minutes
  } catch {
    return 0
  }
}

const initialTasks: Task[] = [
  {
    id: '1',
    time: '06:00 AM',
    title: 'Morning Crop Inspection',
    description: 'Check Field A for early signs of pest activity.',
    category: 'general',
    completed: true,
    sortTime: parseTimeToMinutes('06:00 AM')
  },
  {
    id: '2',
    time: '08:30 AM',
    title: 'Irrigation System Check',
    description: 'Ensure all valves are functioning in the South block.',
    category: 'irrigation',
    completed: false,
    sortTime: parseTimeToMinutes('08:30 AM')
  }
]

const categoryStyles = {
  irrigation: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  planting: 'bg-green-500/10 text-green-600 border-green-500/20',
  maintenance: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  harvest: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  general: 'bg-slate-500/10 text-slate-600 border-slate-500/20'
}

const SYSTEM_PROMPT = `You are OviGrow AI, an expert agricultural planner for Zimbabwe.
Generate a list of 3-5 specific farming tasks for today based on the provided context (weather, crops, location).
Output MUST be a JSON array of objects with this structure:
[
  {
    "time": "HH:MM AM/PM",
    "title": "Short task title",
    "description": "Specific action-oriented description",
    "category": "irrigation" | "planting" | "maintenance" | "harvest" | "general"
  }
]
Only output the JSON array, nothing else.`

export default function DayPlanner() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const { user, selectedModel } = useStore()

  const [newTask, setNewTask] = useState({
    title: '',
    time: '08:00 AM',
    description: '',
    category: 'general' as Task['category']
  })

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  const handleAddTask = () => {
    if (!newTask.title) return
    const task: Task = {
      id: Date.now().toString(),
      ...newTask,
      completed: false,
      sortTime: parseTimeToMinutes(newTask.time)
    }
    const updatedTasks = [...tasks, task].sort((a, b) => a.sortTime - b.sortTime)
    setTasks(updatedTasks)
    setNewTask({ title: '', time: '08:00 AM', description: '', category: 'general' })
    setIsAddOpen(false)
    toast.success('Task added to your schedule')
  }

  const handleSmartGenerate = async () => {
    setIsGenerating(true)

    const context = `
      Location: ${user?.location || 'Zimbabwe'}
      User Name: ${user?.full_name || 'Farmer'}
      Crops: Maize, Wheat (simulated)
      Weather: High rain probability (85%) starting at 2:00 PM.
    `

    const messages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Generate tasks for today. Context: ${context}` }
    ]

    let aiResponse = ''
    try {
      await streamChatCompletion(
        {
          model: selectedModel,
          messages,
          temperature: 0.7,
        },
        (chunk) => {
          aiResponse += chunk
        },
        () => {
          try {
            // Find JSON array in response if AI added text
            const jsonStart = aiResponse.indexOf('[')
            const jsonEnd = aiResponse.lastIndexOf(']') + 1
            const jsonStr = aiResponse.substring(jsonStart, jsonEnd)
            const generatedTasks = JSON.parse(jsonStr)

            const newTasks = [...tasks]
            generatedTasks.forEach((t: any, index: number) => {
              newTasks.push({
                id: `ai-${Date.now()}-${index}`,
                title: t.title,
                time: t.time,
                description: t.description,
                category: t.category,
                completed: false,
                isAI: true,
                sortTime: parseTimeToMinutes(t.time)
              })
            })

            newTasks.sort((a, b) => a.sortTime - b.sortTime)
            setTasks(newTasks)
            setIsGenerating(false)
            toast.success(`AI generated ${generatedTasks.length} new tasks!`, { icon: '✨' })
          } catch (e) {
            console.error('Failed to parse AI response:', aiResponse)
            setIsGenerating(false)
            toast.error('AI generated invalid data. Please try again.')
          }
        },
        (error) => {
          setIsGenerating(false)
          toast.error(`AI Error: ${error.message}`)
        }
      )
    } catch (error) {
      setIsGenerating(false)
      toast.error('Failed to connect to AI service.')
    }
  }

  const completedCount = tasks.filter(t => t.completed).length
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0

  return (
    <div className="min-h-full space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-green-600">
            AI Day Planner
          </h1>
          <p className="text-muted-foreground text-lg">
            Optimize your farm operations with intelligent scheduling.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleSmartGenerate}
            className="relative overflow-hidden group bg-gradient-to-r from-indigo-600 to-primary hover:from-indigo-700 hover:to-primary/90 text-white border-none shadow-lg shadow-primary/20"
            disabled={isGenerating}
          >
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2"
                >
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Analyzing Data...</span>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                  <span>Smart Generate</span>
                </motion.div>
              )}
            </AnimatePresence>
          </Button>

          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-primary/20 bg-background/50 backdrop-blur-sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Manual Task</DialogTitle>
                <DialogDescription>Schedule a new activity for today.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Task Title</label>
                  <Input
                    placeholder="e.g., Fix irrigation pump"
                    value={newTask.title}
                    onChange={e => setNewTask({...newTask, title: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Time</label>
                    <Input
                      placeholder="e.g., 09:00 AM"
                      value={newTask.time}
                      onChange={e => setNewTask({...newTask, time: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Category</label>
                    <Select
                      value={newTask.category}
                      onValueChange={v => setNewTask({...newTask, category: v as any})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="irrigation">Irrigation</SelectItem>
                        <SelectItem value="planting">Planting</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="harvest">Harvest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Provide some details..."
                    value={newTask.description}
                    onChange={e => setNewTask({...newTask, description: e.target.value})}
                  />
                </div>
                <Button onClick={handleAddTask} className="w-full">Save Task</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none bg-gradient-to-br from-card/50 to-background shadow-xl backdrop-blur-md">
            <CardHeader className="border-b border-border/50 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Today's Schedule
                </CardTitle>
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                  {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="relative space-y-0 pb-4">
                {/* Vertical Line */}
                <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-border to-transparent ml-[2px]" />

                <div className="space-y-6 relative">
                  <AnimatePresence initial={false}>
                    {tasks.map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative pl-10 group"
                      >
                        {/* Dot */}
                        <div className={cn(
                          "absolute left-3.5 top-2 h-2 w-2 rounded-full ring-4 ring-background transition-all duration-300 z-10",
                          task.completed ? "bg-primary ring-primary/20" : "bg-border ring-background"
                        )} />

                        <div className={cn(
                          "flex items-start gap-4 p-4 rounded-2xl border transition-all duration-300 hover:shadow-md",
                          task.completed
                            ? "bg-primary/5 border-primary/20 opacity-75"
                            : "bg-background/50 border-border/50 hover:border-primary/30",
                          task.isAI && !task.completed && "border-indigo-500/30 bg-indigo-500/5 shadow-indigo-500/5"
                        )}>
                          <button
                            onClick={() => toggleTask(task.id)}
                            className="mt-1 focus:outline-none"
                          >
                            {task.completed ? (
                              <CheckCircle2 className="h-6 w-6 text-primary" />
                            ) : (
                              <Circle className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                            )}
                          </button>

                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-primary tracking-wider uppercase">
                                {task.time}
                              </span>
                              <div className="flex items-center gap-2">
                                {task.isAI && (
                                  <Badge className="bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20 border-indigo-500/20 text-[10px] h-5">
                                    <Sparkles className="h-3 w-3 mr-1" />
                                    AI Suggested
                                  </Badge>
                                )}
                                <Badge className={cn("text-[10px] h-5", categoryStyles[task.category])}>
                                  {task.category}
                                </Badge>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => deleteTask(task.id)} className="text-destructive">
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                            <h3 className={cn(
                              "font-semibold text-lg leading-tight transition-all",
                              task.completed && "line-through text-muted-foreground"
                            )}>
                              {task.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {task.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {tasks.length === 0 && (
                    <div className="text-center py-20">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <CalendarCheck className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold">No tasks yet</h3>
                      <p className="text-muted-foreground max-w-xs mx-auto">
                        Your schedule is empty. Use Smart Generate to get AI recommendations.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Context & Stats */}
        <div className="space-y-6">
          {/* AI Insights Card */}
          <Card className="border-none bg-indigo-600/5 dark:bg-indigo-400/5 shadow-none border border-indigo-500/20 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles className="h-20 w-20 text-indigo-500 rotate-12" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <AlertCircle className="h-4 w-4" />
                AI Contextual Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/10">
                <CloudSun className="h-5 w-5 text-indigo-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Weather Alert</p>
                  <p className="text-xs text-muted-foreground">High rain probability (85%) starting at 2:00 PM. Schedule irrigation before noon.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/10">
                <Sprout className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Crop Status</p>
                  <p className="text-xs text-muted-foreground">Maize in Field A is entering V8 stage. Nitrogen top-dressing recommended today.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-none bg-card/50 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="text-base">Productivity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                 <div className="flex justify-between text-sm">
                   <span className="text-muted-foreground">Tasks Completed</span>
                   <span className="font-medium">{completedCount}/{tasks.length}</span>
                 </div>
                 <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                   <motion.div
                     initial={{ width: 0 }}
                     animate={{ width: `${progress}%` }}
                     className="h-full bg-primary transition-all duration-500"
                   />
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-4 pt-2">
                 <div className="p-3 rounded-xl bg-background/50 border border-border/50">
                   <p className="text-xs text-muted-foreground">Active Hours</p>
                   <p className="text-lg font-bold">5.5h</p>
                 </div>
                 <div className="p-3 rounded-xl bg-background/50 border border-border/50">
                   <p className="text-xs text-muted-foreground">Efficiency</p>
                   <p className="text-lg font-bold text-green-600">High</p>
                 </div>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
