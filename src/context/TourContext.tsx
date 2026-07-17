'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { TOUR_STEPS } from '@/components/tour/tourSteps'

interface TourContextValue {
  welcomeOpen: boolean
  active: boolean
  completeOpen: boolean
  stepIndex: number
  stepCount: number
  companyName: string | null
  openWelcome: () => void
  beginTour: () => void
  dismissWelcome: () => void
  finishTour: () => void
  closeComplete: () => void
  stop: () => void
  next: () => void
  back: () => void
  restart: () => void
}

const TourContext = createContext<TourContextValue | null>(null)

export function TourProvider({ children }: { children: ReactNode }) {
  // This provider lives in the persistent layout shell, so `active` and
  // `stepIndex` survive route changes: the tour never resets on navigation.
  const [welcomeOpen, setWelcomeOpen] = useState(false)
  const [active, setActive] = useState(false)
  const [completeOpen, setCompleteOpen] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [companyName, setCompanyName] = useState<string | null>(null)

  const openWelcome = useCallback(() => {
    setActive(false)
    setCompleteOpen(false)
    setStepIndex(0)
    setWelcomeOpen(true)
  }, [])

  const beginTour = useCallback(() => {
    setWelcomeOpen(false)
    setCompleteOpen(false)
    setStepIndex(0)
    setActive(true)
  }, [])

  const dismissWelcome = useCallback(() => setWelcomeOpen(false), [])

  // Reaching the end is different from bailing out: celebrate it.
  const finishTour = useCallback(() => {
    setActive(false)
    setCompleteOpen(true)
  }, [])

  const closeComplete = useCallback(() => setCompleteOpen(false), [])

  const stop = useCallback(() => {
    setActive(false)
    setWelcomeOpen(false)
    setCompleteOpen(false)
  }, [])

  const next = useCallback(
    () => setStepIndex((i) => Math.min(i + 1, TOUR_STEPS.length - 1)),
    []
  )

  const back = useCallback(() => setStepIndex((i) => Math.max(i - 1, 0)), [])

  const restart = useCallback(() => setStepIndex(0), [])

  // Auto-open the welcome card once when the authenticated shell first mounts
  // (on entering the app / a fresh load). It doesn't re-fire on route changes
  // because this provider persists. Effects already run after paint, so the
  // card's own CSS entrance animation is the only transition, no extra wait.
  const autoStarted = useRef(false)
  useEffect(() => {
    if (autoStarted.current) return
    autoStarted.current = true
    openWelcome()
  }, [openWelcome])

  // One-shot handoff from the demo landing page: DemoRequestForm stashes the
  // company name in sessionStorage right before redirecting to /dashboard.
  useEffect(() => {
    const stored = sessionStorage.getItem('demoCompanyName')
    if (stored) setCompanyName(stored)
  }, [])

  return (
    <TourContext.Provider
      value={{
        welcomeOpen,
        active,
        completeOpen,
        stepIndex,
        stepCount: TOUR_STEPS.length,
        companyName,
        openWelcome,
        beginTour,
        dismissWelcome,
        finishTour,
        closeComplete,
        stop,
        next,
        back,
        restart,
      }}
    >
      {children}
    </TourContext.Provider>
  )
}

export function useTour(): TourContextValue {
  const ctx = useContext(TourContext)
  if (!ctx) throw new Error('useTour must be used within TourProvider')
  return ctx
}
