import { describe, it, expect } from 'vitest'
import {
  sanitizeText,
  sanitizeAmount,
  sanitizeCycleDay,
  sanitizeSafeObject,
} from '../lib/sanitize'

describe('Security & Data Sanitization Engine', () => {
  describe('sanitizeText', () => {
    it('strips HTML and script injection tags', () => {
      const malicious = '<script>alert("XSS")</script>Campus Lunch'
      const sanitized = sanitizeText(malicious)
      expect(sanitized).not.toContain('<script>')
      expect(sanitized).not.toContain('</script>')
      expect(sanitized).toContain('Campus Lunch')
    })

    it('preserves clean text without double-encoding entities so React renders cleanly', () => {
      const input = 'Pizza & Chai with Study Group'
      const output = sanitizeText(input)
      expect(output).toBe('Pizza & Chai with Study Group')
      expect(output).not.toContain('&amp;')
    })

    it('strips non-printable control characters', () => {
      const input = 'Canteen Lunch\x00\x1F\x07'
      const output = sanitizeText(input)
      expect(output).toBe('Canteen Lunch')
    })

    it('enforces maximum length bounds', () => {
      const longInput = 'A'.repeat(300)
      const output = sanitizeText(longInput, 50)
      expect(output.length).toBe(50)
    })

    it('handles non-string types safely', () => {
      expect(sanitizeText(null)).toBe('')
      expect(sanitizeText(undefined)).toBe('')
      expect(sanitizeText(12345)).toBe('')
    })
  })

  describe('sanitizeAmount', () => {
    it('accepts valid positive numbers', () => {
      const result = sanitizeAmount(2499)
      expect(result.valid).toBe(true)
      expect(result.amount).toBe(2499)
    })

    it('rejects negative amounts', () => {
      const result = sanitizeAmount(-500)
      expect(result.valid).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('rejects non-finite values like Infinity and NaN', () => {
      expect(sanitizeAmount(Infinity).valid).toBe(false)
      expect(sanitizeAmount(-Infinity).valid).toBe(false)
      expect(sanitizeAmount(NaN).valid).toBe(false)
      expect(sanitizeAmount('invalid_amount').valid).toBe(false)
    })

    it('enforces upper bound limits to prevent integer overflow', () => {
      const result = sanitizeAmount(5000000, 0, 100000)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('limit')
    })

    it('rounds to 2 decimal places to avoid float precision anomalies', () => {
      const result = sanitizeAmount(123.4567)
      expect(result.valid).toBe(true)
      expect(result.amount).toBe(123.46)
    })
  })

  describe('sanitizeCycleDay', () => {
    it('clamps days strictly between 1 and 30', () => {
      expect(sanitizeCycleDay(0)).toBe(1)
      expect(sanitizeCycleDay(-5)).toBe(1)
      expect(sanitizeCycleDay(15)).toBe(15)
      expect(sanitizeCycleDay(30)).toBe(30)
      expect(sanitizeCycleDay(31)).toBe(30)
      expect(sanitizeCycleDay(999)).toBe(30)
    })

    it('handles non-numeric day values gracefully', () => {
      expect(sanitizeCycleDay('abc')).toBe(1)
      expect(sanitizeCycleDay(null)).toBe(1)
    })
  })

  describe('sanitizeSafeObject', () => {
    it('blocks prototype pollution keys', () => {
      const malicious = JSON.parse('{"__proto__": {"polluted": true}, "name": "Safe Goal"}')
      const fallback = { name: 'Fallback' }
      const sanitized = sanitizeSafeObject(malicious, fallback)
      expect(sanitized.name).toBe('Safe Goal')
      expect(Object.prototype.hasOwnProperty.call(sanitized, '__proto__')).toBe(false)
    })
  })
})
