'use client'

import { usePathname } from 'next/navigation'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { MainContent } from './MainContent'
import { TourProvider } from '@/context/TourContext'
import { TourOverlay } from '@/components/tour/TourOverlay'
import { TourWelcome } from '@/components/tour/TourWelcome'
import { TourComplete } from '@/components/tour/TourComplete'
import { RestartTourButton } from '@/components/tour/RestartTourButton'

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isPublic =
    pathname === '/' ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/landing') ||
    pathname.startsWith('/pricing') ||
    pathname.startsWith('/signup')

  if (isPublic) return <>{children}</>

  return (
    <TourProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
          <Topbar />
          <MainContent>{children}</MainContent>
        </div>
      </div>
      <RestartTourButton />
      <TourOverlay />
      <TourWelcome />
      <TourComplete />
    </TourProvider>
  )
}
