/**
 * Security & Input Sanitization Utilities
 * Defends against XSS, prototype pollution, non-finite monetary values, and overflows.
 * Note: Does NOT double-escape entities (like & to &amp;) so React safely escapes strings on render without double-encoding artifacts.
 */

/**
 * Strips HTML tags, script injection patterns, control characters, and enforces length bounds.
 */
export function sanitizeText(value: unknown, maxLength = 120): string {
  if (typeof value !== 'string') return ''

  // 1. Strip all HTML / script tags
  // 2. Strip non-printable ASCII control characters (0x00-0x1F, 0x7F)
  const cleaned = value
    .replace(/<[^>]*>?/gm, '')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F\x7F]/g, '')
    .trim()

  return cleaned.slice(0, maxLength)
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
