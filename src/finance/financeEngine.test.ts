import { describe, it, expect } from 'vitest'
import { calculateFinancialMetrics, formatRupees, getUpcomingCommitments } from './financeEngine'
import { simulateScenario, applyScenarioToState } from './scenarioEngine'
import { type RupeeFlowState } from './financeTypes'

function createTestState(overrides?: Partial<RupeeFlowState>): RupeeFlowState {
  return {
    version: 1,
    currentDay: 10,
    openingBudget: 10000,
    transactions: [],
    commitments: [],
    subscriptions: [],
    goals: [],
    activeSimulation: null,
    lastUpdated: new Date().toISOString(),
    ...overrides,
  }
}

describe('RupeeFlow Finance Engine', () => {
  it('correctly calculates initial pristine state with ₹10,000 opening budget', () => {
    const state = createTestState({ currentDay: 1 })
    const metrics = calculateFinancialMetrics(state)

    expect(metrics.openingBudget).toBe(10000)
    expect(metrics.cashBalance).toBe(10000)
    expect(metrics.totalExpenses).toBe(0)
    expect(metrics.totalIncome).toBe(0)
    expect(metrics.savingsBalance).toBe(0)
    expect(metrics.availableDiscretionaryFunds).toBe(10000)
    expect(metrics.inclusiveDaysRemaining).toBe(30)
    expect(metrics.safeDailyAllowance).toBe(Math.floor(10000 / 30))
    expect(metrics.healthBand).toBe('Healthy')
  })

  it('correctly updates cash and allowances when expenses occur', () => {
    const state = createTestState({
      currentDay: 10,
      transactions: [
        {
          id: 'tx-1',
          cycleDay: 5,
          date: 'Day 5',
          amount: 2000,
          description: 'Grocery run',
          category: 'Groceries & Essentials',
          type: 'expense',
          isFixed: false,
        },
      ],
    })

    const metrics = calculateFinancialMetrics(state)
    expect(metrics.cashBalance).toBe(8000)
    expect(metrics.totalExpenses).toBe(2000)
    expect(metrics.inclusiveDaysRemaining).toBe(21) // Days 10..30 = 21 days
    expect(metrics.availableDiscretionaryFunds).toBe(8000)
    expect(metrics.safeDailyAllowance).toBe(Math.floor(8000 / 21))
  })

  it('correctly isolates savings contributions from expense calculations', () => {
    const state = createTestState({
      currentDay: 10,
      goals: [
        {
          id: 'goal-emergency',
          name: 'Emergency Cushion',
          targetAmount: 5000,
          currentAmount: 1500,
          plannedCycleContribution: 2000,
          color: '#C8FF4D',
          category: 'Safety Net',
          iconName: 'Shield',
          description: '',
        },
      ],
      transactions: [
        {
          id: 'tx-savings-1',
          cycleDay: 6,
          date: 'Day 6',
          amount: 1500,
          description: 'Deposit to Emergency Cushion',
          category: 'Unexpected & Emergency',
          type: 'savings_transfer',
          isFixed: false,
          relatedId: 'goal-emergency',
        },
      ],
    })

    const metrics = calculateFinancialMetrics(state)
    // Cash balance is reduced by transfer: 10000 - 1500 = 8500
    expect(metrics.cashBalance).toBe(8500)
    // Total expenses should still be 0!
    expect(metrics.totalExpenses).toBe(0)
    // Savings balance is 1500
    expect(metrics.savingsBalance).toBe(1500)
    // Total remaining funds (liquid + savings) is preserved at 10000
    expect(metrics.totalRemainingFunds).toBe(10000)
    // Outstanding planned savings: planned 2000 - contributed 1500 = 500
    expect(metrics.outstandingPlannedSavingsTotal).toBe(500)
    // Available discretionary: cash (8500) - outstanding planned (500) = 8000
    expect(metrics.availableDiscretionaryFunds).toBe(8000)
  })

  it('deduplicates commitments and active subscriptions properly', () => {
    const state = createTestState({
      currentDay: 10,
      subscriptions: [
        {
          id: 'sub-spotify',
          name: 'Spotify Premium',
          price: 119,
          billingDay: 15,
          category: 'Tech & Subscriptions',
          active: true,
        },
        {
          id: 'sub-netflix',
          name: 'Netflix',
          price: 199,
          billingDay: 5, // Already passed!
          category: 'Tech & Subscriptions',
          active: true,
        },
      ],
      commitments: [
        {
          id: 'comm-wifi',
          name: 'Wi-Fi Bill',
          amount: 500,
          dueDay: 20,
          category: 'Tech & Subscriptions',
          isPaid: false,
        },
      ],
    })

    const commitments = getUpcomingCommitments(state)
    // Netflix billing day 5 is in the past, so only Spotify (due day 15) and Wi-Fi (due day 20) are upcoming
    expect(commitments.length).toBe(2)
    const total = commitments.reduce((sum, c) => sum + c.amount, 0)
    expect(total).toBe(500 + 119)
  })

  it('handles negative discretionary funds without reporting misleading allowance', () => {
    const state = createTestState({
      currentDay: 15,
      transactions: [
        {
          id: 'tx-big',
          cycleDay: 10,
          date: 'Day 10',
          amount: 9500,
          description: 'Large purchase',
          category: 'Shopping & Apparel',
          type: 'expense',
          isFixed: false,
        },
      ],
      commitments: [
        {
          id: 'comm-rent',
          name: 'Rent share',
          amount: 1500,
          dueDay: 25,
          category: 'Tech & Subscriptions',
          isPaid: false,
        },
      ],
    })

    const metrics = calculateFinancialMetrics(state)
    // Cash: 10000 - 9500 = 500
    expect(metrics.cashBalance).toBe(500)
    // Upcoming: 1500 -> Discretionary: 500 - 1500 = -1000
    expect(metrics.availableDiscretionaryFunds).toBe(-1000)
    // Safe daily allowance must be 0, never negative or misleadingly positive!
    expect(metrics.safeDailyAllowance).toBe(0)
    expect(metrics.healthBand).toBe('High Risk')
  })

  it('formats Indian rupee notation correctly', () => {
    expect(formatRupees(10000)).toBe('₹10,000')
    expect(formatRupees(2499)).toBe('₹2,499')
    expect(formatRupees(150000)).toBe('₹1,50,000')
    expect(formatRupees(-500)).toBe('-₹500')
  })
})

describe('RupeeFlow Scenario Simulator', () => {
  it('performs non-destructive hypothetical simulations without altering baseline state', () => {
    const state = createTestState({ currentDay: 12 })
    const comparison = simulateScenario(state, {
      id: 'test-purchase',
      type: 'purchase',
      title: 'Buy sneakers for ₹2,499',
      description: 'Discretionary spend test',
      amount: 2499,
      category: 'Shopping & Apparel',
    })

    // Baseline remains untouched at 10000
    expect(comparison.baseline.cashBalance).toBe(10000)
    expect(comparison.baseline.safeDailyAllowance).toBe(Math.floor(10000 / 19))

    // Simulated reflects the 2499 deduction
    expect(comparison.simulated.cashBalance).toBe(7501)
    expect(comparison.deltas.cashBalanceDelta).toBe(-2499)
    expect(comparison.deltas.dailyAllowanceDelta).toBeLessThan(0)
    expect(comparison.explanations.length).toBeGreaterThan(0)
    expect(comparison.isAffordable).toBe(true)

    // Original state array remains unmutated
    expect(state.transactions.length).toBe(0)
  })

  it('accurately commits a simulation to state when applied', () => {
    const state = createTestState({ currentDay: 12 })
    const scenario = {
      id: 'test-purchase',
      type: 'purchase' as const,
      title: 'Sneakers',
      description: 'Test sneakers',
      amount: 2499,
      category: 'Shopping & Apparel' as const,
    }

    const nextState = applyScenarioToState(state, scenario)
    expect(nextState.transactions.length).toBe(1)
    expect(nextState.transactions[0].amount).toBe(2499)
    expect(nextState.transactions[0].description).toBe('Sneakers')

    const newMetrics = calculateFinancialMetrics(nextState)
    expect(newMetrics.cashBalance).toBe(7501)
  })

  it('guarantees deterministic output for repeated simulation calculations', () => {
    const state = createTestState({ currentDay: 15 })
    const scenario = {
      id: 'test-deterministic',
      type: 'unexpected_expense' as const,
      title: 'Emergency Dentist',
      description: 'Emergency dental visit',
      amount: 1500,
      category: 'Unexpected & Emergency' as const,
    }

    const sim1 = simulateScenario(state, scenario)
    const sim2 = simulateScenario(state, scenario)

    expect(sim1.simulated.cashBalance).toBe(sim2.simulated.cashBalance)
    expect(sim1.deltas.cashBalanceDelta).toBe(sim2.deltas.cashBalanceDelta)
    expect(sim1.deltas.dailyAllowanceDelta).toBe(sim2.deltas.dailyAllowanceDelta)
    expect(sim1.simulated.availableDiscretionaryFunds).toBe(sim2.simulated.availableDiscretionaryFunds)
  })

  it('tests all scenario types: income, savings, add sub, cancel sub, commitment, adjust plan', () => {
    const state = createTestState({
      currentDay: 10,
      goals: [
        {
          id: 'goal-laptop',
          name: 'Tech Upgrade',
          targetAmount: 5000,
          currentAmount: 500,
          plannedCycleContribution: 1000,
          color: '#C8FF4D',
          category: 'Tech',
          iconName: 'Laptop',
          description: '',
        },
      ],
      subscriptions: [
        {
          id: 'sub-gym',
          name: 'Gym',
          price: 500,
          billingDay: 20,
          category: 'Personal Care',
          active: true,
        },
      ],
      transactions: [
        {
          id: 'hist-tx-1',
          cycleDay: 2,
          date: 'Day 2',
          amount: 500,
          description: 'Past Gym payment',
          category: 'Personal Care',
          type: 'bill_payment',
          isFixed: true,
        },
      ],
    })

    // 1. Add Income
    const incomeSim = simulateScenario(state, {
      id: 'sim-inc',
      type: 'add_income',
      title: 'Stipend',
      description: 'Monthly stipend',
      amount: 1000,
    })
    expect(incomeSim.deltas.cashBalanceDelta).toBe(1000)

    // 2. Savings Contribution
    const savingsSim = simulateScenario(state, {
      id: 'sim-sav',
      type: 'savings_contribution',
      title: 'Save to Tech',
      description: 'Savings top-up',
      amount: 500,
      targetGoalId: 'goal-laptop',
    })
    expect(savingsSim.deltas.savingsDelta).toBe(500)

    // 3. Add Subscription
    const addSubSim = simulateScenario(state, {
      id: 'sim-new-sub',
      type: 'add_subscription',
      title: 'ChatGPT Plus',
      description: 'AI subscription',
      amount: 199,
      dueDay: 25,
    })
    expect(addSubSim.deltas.commitmentsDelta).toBe(199)

    // 4. Cancel Subscription (Must remove future liability without deleting historical transactions!)
    const cancelSubSim = simulateScenario(state, {
      id: 'sim-cancel-sub',
      type: 'cancel_subscription',
      title: 'Cancel Gym',
      description: 'Cancel gym membership',
      amount: 0,
      targetSubscriptionId: 'sub-gym',
    })
    expect(cancelSubSim.deltas.commitmentsDelta).toBe(-500)
    // Historical transaction preserved in baseline
    expect(state.transactions.length).toBe(1)

    // 5. Add Commitment
    const addCommitSim = simulateScenario(state, {
      id: 'sim-commit',
      type: 'add_commitment',
      title: 'Electricity Bill',
      description: 'Hostel power bill',
      amount: 450,
      dueDay: 22,
    })
    expect(addCommitSim.deltas.commitmentsDelta).toBe(450)

    // 6. Adjust Savings Plan
    const adjustPlanSim = simulateScenario(state, {
      id: 'sim-adjust',
      type: 'adjust_savings_plan',
      title: 'Increase planned savings',
      description: 'Budget re-allocation',
      amount: 1500,
      targetGoalId: 'goal-laptop',
    })
    expect(adjustPlanSim.simulated.outstandingPlannedSavingsTotal).toBe(1500)
  })

  it('correctly handles Day 1 and Day 30 boundary invariants', () => {
    // Day 1
    const day1State = createTestState({ currentDay: 1 })
    const day1Metrics = calculateFinancialMetrics(day1State)
    expect(day1Metrics.inclusiveDaysRemaining).toBe(30)
    expect(day1Metrics.safeDailyAllowance).toBe(Math.floor(10000 / 30))

    // Day 30 (Final Day)
    const day30State = createTestState({ currentDay: 30 })
    const day30Metrics = calculateFinancialMetrics(day30State)
    expect(day30Metrics.inclusiveDaysRemaining).toBe(1) // Only today remains
    expect(day30Metrics.safeDailyAllowance).toBe(10000) // All remaining discretionary available for day 30
  })
})
