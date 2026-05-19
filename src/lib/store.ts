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
  setUser: (user: User | null) => void
  toggleSidebar: () => void
  toggleDarkMode: () => void
  setSelectedModel: (model: string) => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      sidebarOpen: true,
      darkMode: false,
      selectedModel: 'anthropic/claude-3.5-sonnet',
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
    }),
    {
      name: 'ovigrow-storage',
      partialize: (state) => ({
        darkMode: state.darkMode,
        selectedModel: state.selectedModel,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
)
