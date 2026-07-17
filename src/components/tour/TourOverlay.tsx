'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { X, ArrowDown } from 'lucide-react'
import { useTour } from '@/context/TourContext'
import { Button } from '@/components/ui/Button'
import { TOUR_STEPS, type TourStep } from './tourSteps'
import { parseCompanyRoute } from '@/utils/companyLink'

const RING_PADDING = 6

function isVisible(el: HTMLElement): boolean {
  const r = el.getBoundingClientRect()
  return r.width >= 24 && r.height >= 24
}

// Four rectangles that tile the viewport around the target's rect, leaving the
// target itself uncovered. A very faint tint on these gently recedes the rest of
// the page while the focused content stays at full strength.
function viewportPanels(rect: DOMRect, pad: number) {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const top = Math.max(0, rect.top - pad)
  const left = Math.max(0, rect.left - pad)
  const right = Math.min(vw, rect.right + pad)
  const bottom = Math.min(vh, rect.bottom + pad)
  return [
    { top: 0, left: 0, width: vw, height: top },
    { top: bottom, left: 0, width: vw, height: Math.max(0, vh - bottom) },
    { top, left: 0, width: left, height: bottom - top },
    { top, left: right, width: Math.max(0, vw - right), height: bottom - top },
  ]
}

// Deliberately faint: a hint, not the heavy dim rejected earlier.
const TOUR_DIM = 'rgba(15, 23, 42, 0.08)'


// True when the element is (or lives inside) the PageHeader block that holds the
// page's <h2>, so we never ring just the heading.
function isHeader(el: HTMLElement): boolean {
  const header = el.closest('.mb-6')
  return !!(header && header.querySelector('h2'))
}

// The main content block on the page, used when a step has no explicit target.
// It prefers substantial content types (tables, charts, grids) over generic
// cards, and skips both the page heading and short info banners near the top,
// so the ring lands on what the step is actually about, not the title.
function firstContent(): HTMLElement | null {
  const main = document.querySelector('main')
  if (!main) return null
  const groups = [
    'table',
    '.recharts-surface',
    '.leaflet-container',
    '[class*="grid-cols"]',
    '.rounded-2xl',
    '.rounded-xl',
  ]
  let fallback: HTMLElement | null = null
  for (const sel of groups) {
    for (const el of main.querySelectorAll<HTMLElement>(sel)) {
      if (isHeader(el) || !isVisible(el)) continue
      // Substantial block: this is the content. Short elements (banners) are
      // only used as a last resort.
      if (el.getBoundingClientRect().height >= 72) return el
      if (!fallback) fallback = el
    }
  }
  return fallback
}

// Query a target selector, with optional " @N" suffix to pick the Nth match
// (1-based), e.g. "main table @3" rings the third table on the page.
function queryTarget(selector: string): HTMLElement | null {
  const nth = selector.match(/^(.*?)\s*@(\d+)$/)
  if (nth) {
    const list = document.querySelectorAll<HTMLElement>(nth[1].trim())
    return list[parseInt(nth[2], 10) - 1] ?? null
  }
  return document.querySelector(selector) as HTMLElement | null
}

// The element to gently ring for this step: explicit target, else first content
// block. Whatever we land on, ring the whole enclosing card (header and body
// together) rather than just an inner table or chart.
function resolveTarget(step: TourStep): HTMLElement | null {
  let el: HTMLElement | null = null
  if (step.target) {
    const t = queryTarget(step.target)
    if (t && isVisible(t) && !isHeader(t)) el = t
  }
  if (!el) el = firstContent()
  if (!el) return null
  return (el.closest('.rounded-xl, .rounded-2xl') as HTMLElement | null) ?? el
}

// A small keyboard-key chip, in the app's mono face.
function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded border border-[var(--border)] bg-slate-50 px-1 font-mono text-[10px] font-medium text-[var(--text-primary)]">
      {children}
    </kbd>
  )
}

// A light, non-blocking narration card + a soft highlight ring. It navigates to
// each step's page, rings the key content so the reader knows where to look, and
// explains it in a corner card. No dark overlay, the page stays fully usable.
export function TourOverlay() {
  const { active, stepIndex, stepCount, restart, next, back, stop, finishTour } = useTour()
  const pathname = usePathname()
  const router = useRouter()
  const [rect, setRect] = useState<DOMRect | null>(null)
  const [nudge, setNudge] = useState(false)

  const step = TOUR_STEPS[stepIndex]
  const isFirst = stepIndex === 0
  const isLast = stepIndex === stepCount - 1
  // Personalized demo links (/{slug}/dashboard) are rewritten server-side to
  // the flat route but keep the slug in the address bar, so compare against
  // the resolved route, and preserve the slug when the tour navigates itself.
  const resolvedPathname = parseCompanyRoute(pathname) ?? pathname
  const slugPrefix = resolvedPathname === pathname ? null : pathname.split('/')[1]
  const onCorrectRoute = !!step && resolvedPathname === step.route

  const handleNext = useCallback(() => {
    if (isLast) finishTour()
    else next()
  }, [isLast, next, finishTour])

  // Navigate to the step's page when we're not already there. If the user
  // themselves clicked away (the step didn't change but the route did), snap
  // back AND surface a nudge so the jump isn't confusing.
  const settledRef = useRef(false)
  const prevStepRef = useRef(stepIndex)
  useEffect(() => {
    if (!active || !step) {
      settledRef.current = false
      return
    }
    if (prevStepRef.current !== stepIndex) {
      // The tour itself advanced/rewound: any route change here is expected.
      prevStepRef.current = stepIndex
      settledRef.current = false
    }
    if (resolvedPathname === step.route) {
      settledRef.current = true
      return
    }
    // We're off the step's route. If we had already settled on it, the user
    // navigated away on their own.
    if (settledRef.current) setNudge(true)
    router.push(slugPrefix ? `/${slugPrefix}${step.route}` : step.route)
  }, [active, step, pathname, resolvedPathname, slugPrefix, stepIndex, router])

  // Keep the nudge visible until the user actually uses the tour controls
  // (which advances the step). It should not flash and vanish on its own.
  useEffect(() => {
    setNudge(false)
  }, [stepIndex])

  // Warm the next page so advancing feels instant.
  useEffect(() => {
    if (!active) return
    const nextStep = TOUR_STEPS[stepIndex + 1]
    if (nextStep) router.prefetch(slugPrefix ? `/${slugPrefix}${nextStep.route}` : nextStep.route)
  }, [active, stepIndex, router, slugPrefix])

  // Find the target (retrying until it mounts), bring it into view, and measure
  // it. The retry means slow content like the map never blocks the ring.
  useEffect(() => {
    if (!active || !step || !onCorrectRoute) {
      setRect(null)
      return
    }
    let cancelled = false
    let tries = 0
    let timer: ReturnType<typeof setTimeout>
    let ro: ResizeObserver | null = null
    let didClick = false

    const measure = (el: HTMLElement) => {
      if (!cancelled) setRect(el.getBoundingClientRect())
    }

    const attempt = () => {
      if (cancelled) return
      // If this step reveals an in-page view (e.g. a machine tab), click it once
      // and let its content render before we ring anything.
      if (step.click && !didClick) {
        const trigger = queryTarget(step.click)
        if (trigger) {
          didClick = true
          trigger.click()
          timer = setTimeout(attempt, 90)
          return
        }
        if (tries++ < 40) {
          timer = setTimeout(attempt, 60)
          return
        }
      }
      const el = resolveTarget(step)
      if (el) {
        el.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' })
        requestAnimationFrame(() => measure(el))
        ro = new ResizeObserver(() => measure(el))
        ro.observe(el)
      } else if (tries++ < 40) {
        timer = setTimeout(attempt, 60)
      } else {
        setRect(null) // nothing to ring, narrate only
      }
    }
    attempt()
    return () => {
      cancelled = true
      clearTimeout(timer)
      ro?.disconnect()
    }
  }, [active, step, onCorrectRoute, stepIndex])

  // Keep the ring aligned when the page scrolls or resizes.
  useEffect(() => {
    if (!active || !onCorrectRoute) return
    const remeasure = () => {
      const el = resolveTarget(step)
      if (el) setRect(el.getBoundingClientRect())
    }
    window.addEventListener('resize', remeasure)
    window.addEventListener('scroll', remeasure, true)
    return () => {
      window.removeEventListener('resize', remeasure)
      window.removeEventListener('scroll', remeasure, true)
    }
  }, [active, step, onCorrectRoute])

  // Keyboard: Esc exits, arrows navigate.
  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') stop()
      else if (e.key === 'ArrowRight') handleNext()
      else if (e.key === 'ArrowLeft') back()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, handleNext, back, stop])

  if (!active || !step) return null

  return (
    <>
      {/* Very faint tint over the rest of the page (target left untouched), so
          it recedes just slightly behind the focused content. */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[1250]">
        {rect ? (
          viewportPanels(rect, RING_PADDING + 2).map((p, i) => (
            <div key={i} className="absolute transition-all duration-300 ease-out" style={{ ...p, background: TOUR_DIM }} />
          ))
        ) : (
          <div className="absolute inset-0" style={{ background: TOUR_DIM }} />
        )}
      </div>

      {/* Top status: a thin accent line plus a centered label, marking tour mode
          the whole time without touching the page content. */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[1350] flex flex-col items-center">
        <div
          className="h-[3px] w-full"
          style={{
            background:
              'linear-gradient(90deg, transparent, var(--accent-primary) 20%, var(--accent-primary) 80%, transparent)',
          }}
        />
        <div className="flex items-center gap-2 rounded-b-lg bg-[var(--accent-primary)] px-3 py-1 text-[11px] font-semibold text-white shadow-md">
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
          Guided tour in progress
        </div>
      </div>

      {/* Soft highlight ring that gently breathes, purely to point the eye. */}
      {rect && (
        <div
          aria-hidden
          className="tour-animated pointer-events-none fixed z-[1300] rounded-xl transition-all duration-300 ease-out"
          style={{
            top: rect.top - RING_PADDING,
            left: rect.left - RING_PADDING,
            width: rect.width + RING_PADDING * 2,
            height: rect.height + RING_PADDING * 2,
            outline: '2px solid var(--accent-primary)',
            outlineOffset: '2px',
            boxShadow: '0 0 0 4px rgba(37, 99, 235, 0.20), 0 8px 24px rgba(37, 99, 235, 0.16)',
            animation: 'tour-ring-pulse 2s ease-in-out infinite',
          }}
        />
      )}

      {/* Narration card, with a nudge callout that appears above it when the
          user navigates away and the tour brings them back. */}
      <div className="fixed bottom-6 right-6 z-[1400] flex w-[360px] max-w-[calc(100vw-32px)] flex-col gap-2.5">
        {nudge && (
          <div
            role="status"
            className="tour-animated self-end rounded-xl bg-[var(--accent-primary)] p-3.5 text-white shadow-[var(--shadow-hover)]"
            style={{ animation: 'tour-fade-up 0.25s ease-out both' }}
          >
            <p className="text-sm font-medium leading-relaxed">
              The tour is guiding you, so it brought you back here. To click around the
              app yourself, exit the tour first.
            </p>
            <div className="mt-3 flex items-center justify-end gap-2.5">
              <button
                onClick={stop}
                className="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-[var(--accent-primary)] transition-colors hover:bg-blue-50"
              >
                Exit tour
              </button>
              <span className="flex items-center gap-1 text-xs text-blue-100">
                or keep going
                <ArrowDown size={15} className="animate-bounce text-white" />
              </span>
            </div>
          </div>
        )}

        <div
          role="dialog"
          aria-label="Guided tour"
          aria-live="polite"
          className="relative w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-[var(--shadow-hover)]"
        >
        <button
          onClick={stop}
          aria-label="Close tour"
          className="absolute right-3 top-3 rounded-lg p-1 text-[var(--text-muted)] transition-colors hover:bg-slate-100 hover:text-[var(--text-primary)]"
        >
          <X size={16} />
        </button>

        <p className="text-xs font-medium text-[var(--accent-primary)]">
          Step {stepIndex + 1} of {stepCount}
        </p>
        <h3 className="mt-1 pr-6 text-base font-bold text-[var(--text-primary)]">{step.title}</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-slate-700">{step.body}</p>

        {/* Progress bar */}
        <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-[var(--accent-primary)] transition-all duration-300"
            style={{ width: `${((stepIndex + 1) / stepCount) * 100}%` }}
          />
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <Button variant="ghost" size="sm" onClick={restart}>
            Reset tour
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={back} disabled={isFirst}>
              Back
            </Button>
            <Button variant="primary" size="sm" onClick={handleNext}>
              {isLast ? 'Finish' : 'Next'}
            </Button>
          </div>
        </div>

        {/* Keyboard hint: teach how to move and how to leave. */}
        <p className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-[var(--text-muted)]">
          <Kbd>←</Kbd>
          <Kbd>→</Kbd>
          <span>to move</span>
          <span className="text-[var(--border)]">·</span>
          <Kbd>Esc</Kbd>
          <span>to exit the tour</span>
        </p>
        </div>
      </div>
    </>
  )
}
