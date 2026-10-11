import {
  type RupeeFlowState,
  type SimulatedScenario,
  type SimulationComparison,
  type Transaction,
  type Commitment,
  type Subscription,
} from './financeTypes'
import { calculateFinancialMetrics } from './financeEngine'

export const PRESET_SCENARIOS: SimulatedScenario[] = [
  {
    id: 'preset-sneakers',
    type: 'purchase',
    title: 'Buy sneakers for ₹2,499',
    description: 'One-time discretionary shopping purchase right now',
    amount: 2499,
    category: 'Shopping & Apparel',
  },
  {
    id: 'preset-sub-ott',
    type: 'add_subscription',
    title: 'Start a ₹399/month OTT subscription',
    description: 'Add a new monthly streaming service starting on Day 15',
    amount: 399,
    category: 'Tech & Subscriptions',
    dueDay: 15,
  },
  {
    id: 'preset-emergency',
    type: 'unexpected_expense',
    title: 'Handle an unexpected ₹1,800 medical/bike repair',
    description: 'Sudden unexpected expense on today’s budget',
    amount: 1800,
    category: 'Unexpected & Emergency',
  },
  {
    id: 'preset-savings',
    type: 'savings_contribution',
    title: 'Put ₹1,000 into Emergency Buffer',
    description: 'Lock away ₹1,000 liquid cash into your safety net goal',
    amount: 1000,
  },
  {
    id: 'preset-freelance',
    type: 'add_income',
    title: 'Receive ₹2,000 in freelance income',
    description: 'Bonus cash injection from side gig or stipend',
    amount: 2000,
  },
  {
    id: 'preset-cancel-sub',
    type: 'cancel_subscription',
    title: 'Cancel Spotify Premium (₹119/mo)',
    description: 'Stop future recurring subscription charges',
    amount: 119,
  },
]

/**
 * Deep clones state and applies hypothetical changes to calculate simulated outcomes.
 * Pure and non-destructive.
 */
export function simulateScenario(
  state: RupeeFlowState,
  scenario: SimulatedScenario
): SimulationComparison {
  const baseline = calculateFinancialMetrics(state)

  // Create a deep copy of state for hypothetical evaluation
  const clonedState: RupeeFlowState = {
    ...state,
    transactions: [...state.transactions],
    commitments: state.commitments.map((c) => ({ ...c })),
    subscriptions: state.subscriptions.map((s) => ({ ...s })),
    goals: state.goals.map((g) => ({ ...g })),
    activeSimulation: scenario,
  }

  const currentDay = clonedState.currentDay

  switch (scenario.type) {
    case 'purchase':
    case 'unexpected_expense': {
      if (scenario.amount > 0) {
        const hypotheticalTx: Transaction = {
          id: `hypothetical-tx-${Date.now()}`,
          cycleDay: currentDay,
          date: `Day ${currentDay} • Simulated`,
          amount: scenario.amount,
          description: scenario.title || 'Simulated Purchase',
          category: scenario.category || (scenario.type === 'unexpected_expense' ? 'Unexpected & Emergency' : 'Shopping & Apparel'),
          type: 'expense',
          isFixed: false,
          note: scenario.description,
        }
        clonedState.transactions.push(hypotheticalTx)
      }
      break
    }

    case 'add_income': {
      if (scenario.amount > 0) {
        const hypotheticalIncome: Transaction = {
          id: `hypothetical-income-${Date.now()}`,
          cycleDay: currentDay,
          date: `Day ${currentDay} • Simulated`,
          amount: scenario.amount,
          description: scenario.title || 'Simulated Additional Income',
          category: 'Groceries & Essentials',
          type: 'income',
          isFixed: false,
          note: scenario.description,
        }
        clonedState.transactions.push(hypotheticalIncome)
      }
      break
    }

    case 'savings_contribution': {
      if (scenario.amount > 0) {
        // Target goal or first goal by default
        const targetGoal = clonedState.goals.find((g) => g.id === scenario.targetGoalId) || clonedState.goals[0]
        if (targetGoal) {
          targetGoal.currentAmount += scenario.amount
          const hypotheticalSavingsTx: Transaction = {
            id: `hypothetical-savings-${Date.now()}`,
            cycleDay: currentDay,
            date: `Day ${currentDay} • Simulated`,
            amount: scenario.amount,
            description: `Transfer to ${targetGoal.name}`,
            category: 'Learning & Books',
            type: 'savings_transfer',
            isFixed: false,
            relatedId: targetGoal.id,
          }
          clonedState.transactions.push(hypotheticalSavingsTx)
        }
      }
      break
    }

    case 'add_subscription': {
      if (scenario.amount > 0) {
        const billingDay = scenario.dueDay || Math.min(28, currentDay + 5)
        const hypotheticalSub: Subscription = {
          id: `hypothetical-sub-${Date.now()}`,
          name: scenario.title || 'New Subscription',
          price: scenario.amount,
          billingDay,
          category: scenario.category || 'Tech & Subscriptions',
          active: true,
        }
        clonedState.subscriptions.push(hypotheticalSub)
      }
      break
    }

    case 'cancel_subscription': {
      if (scenario.targetSubscriptionId) {
        const sub = clonedState.subscriptions.find((s) => s.id === scenario.targetSubscriptionId)
        if (sub) {
          sub.active = false
        }
      } else {
        // Cancel first active subscription if not specified
        const sub = clonedState.subscriptions.find((s) => s.active)
        if (sub) {
          sub.active = false
        }
      }
      break
    }

    case 'add_commitment': {
      if (scenario.amount > 0) {
        const dueDay = scenario.dueDay || Math.min(30, currentDay + 3)
        const hypotheticalCommitment: Commitment = {
          id: `hypothetical-commit-${Date.now()}`,
          name: scenario.title || 'Planned Bill',
          amount: scenario.amount,
          dueDay,
          category: scenario.category || 'Tech & Subscriptions',
          isPaid: false,
        }
        clonedState.commitments.push(hypotheticalCommitment)
      }
      break
    }

    case 'adjust_savings_plan': {
      if (scenario.amount > 0 && scenario.targetGoalId) {
        const goal = clonedState.goals.find((g) => g.id === scenario.targetGoalId)
        if (goal) {
          goal.plannedCycleContribution = scenario.amount
        }
      }
      break
    }
  }

  const simulated = calculateFinancialMetrics(clonedState)

  // Calculate deltas
  const cashBalanceDelta = simulated.cashBalance - baseline.cashBalance
  const discretionaryDelta = simulated.availableDiscretionaryFunds - baseline.availableDiscretionaryFunds
  const dailyAllowanceDelta = simulated.safeDailyAllowance - baseline.safeDailyAllowance
  const commitmentsDelta = simulated.upcomingCommitmentsTotal - baseline.upcomingCommitmentsTotal
  const savingsDelta = simulated.savingsBalance - baseline.savingsBalance
  const monthEndDelta = simulated.projectedMonthEndCash - baseline.projectedMonthEndCash
  const healthScoreDelta = simulated.healthScore - baseline.healthScore
  const healthBandChanged = simulated.healthBand !== baseline.healthBand

  // Generate plain-language consequence explanations grounded in calculation results
  const explanations: Array<{ type: 'positive' | 'negative' | 'neutral'; text: string }> = []

  if (cashBalanceDelta < 0) {
    explanations.push({
      type: 'negative',
      text: `Immediately reduces your liquid cash balance by ₹${Math.abs(Math.round(cashBalanceDelta))}.`,
    })
  } else if (cashBalanceDelta > 0) {
    explanations.push({
      type: 'positive',
      text: `Increases liquid cash balance by ₹${Math.round(cashBalanceDelta)}.`,
    })
  }

  if (dailyAllowanceDelta < 0) {
    explanations.push({
      type: 'negative',
      text: `Lowers your safe daily spending allowance by ₹${Math.abs(Math.round(dailyAllowanceDelta))}/day for the remaining ${baseline.inclusiveDaysRemaining} days.`,
    })
  } else if (dailyAllowanceDelta > 0) {
    explanations.push({
      type: 'positive',
      text: `Expands your safe daily spending allowance by ₹${Math.round(dailyAllowanceDelta)}/day for the remaining ${baseline.inclusiveDaysRemaining} days.`,
    })
  }

  if (savingsDelta > 0) {
    explanations.push({
      type: 'positive',
      text: `Boosts your savings reserves by ₹${Math.round(savingsDelta)}, accelerating goal completion without counting as an expense.`,
    })
  }

  if (commitmentsDelta > 0) {
    explanations.push({
      type: 'negative',
      text: `Locks ₹${Math.round(commitmentsDelta)} into recurring upcoming commitments for the remainder of this cycle.`,
    })
  } else if (commitmentsDelta < 0) {
    explanations.push({
      type: 'positive',
      text: `Frees up ₹${Math.abs(Math.round(commitmentsDelta))} from upcoming obligations, preserving future cash.`,
    })
  }

  if (monthEndDelta < 0) {
    explanations.push({
      type: monthEndDelta < -1000 ? 'negative' : 'neutral',
      text: `Reduces projected Day 30 finish by ₹${Math.abs(Math.round(monthEndDelta))} (from ₹${Math.round(baseline.projectedMonthEndCash)} to ₹${Math.round(simulated.projectedMonthEndCash)}).`,
    })
  } else if (monthEndDelta > 0) {
    explanations.push({
      type: 'positive',
      text: `Improves projected Day 30 finish by ₹${Math.round(monthEndDelta)} (projected ₹${Math.round(simulated.projectedMonthEndCash)} safely remaining).`,
    })
  }

  if (healthScoreDelta < 0) {
    explanations.push({
      type: 'negative',
      text: `Health Score drops by ${Math.abs(healthScoreDelta)} pts (${baseline.healthBand} → ${simulated.healthBand}).`,
    })
  } else if (healthScoreDelta > 0) {
    explanations.push({
      type: 'positive',
      text: `Health Score climbs by +${healthScoreDelta} pts (${baseline.healthBand} → ${simulated.healthBand}).`,
    })
  }

  // Determine affordability
  const isAffordable = simulated.availableDiscretionaryFunds >= 0 && simulated.cashBalance >= 0

  let warningNotice: string | undefined
  if (!isAffordable) {
    if (simulated.cashBalance < 0) {
      warningNotice = `Critical Overdraft: This decision causes an immediate cash shortfall of ₹${Math.abs(Math.round(simulated.cashBalance))}.`
    } else {
      warningNotice = `Discretionary Shortfall: While cash is positive, this decision leaves insufficient funds (deficit of ₹${Math.abs(Math.round(simulated.availableDiscretionaryFunds))}) to cover upcoming commitments & planned savings.`
    }
  }

  return {
    baseline,
    simulated,
    scenario,
    deltas: {
      cashBalanceDelta,
      discretionaryDelta,
      dailyAllowanceDelta,
      commitmentsDelta,
      savingsDelta,
      monthEndDelta,
      healthScoreDelta,
      healthBandChanged,
    },
    explanations,
    isAffordable,
    warningNotice,
  }
}

/**
 * Commits a simulated scenario into the real persistent application state.
 * Returns the updated state without duplicates.
 */
export function applyScenarioToState(
  state: RupeeFlowState,
  scenario: SimulatedScenario
): RupeeFlowState {
  const currentDay = state.currentDay
  const newState: RupeeFlowState = {
    ...state,
    transactions: [...state.transactions],
    commitments: [...state.commitments],
    subscriptions: [...state.subscriptions],
    goals: [...state.goals],
    activeSimulation: null,
    lastUpdated: new Date().toISOString(),
  }

  switch (scenario.type) {
    case 'purchase':
    case 'unexpected_expense': {
      if (scenario.amount > 0) {
        const newTx: Transaction = {
          id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          cycleDay: currentDay,
          date: `Day ${currentDay} • Committed`,
          amount: scenario.amount,
          description: scenario.title,
          category: scenario.category || (scenario.type === 'unexpected_expense' ? 'Unexpected & Emergency' : 'Shopping & Apparel'),
          type: 'expense',
          isFixed: false,
          note: scenario.description,
        }
        newState.transactions.unshift(newTx)
      }
      break
    }

    case 'add_income': {
      if (scenario.amount > 0) {
        const newTx: Transaction = {
          id: `tx-inc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          cycleDay: currentDay,
          date: `Day ${currentDay} • Income`,
          amount: scenario.amount,
          description: scenario.title,
          category: 'Groceries & Essentials',
          type: 'income',
          isFixed: false,
          note: scenario.description,
        }
        newState.transactions.unshift(newTx)
      }
      break
    }

    case 'savings_contribution': {
      if (scenario.amount > 0) {
        const targetGoal = newState.goals.find((g) => g.id === scenario.targetGoalId) || newState.goals[0]
        if (targetGoal) {
          targetGoal.currentAmount += scenario.amount
          const newTx: Transaction = {
            id: `tx-sav-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            cycleDay: currentDay,
            date: `Day ${currentDay} • Savings`,
            amount: scenario.amount,
            description: `Transfer to ${targetGoal.name}`,
            category: 'Learning & Books',
            type: 'savings_transfer',
            isFixed: false,
            relatedId: targetGoal.id,
          }
          newState.transactions.unshift(newTx)
        }
      }
      break
    }

    case 'add_subscription': {
      if (scenario.amount > 0) {
        const billingDay = scenario.dueDay || Math.min(28, currentDay + 5)
        const newSub: Subscription = {
          id: `sub-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          name: scenario.title,
          price: scenario.amount,
          billingDay,
          category: scenario.category || 'Tech & Subscriptions',
          active: true,
        }
        newState.subscriptions.push(newSub)
      }
      break
    }

    case 'cancel_subscription': {
      if (scenario.targetSubscriptionId) {
        const sub = newState.subscriptions.find((s) => s.id === scenario.targetSubscriptionId)
        if (sub) {
          sub.active = false
        }
      } else {
        const sub = newState.subscriptions.find((s) => s.active)
        if (sub) {
          sub.active = false
        }
      }
      break
    }

    case 'add_commitment': {
      if (scenario.amount > 0) {
        const dueDay = scenario.dueDay || Math.min(30, currentDay + 3)
        const newCommit: Commitment = {
          id: `comm-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          name: scenario.title,
          amount: scenario.amount,
          dueDay,
          category: scenario.category || 'Tech & Subscriptions',
          isPaid: false,
        }
        newState.commitments.push(newCommit)
      }
      break
    }

    case 'adjust_savings_plan': {
      if (scenario.amount > 0 && scenario.targetGoalId) {
        const goal = newState.goals.find((g) => g.id === scenario.targetGoalId)
        if (goal) {
          goal.plannedCycleContribution = scenario.amount
        }
      }
      break
    }
  }

  return newState
}
