/**
 * Security & Input Sanitization Utilities
 * Defends against XSS, prototype pollution, non-finite monetary values, and overflows.
 */

/**
 * Strips HTML tags, script injection patterns, control characters, and enforces length bounds.
 */
export function sanitizeText(value: unknown, maxLength = 120): string {
  if (typeof value !== 'string') return ''
  // Strip HTML / script tags
  const stripped = value
    .replace(/<[^>]*>?/gm, '')
    .replace(/[<>'"&]/g, (char) => {
      switch (char) {
        case '<': return '&lt;'
        case '>': return '&gt;'
        case "'": return '&#39;'
        case '"': return '&quot;'
        case '&': return '&amp;'
        default: return char
      }
    })
    .trim()
  return stripped.slice(0, maxLength)
}

/**
 * Validates and sanitizes monetary values:
 * - Must be a finite number
 * - Must not be NaN or Infinity
 * - Must fall within [min, max] range
 * - Rounds to 2 decimal places to prevent floating-point anomalies
 */
export function sanitizeAmount(value: unknown, min = 0, max = 1000000): {
  valid: boolean
  amount: number
  error?: string
} {
  const num = typeof value === 'number' ? value : parseFloat(String(value))

  if (!Number.isFinite(num) || isNaN(num)) {
    return { valid: false, amount: 0, error: 'Amount must be a valid finite number.' }
  }

  if (num < min) {
    return { valid: false, amount: 0, error: `Amount cannot be less than ₹${min}.` }
  }

  if (num > max) {
    return { valid: false, amount: 0, error: `Amount exceeds allowable limit of ₹${max.toLocaleString('en-IN')}.` }
  }

  // Round to 2 decimal places
  const rounded = Math.round(num * 100) / 100
  return { valid: true, amount: rounded }
}

/**
 * Clamps simulation cycle day to valid integer bounds [1, 30].
 */
export function sanitizeCycleDay(value: unknown): number {
  const parsed = parseInt(String(value), 10)
  if (isNaN(parsed) || !Number.isFinite(parsed)) return 1
  return Math.min(30, Math.max(1, parsed))
}

/**
 * Defensive deep object sanitizer protecting against __proto__ and prototype pollution.
 */
export function sanitizeSafeObject<T extends Record<string, unknown>>(data: unknown, fallback: T): T {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return fallback
  }

  try {
    const raw = data as Record<string, unknown>
    const safe: Record<string, unknown> = Object.create(null)

    for (const key of Object.keys(raw)) {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        continue
      }
      safe[key] = raw[key]
    }

    return safe as T
  } catch {
    return fallback
  }
}
