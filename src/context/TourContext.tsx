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
  // because this provider persists. A short delay lets the page paint first.
  const autoStarted = useRef(false)
  useEffect(() => {
    if (autoStarted.current) return
    autoStarted.current = true
    const timer = setTimeout(openWelcome, 400)
    return () => clearTimeout(timer)
  }, [openWelcome])

  return (
    <TourContext.Provider
      value={{
        welcomeOpen,
        active,
        completeOpen,
        stepIndex,
        stepCount: TOUR_STEPS.length,
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
