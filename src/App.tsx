import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import Dashboard from '@/pages/Dashboard'
import CropMonitoring from '@/pages/CropMonitoring'
import SoilAnalysis from '@/pages/SoilAnalysis'
import WeatherForecast from '@/pages/WeatherForecast'
import MarketPrices from '@/pages/MarketPrices'
import PestDetection from '@/pages/PestDetection'
import AIChat from '@/pages/AIChat'
import FarmMap from '@/pages/FarmMap'
import FarmDiary from '@/pages/FarmDiary'
import Community from '@/pages/Community'
import LearningHub from '@/pages/LearningHub'
import Marketplace from '@/pages/Marketplace'
import FinanceTracker from '@/pages/FinanceTracker'
import LivestockManager from '@/pages/LivestockManager'
import Settings from '@/pages/Settings'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="crops" element={<CropMonitoring />} />
          <Route path="soil" element={<SoilAnalysis />} />
          <Route path="weather" element={<WeatherForecast />} />
          <Route path="market" element={<MarketPrices />} />
          <Route path="pests" element={<PestDetection />} />
          <Route path="ai-chat" element={<AIChat />} />
          <Route path="map" element={<FarmMap />} />
          <Route path="diary" element={<FarmDiary />} />
          <Route path="community" element={<Community />} />
          <Route path="learn" element={<LearningHub />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="finance" element={<FinanceTracker />} />
          <Route path="livestock" element={<LivestockManager />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
