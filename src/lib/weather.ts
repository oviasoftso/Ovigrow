const CACHE_KEY = 'ovigrow-weather-cache'
const CACHE_TTL = 30 * 60 * 1000 // 30 minutes

// Harare, Zimbabwe coordinates
const DEFAULT_LAT = -17.8292
const DEFAULT_LON = 31.0522

// WMO Weather Code mappings
const WMO_CODES: Record<number, { label: string; icon: 'sun' | 'cloud-sun' | 'cloud' | 'cloud-rain' | 'cloud-drizzle' | 'cloud-lightning' | 'snowflake' | 'cloud-fog' }> = {
  0: { label: 'Clear Sky', icon: 'sun' },
  1: { label: 'Mainly Clear', icon: 'sun' },
  2: { label: 'Partly Cloudy', icon: 'cloud-sun' },
  3: { label: 'Overcast', icon: 'cloud' },
  45: { label: 'Fog', icon: 'cloud-fog' },
  48: { label: 'Depositing Rime Fog', icon: 'cloud-fog' },
  51: { label: 'Light Drizzle', icon: 'cloud-drizzle' },
  53: { label: 'Moderate Drizzle', icon: 'cloud-drizzle' },
  55: { label: 'Dense Drizzle', icon: 'cloud-drizzle' },
  61: { label: 'Slight Rain', icon: 'cloud-rain' },
  63: { label: 'Moderate Rain', icon: 'cloud-rain' },
  65: { label: 'Heavy Rain', icon: 'cloud-rain' },
  66: { label: 'Freezing Rain', icon: 'cloud-rain' },
  67: { label: 'Heavy Freezing Rain', icon: 'cloud-rain' },
  71: { label: 'Slight Snow', icon: 'snowflake' },
  73: { label: 'Moderate Snow', icon: 'snowflake' },
  75: { label: 'Heavy Snow', icon: 'snowflake' },
  80: { label: 'Slight Showers', icon: 'cloud-drizzle' },
  81: { label: 'Moderate Showers', icon: 'cloud-rain' },
  82: { label: 'Violent Showers', icon: 'cloud-rain' },
  85: { label: 'Slight Snow Showers', icon: 'snowflake' },
  86: { label: 'Heavy Snow Showers', icon: 'snowflake' },
  95: { label: 'Thunderstorm', icon: 'cloud-lightning' },
  96: { label: 'Thunderstorm with Hail', icon: 'cloud-lightning' },
  99: { label: 'Thunderstorm with Heavy Hail', icon: 'cloud-lightning' },
}

export function getWeatherInfo(code: number) {
  return WMO_CODES[code] || { label: 'Unknown', icon: 'cloud' as const }
}

export interface CurrentWeather {
  time: string
  temperature: number
  feelsLike: number
  humidity: number
  weatherCode: number
  windSpeed: number
  pressure: number
  label: string
  icon: string
}

export interface HourlyForecast {
  time: string
  temperature: number
  weatherCode: number
  label: string
  icon: string
}

export interface DailyForecast {
  date: string
  weatherCode: number
  high: number
  low: number
  rainChance: number
  label: string
  icon: string
}

export interface WeatherData {
  current: CurrentWeather
  hourly: HourlyForecast[]
  daily: DailyForecast[]
  fetchedAt: number
}

export async function fetchWeather(lat = DEFAULT_LAT, lon = DEFAULT_LON): Promise<WeatherData> {
  // Check cache first
  const cached = getCachedWeather()
  if (cached) return cached

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,surface_pressure` +
    `&hourly=temperature_2m,weather_code` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
    `&timezone=Africa/Harare&forecast_days=7`

  const response = await fetch(url)
  if (!response.ok) throw new Error(`Weather API error: ${response.status}`)

  const data = await response.json()
  const now = Date.now()

  const current: CurrentWeather = {
    time: data.current.time,
    temperature: Math.round(data.current.temperature_2m),
    feelsLike: Math.round(data.current.apparent_temperature),
    humidity: data.current.relative_humidity_2m,
    weatherCode: data.current.weather_code,
    windSpeed: Math.round(data.current.wind_speed_10m),
    pressure: Math.round(data.current.surface_pressure),
    ...getWeatherInfo(data.current.weather_code),
  }

  // Get next 24 hours of hourly data
  const currentHour = new Date(data.current.time).getHours()
  const hourly: HourlyForecast[] = data.hourly.time
    .slice(0, 48)
    .map((time: string, i: number) => ({
      time: new Date(time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      temperature: Math.round(data.hourly.temperature_2m[i]),
      weatherCode: data.hourly.weather_code[i],
      ...getWeatherInfo(data.hourly.weather_code[i]),
    }))
    .filter((h: HourlyForecast) => {
      const hour = parseInt(h.time.split(':')[0])
      return hour >= currentHour
    })
    .slice(0, 8)

  const daily: DailyForecast[] = data.daily.time.map((date: string, i: number) => ({
    date,
    weatherCode: data.daily.weather_code[i],
    high: Math.round(data.daily.temperature_2m_max[i]),
    low: Math.round(data.daily.temperature_2m_min[i]),
    rainChance: data.daily.precipitation_probability_max[i],
    ...getWeatherInfo(data.daily.weather_code[i]),
  }))

  const weatherData: WeatherData = { current, hourly, daily, fetchedAt: now }

  // Cache the result
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(weatherData))
  } catch {
    // localStorage full, ignore
  }

  return weatherData
}

function getCachedWeather(): WeatherData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const cached: WeatherData = JSON.parse(raw)
    if (Date.now() - cached.fetchedAt > CACHE_TTL) return null
    return cached
  } catch {
    return null
  }
}

export function getDayName(dateStr: string): string {
  const date = new Date(dateStr)
  const today = new Date()
  if (date.toDateString() === today.toDateString()) return 'Today'
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow'
  return date.toLocaleDateString('en-US', { weekday: 'short' })
}

export function generateFarmingAlerts(weather: WeatherData) {
  const alerts: { type: 'warning' | 'info' | 'danger'; title: string; message: string }[] = []

  // Check for heavy rain in next 3 days
  const rainDays = weather.daily.slice(0, 3).filter(d => d.rainChance > 50)
  if (rainDays.length > 0) {
    alerts.push({
      type: 'warning',
      title: 'Heavy Rain Expected',
      message: `${rainDays.map(d => getDayName(d.date)).join(', ')}: ${Math.max(...rainDays.map(d => d.rainChance))}% chance of rainfall. Consider delaying fertilizer application.`,
    })
  }

  // Check for high temperatures
  const hotDays = weather.daily.filter(d => d.high > 35)
  if (hotDays.length > 0) {
    alerts.push({
      type: 'danger',
      title: 'High Temperature Alert',
      message: `Temperatures reaching ${Math.max(...hotDays.map(d => d.high))}°C expected. Ensure adequate irrigation and consider shade for sensitive crops.`,
    })
  }

  // Check for optimal planting conditions
  const goodDays = weather.daily.filter(d => d.rainChance < 30 && d.high < 32 && d.low > 15)
  if (goodDays.length > 0) {
    alerts.push({
      type: 'info',
      title: 'Good Planting Window',
      message: `${goodDays.slice(0, 2).map(d => getDayName(d.date)).join(', ')}: Ideal conditions for field work and planting.`,
    })
  }

  // Frost warning
  const frostDays = weather.daily.filter(d => d.low < 5)
  if (frostDays.length > 0) {
    alerts.push({
      type: 'danger',
      title: 'Frost Risk',
      message: `Temperatures dropping to ${Math.min(...frostDays.map(d => d.low))}°C. Protect frost-sensitive crops.`,
    })
  }

  if (alerts.length === 0) {
    alerts.push({
      type: 'info',
      title: 'Favorable Conditions',
      message: 'Weather conditions are generally favorable for farming activities this week.',
    })
  }

  return alerts
}
