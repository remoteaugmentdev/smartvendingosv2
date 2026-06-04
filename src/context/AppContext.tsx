'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

interface AppContextValue {
  sidebarCollapsed: boolean
  setSidebarCollapsed: (v: boolean) => void
  toggleSidebar: () => void
  mobileSidebarOpen: boolean
  toggleMobileSidebar: () => void
  closeMobileSidebar: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  function toggleSidebar() {
    setSidebarCollapsed((prev) => !prev)
  }

  function toggleMobileSidebar() {
    setMobileSidebarOpen((prev) => !prev)
  }

  function closeMobileSidebar() {
    setMobileSidebarOpen(false)
  }

  return (
    <AppContext.Provider value={{ sidebarCollapsed, setSidebarCollapsed, toggleSidebar, mobileSidebarOpen, toggleMobileSidebar, closeMobileSidebar }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
