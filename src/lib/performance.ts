/**
 * Real User Monitoring (RUM) & Web Vitals Performance Utility
 * Tracks First Contentful Paint (FCP), Largest Contentful Paint (LCP),
 * Cumulative Layout Shift (CLS), and navigation timings.
 */

export interface PerformanceMetrics {
  fcp?: number
  lcp?: number
  cls?: number
  ttfb?: number
  domInteractive?: number
}

declare global {
  interface Window {
    __rupeeflow_vitals?: PerformanceMetrics
  }
}

export function initPerformanceMonitoring(): PerformanceMetrics {
  const metrics: PerformanceMetrics = {}

  if (typeof window === 'undefined' || !window.performance) {
    return metrics
  }

  // Navigation Timing & TTFB
  try {
    const navEntries = performance.getEntriesByType('navigation')
    if (navEntries.length > 0) {
      const nav = navEntries[0] as PerformanceNavigationTiming
      metrics.ttfb = Math.round(nav.responseStart - nav.requestStart)
      metrics.domInteractive = Math.round(nav.domInteractive)
    }
  } catch {
    // Graceful fallback on older browsers
  }

  // Paint Timings (FCP)
  try {
    const paintEntries = performance.getEntriesByType('paint')
    const fcpEntry = paintEntries.find((entry) => entry.name === 'first-contentful-paint')
    if (fcpEntry) {
      metrics.fcp = Math.round(fcpEntry.startTime)
    }
  } catch {
    // Ignore
  }

  // Observer for LCP & CLS
  if ('PerformanceObserver' in window) {
    try {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        const lastEntry = entries[entries.length - 1]
        if (lastEntry) {
          metrics.lcp = Math.round(lastEntry.startTime)
        }
      })
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })

      let clsValue = 0
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries() as unknown as Array<{ hadRecentInput?: boolean; value?: number }>) {
          if (!entry.hadRecentInput && typeof entry.value === 'number') {
            clsValue += entry.value
          }
        }
        metrics.cls = Math.round(clsValue * 1000) / 1000
      })
      clsObserver.observe({ type: 'layout-shift', buffered: true })
    } catch {
      // Ignore if observer type not supported
    }
  }

  window.__rupeeflow_vitals = metrics
  return metrics
}

/**
 * Performance mark helper for measuring specific execution spans
 */
export function markPerformanceSpan(spanName: string, callback: () => void): void {
  if (typeof window === 'undefined' || !window.performance?.mark) {
    callback()
    return
  }

  const startMark = `${spanName}-start`
  const endMark = `${spanName}-end`

  performance.mark(startMark)
  callback()
  performance.mark(endMark)

  try {
    performance.measure(spanName, startMark, endMark)
  } catch {
    // Ignore measurement collisions
  }
}
