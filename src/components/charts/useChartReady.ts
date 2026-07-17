import { useEffect, useRef, useState } from 'react'

// Recharts' ResponsiveContainer logs "width(-1)/height(-1)" for two separate
// reasons: (1) its parent may not be laid out yet, and (2) even once the parent
// is sized, ResponsiveContainer's own internal state always starts at
// { width: -1, height: -1 } (its `initialDimension` default) and warns on that
// very first render, before its own measuring effect runs. This hook fixes both:
// it gates rendering until our own container has a real size, and exposes that
// size so callers can pass it as ResponsiveContainer's `initialDimension`,
// seeding its first render with a real number instead of -1.
export function useChartReady<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)
  const [state, setState] = useState({ ready: false, size: { width: -1, height: -1 } })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const check = () => {
      const { clientWidth: width, clientHeight: height } = el
      if (width > 0 && height > 0) {
        setState((prev) => (prev.ready ? prev : { ready: true, size: { width, height } }))
      }
    }
    check()
    const ro = new ResizeObserver(check)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return { ref, ready: state.ready, size: state.size }
}
