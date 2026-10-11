import {
  type RupeeFlowState,
  type FinancialMetrics,
  type Commitment,
  type ExpenseCategory,
  EXPENSE_CATEGORIES,
  CATEGORY_COLORS,
} from './financeTypes'
import { calculateHealthScore } from './riskEngine'

/**
 * Format currency in Indian standard format (Lakhs / Thousands grouping with ₹ symbol).
 */
export function formatRupees(
  amount: number,
  options?: { showSign?: boolean; compact?: boolean; hideSymbol?: boolean }
): string {
  const isNegative = amount < 0
  const absAmount = Math.abs(Math.round(amount))

  let formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(absAmount)

  if (options?.compact && absAmount >= 100000) {
    formatted = `${(absAmount / 100000).toFixed(1)}L`
  } else if (options?.compact && absAmount >= 1000) {
    formatted = `${(absAmount / 1000).toFixed(1)}k`
  }

  const symbol = options?.hideSymbol ? '' : '₹'
  if (options?.showSign) {
    return isNegative ? `-${symbol}${formatted}` : `+${symbol}${formatted}`
  }
  return isNegative ? `-${symbol}${formatted}` : `${symbol}${formatted}`
}

/**
 * Resolves upcoming obligations without double counting active subscriptions.
 * If a commitment is already explicitly recorded for a subscription, we do not add a duplicate subscription charge.
 */
export function getUpcomingCommitments(state: RupeeFlowState): Commitment[] {
  const currentDay = state.currentDay
  const result: Commitment[] = []

  // 1. Explicit unpaid commitments due on or after currentDay
  for (const c of state.commitments) {
    if (!c.isPaid && c.dueDay >= currentDay) {
      result.push(c)
    }
  }

  // 2. Active subscriptions with billingDay >= currentDay that are not already covered in commitments
  for (const sub of state.subscriptions) {
    if (!sub.active) continue
    if (sub.billingDay < currentDay) continue

    const alreadyRepresented = result.some(
      (c) => c.relatedSubscriptionId === sub.id || (c.name.toLowerCase() === sub.name.toLowerCase() && c.dueDay === sub.billingDay)
    )

    if (!alreadyRepresented) {
      result.push({
        id: `virtual-sub-${sub.id}`,
        name: `${sub.name} (Subscription)`,
        amount: sub.price,
        dueDay: sub.billingDay,
        category: sub.category,
        isPaid: false,
        relatedSubscriptionId: sub.id,
      })
    }
  }

  return result.sort((a, b) => a.dueDay - b.dueDay)
}

/**
 * Central mathematical calculation engine for RupeeFlow.
 * Pure function: takes immutable state, returns complete derived financial metrics.
 */
export function calculateFinancialMetrics(state: RupeeFlowState): FinancialMetrics {
  const openingBudget = state.openingBudget || 10000
  const currentDay = Math.min(30, Math.max(1, state.currentDay))

  // 1. Income received
  let totalIncome = 0
  // 2. Completed expenses & bill payments
  let totalExpenses = 0
  let totalVariableExpenses = 0
  // 3. Completed transfers into savings goals
  let totalSavingsTransfers = 0

  for (const tx of state.transactions) {
    if (tx.type === 'income') {
      totalIncome += tx.amount
    } else if (tx.type === 'expense' || tx.type === 'bill_payment') {
      totalExpenses += tx.amount
      if (!tx.isFixed && tx.type === 'expense') {
        totalVariableExpenses += tx.amount
      }
    } else if (tx.type === 'savings_transfer') {
      totalSavingsTransfers += tx.amount
    }
  }

  // Cash balance: Opening budget + additional income − completed expenses − transfers to savings
  const cashBalance = openingBudget + totalIncome - totalExpenses - totalSavingsTransfers

  // Savings balance: current holdings in savings goals
  let savingsBalance = 0
  for (const goal of state.goals) {
    savingsBalance += goal.currentAmount
  }

  // Total remaining funds: cash held + savings accumulated
  const totalRemainingFunds = cashBalance + savingsBalance

  // Upcoming commitments
  const unpaidCommitments = getUpcomingCommitments(state)
  const upcomingCommitmentsTotal = unpaidCommitments.reduce((sum, c) => sum + c.amount, 0)
  const upcomingCommitmentsCount = unpaidCommitments.length

  // Outstanding planned savings for this cycle
  // For each goal, compute remaining target contribution for this cycle
  let outstandingPlannedSavingsTotal = 0
  let totalPlannedCycleSavings = 0
  let totalSavingsContributedThisCycle = 0

  for (const goal of state.goals) {
    totalPlannedCycleSavings += goal.plannedCycleContribution
    // Sum savings_transfers to this goal in the current cycle
    const goalTransfers = state.transactions
      .filter((tx) => tx.type === 'savings_transfer' && tx.relatedId === goal.id)
      .reduce((sum, tx) => sum + tx.amount, 0)

    totalSavingsContributedThisCycle += goalTransfers
    const remainingPlanned = Math.max(0, goal.plannedCycleContribution - goalTransfers)
    outstandingPlannedSavingsTotal += remainingPlanned
  }

  // Available discretionary funds: Cash balance − upcoming commitments − outstanding planned savings
  const availableDiscretionaryFunds = cashBalance - upcomingCommitmentsTotal - outstandingPlannedSavingsTotal

  // Days remaining
  const daysRemaining = Math.max(0, 30 - currentDay) // strictly after today
  const inclusiveDaysRemaining = Math.max(1, 31 - currentDay) // from today through Day 30 inclusive

  // Safe daily allowance: availableDiscretionaryFunds / inclusiveDaysRemaining (0 if negative/zero)
  const safeDailyAllowance = availableDiscretionaryFunds > 0
    ? Math.floor(availableDiscretionaryFunds / inclusiveDaysRemaining)
    : 0

  // Variable spending pace & Forecast
  const elapsedDays = Math.max(1, currentDay - 1)
  const variableSpendPerElapsedDay = elapsedDays > 0 ? totalVariableExpenses / elapsedDays : 0

  // Estimated remaining variable spend
  let estimatedRemainingVariableSpend = 0
  const remainingDaysStrict = Math.max(0, 30 - currentDay)
  if (totalVariableExpenses > 0 && currentDay > 1) {
    estimatedRemainingVariableSpend = Math.round(variableSpendPerElapsedDay * remainingDaysStrict)
  } else if (currentDay === 1 && totalVariableExpenses === 0) {
    // On Day 1 with pristine budget, estimate 75% variable spending to model a healthy 25% end-of-month cushion
    estimatedRemainingVariableSpend = Math.round(availableDiscretionaryFunds * 0.75)
  } else {
    estimatedRemainingVariableSpend = Math.round(variableSpendPerElapsedDay * remainingDaysStrict)
  }

  // Projected month-end cash:
  // Cash balance − known unpaid commitments − estimated remaining variable spending − outstanding planned savings
  const projectedMonthEndCash = cashBalance - upcomingCommitmentsTotal - estimatedRemainingVariableSpend - outstandingPlannedSavingsTotal

  // Risk & Health Engine
  const healthResult = calculateHealthScore({
    cashBalance,
    availableDiscretionaryFunds,
    upcomingCommitmentsTotal,
    projectedMonthEndCash,
    plannedSavingsTotal: totalPlannedCycleSavings,
    savingsContributedThisCycle: totalSavingsContributedThisCycle,
    openingBudget,
    currentDay,
  })

  // Spending Pace Analysis
  // Target daily budget = (opening budget - planned commitments - planned savings) / 30
  const baselineTargetBudget = Math.max(100, (openingBudget - 2500 - totalPlannedCycleSavings) / 30)
  const paceRatio = baselineTargetBudget > 0 ? variableSpendPerElapsedDay / baselineTargetBudget : 1
  let paceStatus: 'under_budget' | 'on_track' | 'over_budget' = 'on_track'
  if (paceRatio < 0.85) paceStatus = 'under_budget'
  else if (paceRatio > 1.15) paceStatus = 'over_budget'

  // Category breakdown
  const categoryMap = new Map<ExpenseCategory, { amount: number; count: number }>()
  for (const cat of EXPENSE_CATEGORIES) {
    categoryMap.set(cat, { amount: 0, count: 0 })
  }

  for (const tx of state.transactions) {
    if (tx.type === 'expense' || tx.type === 'bill_payment') {
      const entry = categoryMap.get(tx.category) || { amount: 0, count: 0 }
      entry.amount += tx.amount
      entry.count += 1
      categoryMap.set(tx.category, entry)
    }
  }

  const categoryBreakdown = EXPENSE_CATEGORIES.map((category) => {
    const data = categoryMap.get(category) || { amount: 0, count: 0 }
    const percentage = totalExpenses > 0 ? Math.round((data.amount / totalExpenses) * 100) : 0
    return {
      category,
      amount: data.amount,
      percentage,
      color: CATEGORY_COLORS[category],
      count: data.count,
    }
  }).filter((c) => c.amount > 0).sort((a, b) => b.amount - a.amount)

  // 30-Day Timeline Construction
  const dailyTimeline: FinancialMetrics['dailyTimeline'] = []
  let cumulative = 0

  for (let day = 1; day <= 30; day++) {
    const isPast = day < currentDay
    const isToday = day === currentDay
    const isFuture = day > currentDay

    // Sum actual transactions on this cycle day
    const dayActual = state.transactions
      .filter((tx) => tx.cycleDay === day && (tx.type === 'expense' || tx.type === 'bill_payment'))
      .reduce((sum, tx) => sum + tx.amount, 0)

    // Projected spend for future days based on daily allowance + scheduled commitments
    let dayProjected = 0
    if (isFuture) {
      const scheduledCommitment = unpaidCommitments
        .filter((c) => c.dueDay === day)
        .reduce((sum, c) => sum + c.amount, 0)
      dayProjected = Math.round(safeDailyAllowance + scheduledCommitment)
    }

    cumulative += isPast || isToday ? dayActual : dayProjected

    dailyTimeline.push({
      day,
      actualSpend: isPast || isToday ? dayActual : 0,
      projectedSpend: isFuture ? dayProjected : 0,
      cumulativeSpend: Math.round(cumulative),
      isPast,
      isToday,
      isFuture,
    })
  }

  return {
    openingBudget,
    currentDay,
    totalIncome,
    totalExpenses,
    totalSavingsTransfers,
    cashBalance,
    savingsBalance,
    totalRemainingFunds,
    upcomingCommitmentsTotal,
    upcomingCommitmentsCount,
    outstandingPlannedSavingsTotal,
    availableDiscretionaryFunds,
    daysRemaining,
    inclusiveDaysRemaining,
    safeDailyAllowance,
    projectedMonthEndCash,
    variableSpendPerElapsedDay: Math.round(variableSpendPerElapsedDay),
    estimatedRemainingVariableSpend,
    healthScore: healthResult.healthScore,
    healthBand: healthResult.healthBand,
    healthColor: healthResult.healthColor,
    healthFactors: healthResult.healthFactors,
    spendingPace: {
      actualDailyAverage: Math.round(variableSpendPerElapsedDay),
      targetDailyPace: Math.round(baselineTargetBudget),
      paceRatio: Number(paceRatio.toFixed(2)),
      status: paceStatus,
    },
    categoryBreakdown,
    dailyTimeline,
    unpaidCommitments,
  }
}
