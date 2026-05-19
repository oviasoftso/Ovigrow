import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Sprout,
  Droplets,
  CloudSun,
  TrendingUp,
  Bug,
  Wallet,
  Beef,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'

const stats = [
  {
    title: 'Active Crops',
    value: '12',
    change: '+2 this month',
    trend: 'up',
    icon: Sprout,
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900/20',
  },
  {
    title: 'Soil Health',
    value: '78%',
    change: '+5% from last test',
    trend: 'up',
    icon: Droplets,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20',
  },
  {
    title: 'Weather Risk',
    value: 'Low',
    change: 'Clear skies ahead',
    trend: 'up',
    icon: CloudSun,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
  },
  {
    title: 'Market Price',
    value: '$285/ton',
    change: '+12% this week',
    trend: 'up',
    icon: TrendingUp,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/20',
  },
]

const recentActivities = [
  { id: 1, action: 'Maize field irrigated', time: '2 hours ago', type: 'irrigation' },
  { id: 2, action: 'Soil test completed - Field A', time: '5 hours ago', type: 'soil' },
  { id: 3, action: 'Pest alert: Aphids detected', time: '1 day ago', type: 'pest' },
  { id: 4, action: 'Harvest recorded: 2.5 tons wheat', time: '2 days ago', type: 'harvest' },
  { id: 5, action: 'New community post liked', time: '3 days ago', type: 'social' },
]

const cropProgress = [
  { name: 'Maize - Field A', progress: 75, status: 'Growing', daysLeft: 30 },
  { name: 'Wheat - Field B', progress: 90, status: 'Ready', daysLeft: 5 },
  { name: 'Soybeans - Field C', progress: 45, status: 'Growing', daysLeft: 60 },
  { name: 'Tobacco - Field D', progress: 30, status: 'Planted', daysLeft: 90 },
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your farm operations
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bgColor} ${stat.color} rounded-full p-2`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="h-3 w-3 text-green-600" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-600" />
                )}
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Crop Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Crop Progress</CardTitle>
            <CardDescription>Current growth stages of your crops</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {cropProgress.map((crop) => (
              <div key={crop.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{crop.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        crop.status === 'Ready'
                          ? 'success'
                          : crop.status === 'Growing'
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {crop.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {crop.daysLeft}d left
                    </span>
                  </div>
                </div>
                <Progress value={crop.progress} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest farm activities and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 rounded-lg border p-3"
                >
                  <div
                    className={`rounded-full p-2 ${
                      activity.type === 'pest'
                        ? 'bg-red-100 text-red-600 dark:bg-red-900/20'
                        : activity.type === 'harvest'
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/20'
                        : activity.type === 'irrigation'
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-900/20'
                    }`}
                  >
                    {activity.type === 'pest' ? (
                      <Bug className="h-4 w-4" />
                    ) : activity.type === 'harvest' ? (
                      <Sprout className="h-4 w-4" />
                    ) : activity.type === 'irrigation' ? (
                      <Droplets className="h-4 w-4" />
                    ) : (
                      <Wallet className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common farm management tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <button className="flex items-center gap-3 rounded-lg border p-4 hover:bg-accent transition-colors">
              <Sprout className="h-8 w-8 text-green-600" />
              <div className="text-left">
                <p className="font-medium">Add Crop</p>
                <p className="text-xs text-muted-foreground">Record new planting</p>
              </div>
            </button>
            <button className="flex items-center gap-3 rounded-lg border p-4 hover:bg-accent transition-colors">
              <Droplets className="h-8 w-8 text-blue-600" />
              <div className="text-left">
                <p className="font-medium">Log Irrigation</p>
                <p className="text-xs text-muted-foreground">Record watering</p>
              </div>
            </button>
            <button className="flex items-center gap-3 rounded-lg border p-4 hover:bg-accent transition-colors">
              <Bug className="h-8 w-8 text-red-600" />
              <div className="text-left">
                <p className="font-medium">Report Pest</p>
                <p className="text-xs text-muted-foreground">Flag pest issue</p>
              </div>
            </button>
            <button className="flex items-center gap-3 rounded-lg border p-4 hover:bg-accent transition-colors">
              <Beef className="h-8 w-8 text-amber-600" />
              <div className="text-left">
                <p className="font-medium">Check Livestock</p>
                <p className="text-xs text-muted-foreground">View herd status</p>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
