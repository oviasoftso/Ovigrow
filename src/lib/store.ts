import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  farm_name: string | null
  location: string | null
}

interface AppState {
  user: User | null
  sidebarOpen: boolean
  darkMode: boolean
  selectedModel: string
  isOnline: boolean
  lastSyncTime: number | null
  setUser: (user: User | null) => void
  toggleSidebar: () => void
  toggleDarkMode: () => void
  setSelectedModel: (model: string) => void
  setOnline: (online: boolean) => void
  setLastSyncTime: (time: number) => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      sidebarOpen: true,
      darkMode: false,
      selectedModel: 'anthropic/claude-sonnet-4',
      isOnline: navigator.onLine,
      lastSyncTime: null,
      setUser: (user) => set({ user }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      toggleDarkMode: () => {
        set((state) => {
          const newDarkMode = !state.darkMode
          document.documentElement.classList.toggle('dark', newDarkMode)
          return { darkMode: newDarkMode }
        })
      },
      setSelectedModel: (model) => set({ selectedModel: model }),
      setOnline: (online) => set({ isOnline: online }),
      setLastSyncTime: (time) => set({ lastSyncTime: time }),
    }),
    {
      name: 'ovigrow-storage',
      partialize: (state) => ({
        darkMode: state.darkMode,
        selectedModel: state.selectedModel,
        sidebarOpen: state.sidebarOpen,
        lastSyncTime: state.lastSyncTime,
      }),
    }
  )
)
