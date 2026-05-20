import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  CloudSun,
  Cloud,
  CloudRain,
  Sun,
  Wind,
  Droplets,
  Thermometer,
  Eye,
  Gauge,
  CloudLightning,
  CloudDrizzle,
  CloudFog,
  Snowflake,
  RefreshCw,
  Loader2,
} from 'lucide-react'
import { fetchWeather, getDayName, generateFarmingAlerts, type WeatherData } from '@/lib/weather'

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  sun: Sun,
  'cloud-sun': CloudSun,
  cloud: Cloud,
  'cloud-rain': CloudRain,
  'cloud-drizzle': CloudDrizzle,
  'cloud-lightning': CloudLightning,
  'cloud-fog': CloudFog,
  snowflake: Snowflake,
}

function WeatherIcon({ icon, className }: { icon: string; className?: string }) {
  const IconComponent = ICON_MAP[icon] || Cloud
  return <IconComponent className={className} />
}

export default function WeatherForecast() {
  const { data: weather, isLoading, error, refetch, dataUpdatedAt } = useQuery<WeatherData>({
    queryKey: ['weather'],
    queryFn: () => fetchWeather(),
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Weather Forecast</h1>
          <p className="text-muted-foreground">Loading weather data...</p>
        </div>
        <Card className="h-48 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </Card>
      </div>
    )
  }

  if (error || !weather) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Weather Forecast</h1>
          <p className="text-muted-foreground text-red-500">Failed to load weather data. Check your connection.</p>
        </div>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" /> Retry
        </Button>
      </div>
    )
  }

  const alerts = generateFarmingAlerts(weather)
  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Weather Forecast</h1>
          <p className="text-muted-foreground">
            Live weather conditions for Harare, Zimbabwe
            {lastUpdated && <span className="ml-2 text-xs">(Updated {lastUpdated})</span>}
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-1" /> Refresh
        </Button>
      </div>

      {/* Current Weather */}
      <Card className="bg-gradient-to-br from-blue-500 to-blue-700 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Current Weather</CardTitle>
              <CardDescription className="text-blue-100">
                Harare, Zimbabwe
              </CardDescription>
            </div>
            <WeatherIcon icon={weather.current.icon} className="h-16 w-16" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4">
            <div className="text-6xl font-bold">{weather.current.temperature}°C</div>
            <div className="mb-2">
              <p className="text-lg">{weather.current.label}</p>
              <p className="text-blue-100">Feels like {weather.current.feelsLike}°C</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="flex items-center gap-2">
              <Droplets className="h-5 w-5" />
              <div>
                <p className="text-sm text-blue-100">Humidity</p>
                <p className="font-semibold">{weather.current.humidity}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="h-5 w-5" />
              <div>
                <p className="text-sm text-blue-100">Wind</p>
                <p className="font-semibold">{weather.current.windSpeed} km/h</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Gauge className="h-5 w-5" />
              <div>
                <p className="text-sm text-blue-100">Pressure</p>
                <p className="font-semibold">{weather.current.pressure} hPa</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Thermometer className="h-5 w-5" />
              <div>
                <p className="text-sm text-blue-100">Feels Like</p>
                <p className="font-semibold">{weather.current.feelsLike}°C</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hourly Forecast */}
      <Card>
        <CardHeader>
          <CardTitle>Hourly Forecast</CardTitle>
          <CardDescription>Today's temperature changes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {weather.hourly.map((hour) => (
              <div
                key={hour.time}
                className="flex flex-col items-center gap-2 rounded-lg border p-4 min-w-[100px]"
              >
                <span className="text-sm text-muted-foreground">{hour.time}</span>
                <WeatherIcon icon={hour.icon} className="h-8 w-8 text-blue-600" />
                <span className="text-lg font-semibold">{hour.temperature}°C</span>
                <span className="text-xs text-muted-foreground">{hour.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Forecast */}
      <Card>
        <CardHeader>
          <CardTitle>7-Day Forecast</CardTitle>
          <CardDescription>Weekly weather outlook</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weather.daily.map((day) => (
              <div
                key={day.date}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-4 w-24">
                  <span className="font-medium">{getDayName(day.date)}</span>
                  <WeatherIcon icon={day.icon} className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex items-center gap-4 flex-1">
                  <span className="text-sm text-muted-foreground w-20">
                    {day.label}
                  </span>
                  <div className="flex-1 max-w-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-blue-400">{day.low}°</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full dark:bg-gray-700">
                        <div
                          className="h-2 bg-gradient-to-r from-blue-400 to-red-400 rounded-full"
                          style={{
                            width: `${((day.high - day.low) / 20) * 100}%`,
                            marginLeft: `${((day.low - 15) / 25) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm text-red-400">{day.high}°</span>
                    </div>
                  </div>
                  <Badge
                    variant={day.rainChance > 50 ? 'destructive' : day.rainChance > 20 ? 'warning' : 'outline'}
                    className="w-16 justify-center"
                  >
                    {day.rainChance}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Farming Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Farming Alerts</CardTitle>
          <CardDescription>Weather-based agricultural recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert, i) => (
              <div
                key={i}
                className={`flex items-start gap-4 rounded-lg border p-4 ${
                  alert.type === 'danger'
                    ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20'
                    : alert.type === 'warning'
                    ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20'
                    : 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20'
                }`}
              >
                <Thermometer
                  className={`h-6 w-6 mt-0.5 ${
                    alert.type === 'danger'
                      ? 'text-red-600'
                      : alert.type === 'warning'
                      ? 'text-yellow-600'
                      : 'text-blue-600'
                  }`}
                />
                <div>
                  <h4 className="font-semibold">{alert.title}</h4>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
