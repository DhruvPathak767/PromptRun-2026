import { describe, it, expect } from 'vitest'
import {
  selectActiveSubscriptions,
  selectTotalMonthlySubCost,
  selectDailySubCost,
  selectCategorySpend,
  selectTransactionsTotal,
  selectHypotheticalDailyImpact,
  selectGoalProgressPercent,
  selectGoalRemainingTarget,
  selectChaiEquivalence,
  selectCommittedPercentage,
  selectDeficitCrashDay,
  selectUnpaidCommitmentsTotal,
  selectEmergencyBailoutMetrics,
} from './selectors'
import type { Subscription, Transaction, SavingsGoal, Commitment } from './financeTypes'

describe('Finance Selectors Engine', () => {
  const mockSubscriptions: Subscription[] = [
    { id: '1', name: 'Spotify', price: 119, billingDay: 5, category: 'Entertainment & Social', active: true },
    { id: '2', name: 'Gym', price: 500, billingDay: 12, category: 'Personal Care', active: false },
    { id: '3', name: 'WiFi', price: 499, billingDay: 20, category: 'Tech & Subscriptions', active: true },
  ]

  it('selects active subscriptions and computes total monthly cost accurately', () => {
    const active = selectActiveSubscriptions(mockSubscriptions)
    expect(active.length).toBe(2)
    expect(selectTotalMonthlySubCost(mockSubscriptions)).toBe(119 + 499)
  })

  it('calculates daily amortized subscription cost based on days remaining', () => {
    // 618 / 15 = 41.2 -> 41
    expect(selectDailySubCost(mockSubscriptions, 15)).toBe(41)
    // boundary: 0 days remaining should use 1 to prevent division by zero
    expect(selectDailySubCost(mockSubscriptions, 0)).toBe(618)
  })

  it('selects and aggregates category spend excluding income', () => {
    const mockTxs: Transaction[] = [
      { id: '1', cycleDay: 2, date: 'Day 2', amount: 300, description: 'Lunch', category: 'Food & Dining', type: 'expense', isFixed: false },
      { id: '2', cycleDay: 4, date: 'Day 4', amount: 150, description: 'Chai', category: 'Food & Dining', type: 'expense', isFixed: false },
      { id: '3', cycleDay: 5, date: 'Day 5', amount: 1000, description: 'Freelance', category: 'Tech & Subscriptions', type: 'income', isFixed: false },
      { id: '4', cycleDay: 6, date: 'Day 6', amount: 200, description: 'Bus pass', category: 'Transit & Commute', type: 'expense', isFixed: false },
    ]

    expect(selectCategorySpend(mockTxs, 'Food & Dining')).toBe(450)
    expect(selectCategorySpend(mockTxs, 'Transit & Commute')).toBe(200)
    expect(selectCategorySpend(mockTxs, 'Entertainment & Social')).toBe(0)
    expect(selectTransactionsTotal(mockTxs)).toBe(1650)
  })

  it('computes hypothetical daily allowance impact of an impulse purchase', () => {
    expect(selectHypotheticalDailyImpact(450, 15)).toBe(30)
    expect(selectHypotheticalDailyImpact(0, 15)).toBe(0)
  })

  it('computes goal progress percentage and remaining targets correctly', () => {
    expect(selectGoalProgressPercent(2500, 5000)).toBe(50)
    expect(selectGoalProgressPercent(6000, 5000)).toBe(100) // capped
    expect(selectGoalProgressPercent(0, 5000)).toBe(0)
    expect(selectGoalProgressPercent(500, 0)).toBe(100)

    expect(selectGoalRemainingTarget(2500, 5000)).toBe(2500)
    expect(selectGoalRemainingTarget(6000, 5000)).toBe(0)
  })

  it('computes Gen Z chai equivalence accurately', () => {
    expect(selectChaiEquivalence(400)).toBe(20)
    expect(selectChaiEquivalence(19)).toBe(1)
    expect(selectChaiEquivalence(0)).toBe(0)
  })

  it('computes committed budget percentage and projected deficit crash day', () => {
    expect(selectCommittedPercentage(3000, 2000, 1000, 10000)).toBe(60)
    expect(selectCommittedPercentage(0, 0, 0, 10000)).toBe(0)

    // Current day 10, cash 2000, spend 500/day -> 4 days runway -> crash day 14
    expect(selectDeficitCrashDay(10, 2000, 500)).toBe(14)
    // Sustainable: cash 5000, spend 100/day -> 50 days runway -> null (safely exceeds 30)
    expect(selectDeficitCrashDay(10, 5000, 100)).toBeNull()
  })

  it('computes unpaid commitments total', () => {
    const mockCommitments: Commitment[] = [
      { id: '1', name: 'Rent', amount: 2000, dueDay: 5, category: 'Personal Care', isPaid: true },
      { id: '2', name: 'Power', amount: 450, dueDay: 18, category: 'Tech & Subscriptions', isPaid: false },
    ]
    expect(selectUnpaidCommitmentsTotal(mockCommitments)).toBe(450)
  })

  it('computes emergency Broke Mode triage metrics', () => {
    const mockGoals: SavingsGoal[] = [
      {
        id: 'g1',
        name: 'Emergency Fund',
        targetAmount: 2000,
        currentAmount: 400,
        plannedCycleContribution: 500,
        color: '#C8FF4D',
        category: 'Safety',
        iconName: 'Shield',
        description: '',
      },
    ]

    const triage = selectEmergencyBailoutMetrics(mockSubscriptions, 200, 10, mockGoals)
    expect(triage.potentialSubSavings).toBe(618)
    expect(triage.emergencyGoalLiquidity).toBe(400)
    expect(triage.totalBufferRecoverable).toBeGreaterThan(1000)
  })
})
