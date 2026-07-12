import { useEffect, useRef, useState } from 'react'

// Recharts' ResponsiveContainer logs "width(-1)/height(-1)" when it measures a
// parent that has not been laid out yet (a common frame during route changes or
// inside animating containers). This gates the chart so it only renders once its
// container actually has a positive size, which also covers the SSR case.
export function useChartReady<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const check = () => {
      if (el.clientWidth > 0 && el.clientHeight > 0) setReady(true)
    }
    check()
    const ro = new ResizeObserver(check)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return { ref, ready }
}
