'use client'

import { RotateCcw } from 'lucide-react'
import { useTour } from '@/context/TourContext'

// Shown only when the tour is idle (not running and no welcome card open). The
// tour auto-opens its welcome once per load; this lets the user reopen it and
// replay the walkthrough anytime without reloading the page.
export function RestartTourButton() {
  const { active, welcomeOpen, completeOpen, openWelcome } = useTour()

  if (active || welcomeOpen || completeOpen) return null

  return (
    <button
      onClick={openWelcome}
      aria-label="Open guided tour"
      className="fixed bottom-6 right-6 z-[1200] flex items-center gap-2 rounded-xl bg-[var(--accent-primary)] px-4 py-3 text-sm font-semibold text-white shadow-[var(--shadow-hover)] transition-all hover:brightness-110 hover:-translate-y-0.5 active:scale-[0.98]"
    >
      <RotateCcw size={18} className="shrink-0" />
      <span className="hidden sm:inline">Take the tour</span>
    </button>
  )
}
