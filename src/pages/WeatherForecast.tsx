import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
} from 'lucide-react'

const currentWeather = {
  temperature: 28,
  feelsLike: 30,
  humidity: 65,
  windSpeed: 12,
  visibility: 10,
  pressure: 1013,
  uvIndex: 7,
  condition: 'Partly Cloudy',
  icon: CloudSun,
}

const hourlyForecast = [
  { time: '09:00', temp: 26, icon: Sun, condition: 'Sunny' },
  { time: '12:00', temp: 30, icon: CloudSun, condition: 'Partly Cloudy' },
  { time: '15:00', temp: 32, icon: CloudSun, condition: 'Partly Cloudy' },
  { time: '18:00', temp: 28, icon: Cloud, condition: 'Cloudy' },
  { time: '21:00', temp: 24, icon: Cloud, condition: 'Cloudy' },
]

const weeklyForecast = [
  { day: 'Mon', high: 32, low: 22, icon: Sun, condition: 'Sunny', rain: 0 },
  { day: 'Tue', high: 30, low: 21, icon: CloudSun, condition: 'Partly Cloudy', rain: 10 },
  { day: 'Wed', high: 28, low: 20, icon: CloudRain, condition: 'Rain', rain: 60 },
  { day: 'Thu', high: 26, low: 19, icon: CloudRain, condition: 'Rain', rain: 80 },
  { day: 'Fri', high: 29, low: 21, icon: Cloud, condition: 'Cloudy', rain: 20 },
  { day: 'Sat', high: 31, low: 22, icon: CloudSun, condition: 'Partly Cloudy', rain: 5 },
  { day: 'Sun', high: 33, low: 23, icon: Sun, condition: 'Sunny', rain: 0 },
]

const farmingAlerts = [
  {
    id: 1,
    type: 'warning',
    title: 'Heavy Rain Expected',
    message: 'Wednesday-Thursday: 60-80% chance of heavy rainfall. Consider delaying fertilizer application.',
    icon: CloudRain,
  },
  {
    id: 2,
    type: 'info',
    title: 'Optimal Planting Window',
    message: 'Friday-Sunday: Ideal conditions for planting maize. Soil moisture will be adequate after rain.',
    icon: Sun,
  },
  {
    id: 3,
    type: 'danger',
    title: 'High UV Index',
    message: 'UV index will reach 8+ on Monday. Protect workers and consider shade for sensitive crops.',
    icon: Thermometer,
  },
]

export default function WeatherForecast() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Weather Forecast</h1>
        <p className="text-muted-foreground">
          Weather conditions and farming alerts for your region
        </p>
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
            <currentWeather.icon className="h-16 w-16" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4">
            <div className="text-6xl font-bold">{currentWeather.temperature}°C</div>
            <div className="mb-2">
              <p className="text-lg">{currentWeather.condition}</p>
              <p className="text-blue-100">Feels like {currentWeather.feelsLike}°C</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="flex items-center gap-2">
              <Droplets className="h-5 w-5" />
              <div>
                <p className="text-sm text-blue-100">Humidity</p>
                <p className="font-semibold">{currentWeather.humidity}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="h-5 w-5" />
              <div>
                <p className="text-sm text-blue-100">Wind</p>
                <p className="font-semibold">{currentWeather.windSpeed} km/h</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              <div>
                <p className="text-sm text-blue-100">Visibility</p>
                <p className="font-semibold">{currentWeather.visibility} km</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Gauge className="h-5 w-5" />
              <div>
                <p className="text-sm text-blue-100">Pressure</p>
                <p className="font-semibold">{currentWeather.pressure} hPa</p>
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
            {hourlyForecast.map((hour) => (
              <div
                key={hour.time}
                className="flex flex-col items-center gap-2 rounded-lg border p-4 min-w-[100px]"
              >
                <span className="text-sm text-muted-foreground">{hour.time}</span>
                <hour.icon className="h-8 w-8 text-blue-600" />
                <span className="text-lg font-semibold">{hour.temp}°C</span>
                <span className="text-xs text-muted-foreground">{hour.condition}</span>
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
            {weeklyForecast.map((day) => (
              <div
                key={day.day}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-4 w-24">
                  <span className="font-medium">{day.day}</span>
                  <day.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex items-center gap-4 flex-1">
                  <span className="text-sm text-muted-foreground w-20">
                    {day.condition}
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
                    variant={day.rain > 50 ? 'destructive' : day.rain > 20 ? 'warning' : 'outline'}
                    className="w-16 justify-center"
                  >
                    {day.rain}%
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
            {farmingAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-start gap-4 rounded-lg border p-4 ${
                  alert.type === 'danger'
                    ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20'
                    : alert.type === 'warning'
                    ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20'
                    : 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20'
                }`}
              >
                <alert.icon
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
