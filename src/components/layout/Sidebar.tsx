import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useStore } from '@/lib/store'
import {
  LayoutDashboard,
  Sprout,
  Droplets,
  CloudSun,
  TrendingUp,
  Bug,
  Bot,
  Map,
  CalendarCheck,
  BookOpen,
  Users,
  GraduationCap,
  Store,
  Wallet,
  Beef,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/crops', label: 'Crop Monitoring', icon: Sprout },
  { path: '/soil', label: 'Soil Analysis', icon: Droplets },
  { path: '/weather', label: 'Weather', icon: CloudSun },
  { path: '/market', label: 'Market Prices', icon: TrendingUp },
  { path: '/pests', label: 'Pest Detection', icon: Bug },
  { path: '/ai-chat', label: 'AI Assistant', icon: Bot },
  { path: '/planner', label: 'Day Planner', icon: CalendarCheck },
  { path: '/map', label: 'Farm Map', icon: Map },
  { path: '/diary', label: 'Farm Diary', icon: BookOpen },
  { path: '/community', label: 'Community', icon: Users },
  { path: '/learn', label: 'Learning Hub', icon: GraduationCap },
  { path: '/marketplace', label: 'Marketplace', icon: Store },
  { path: '/finance', label: 'Finance', icon: Wallet },
  { path: '/livestock', label: 'Livestock', icon: Beef },
  { path: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useStore()

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r bg-card transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-16'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b px-4">
          {sidebarOpen ? (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Sprout className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-primary">OviGrow</span>
            </div>
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary mx-auto">
              <Sprout className="h-5 w-5 text-primary-foreground" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                      !sidebarOpen && 'justify-center px-2'
                    )
                  }
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {sidebarOpen && <span>{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Toggle Button */}
        <div className="border-t p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="w-full"
          >
            {sidebarOpen ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </aside>
  )
}
