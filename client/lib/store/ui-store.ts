import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UiState {
  isSidebarCollapsed: boolean
  setSidebarCollapsed: (value: boolean) => void
  toggleSidebar: () => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      isSidebarCollapsed: false, // Default state, will be overridden by logic
      setSidebarCollapsed: (value) => set({ isSidebarCollapsed: value }),
      toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
    }),
    {
      name: 'ui-storage',
    }
  )
)
