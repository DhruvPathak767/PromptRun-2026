import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { FinanceProvider } from '../state/FinanceProvider'
import { useFinance } from '../state/useFinance'
import React from 'react'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <FinanceProvider>{children}</FinanceProvider>
)

describe('Finance State & Reducer Integration', () => {
  it('initializes with ₹10,000 budget and valid Day 12 cycle position', () => {
    const { result } = renderHook(() => useFinance(), { wrapper })

    expect(result.current.state.openingBudget).toBe(10000)
    expect(result.current.state.currentDay).toBe(12)
    expect(result.current.metrics.daysRemaining).toBe(18)
    expect(result.current.metrics.cashBalance).toBeGreaterThan(0)
    expect(result.current.metrics.safeDailyAllowance).toBeGreaterThan(0)
  })

  it('records a new expense and immediately updates cash balance and allowance', () => {
    const { result } = renderHook(() => useFinance(), { wrapper })

    const initialCash = result.current.metrics.cashBalance

    act(() => {
      result.current.addTransaction({
        description: 'Test Textbook Purchase',
        amount: 800,
        category: 'Learning & Books',
        type: 'expense',
        isFixed: false,
        cycleDay: 12,
        date: 'Day 12 • Added',
      })
    })

    expect(result.current.metrics.cashBalance).toBe(initialCash - 800)
  })

  it('records income and correctly increases liquid cash', () => {
    const { result } = renderHook(() => useFinance(), { wrapper })

    const initialCash = result.current.metrics.cashBalance

    act(() => {
      result.current.addTransaction({
        description: 'Freelance Design Gig',
        amount: 1500,
        category: 'Tech & Subscriptions',
        type: 'income',
        isFixed: false,
        cycleDay: 12,
        date: 'Day 12 • Added',
      })
    })

    expect(result.current.metrics.cashBalance).toBe(initialCash + 1500)
  })

  it('marks a scheduled commitment as paid and transitions it to a completed transaction without double counting', () => {
    const { result } = renderHook(() => useFinance(), { wrapper })

    const unpaidCommitments = result.current.state.commitments.filter((c) => !c.isPaid)
    if (unpaidCommitments.length > 0) {
      const target = unpaidCommitments[0]
      const initialCash = result.current.metrics.cashBalance

      act(() => {
        result.current.markCommitmentPaid(target.id, 12)
      })

      // Cash balance decreases by the paid amount
      expect(result.current.metrics.cashBalance).toBe(initialCash - target.amount)
      // Commitment is marked as paid
      const updated = result.current.state.commitments.find((c) => c.id === target.id)
      expect(updated?.isPaid).toBe(true)
    }
  })
})
