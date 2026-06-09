import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

export function DashboardLayout() {
  const { sidebarOpen, toggleSidebar } = useStore()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isMobile={isMobile} />
      <div
        className={cn(
          'transition-all duration-300',
          isMobile
            ? sidebarOpen
              ? 'translate-x-64'
              : 'translate-x-0'
            : sidebarOpen
            ? 'ml-64'
            : 'ml-16'
        )}
      >
        <Header />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={toggleSidebar}
        />
      )}
    </div>
  )
}
