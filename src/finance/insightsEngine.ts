import {
  type RupeeFlowState,
  type FinancialMetrics,
  type FinancialInsight,
} from './financeTypes'
import { formatRupees } from './financeEngine'

/**
 * Derives actionable, explainable rule-based insights directly from current financial metrics.
 * Recalculated automatically whenever state updates.
 */
export function generateFinancialInsights(
  state: RupeeFlowState,
  metrics: FinancialMetrics
): FinancialInsight[] {
  const insights: FinancialInsight[] = []

  // 1. Pacing & Overspending Alert
  if (metrics.spendingPace.status === 'over_budget') {
    const dailyExcess = metrics.spendingPace.actualDailyAverage - metrics.spendingPace.targetDailyPace
    const projectedLoss = dailyExcess * metrics.inclusiveDaysRemaining
    insights.push({
      id: 'insight-pacing-burn',
      title: 'Variable spending running hot',
      type: 'pacing',
      severity: 'high',
      explanation: `You're spending an average of ${formatRupees(metrics.spendingPace.actualDailyAverage)}/day on variable items vs the budgeted ${formatRupees(metrics.spendingPace.targetDailyPace)}/day pace (${Math.round((metrics.spendingPace.paceRatio - 1) * 100)}% above baseline).`,
      financialImpact: `Trimming ~${formatRupees(dailyExcess)}/day protects ${formatRupees(projectedLoss)} by Day 30.`,
      actionLabel: 'Explore What-If Scenarios',
      actionRoute: '/simulator',
      scenarioPreset: {
        type: 'purchase',
        title: 'Evaluate upcoming purchase impact',
        amount: 500,
      },
    })
  } else if (metrics.spendingPace.status === 'under_budget') {
    const surplusProjected = (metrics.spendingPace.targetDailyPace - metrics.spendingPace.actualDailyAverage) * metrics.inclusiveDaysRemaining
    insights.push({
      id: 'insight-pacing-thrift',
      title: 'Disciplined spending pace',
      type: 'opportunity',
      severity: 'low',
      explanation: `Your variable burn of ${formatRupees(metrics.spendingPace.actualDailyAverage)}/day is comfortably below target allowance (${formatRupees(metrics.spendingPace.targetDailyPace)}/day).`,
      financialImpact: `Projected surplus of +${formatRupees(surplusProjected)} available to boost savings.`,
      actionLabel: 'Allocate to Savings',
      actionRoute: '/goals',
      scenarioPreset: {
        type: 'savings_contribution',
        title: `Boost savings by ${formatRupees(Math.min(1000, surplusProjected))}`,
        amount: Math.min(1000, Math.max(500, Math.round(surplusProjected * 0.5))),
      },
    })
  }

  // 2. Heavy Subscription Burden
  const activeSubs = state.subscriptions.filter((s) => s.active)
  const totalSubCost = activeSubs.reduce((sum, s) => sum + s.price, 0)
  if (metrics.availableDiscretionaryFunds > 0 && totalSubCost > 0) {
    const subRatio = totalSubCost / (metrics.availableDiscretionaryFunds + totalSubCost)
    if (subRatio > 0.15) {
      const topSub = [...activeSubs].sort((a, b) => b.price - a.price)[0]
      insights.push({
        id: 'insight-subscription-drain',
        title: 'Subscriptions consume 15%+ of discretionary buffer',
        type: 'subscription',
        severity: 'medium',
        explanation: `Your active subscriptions total ${formatRupees(totalSubCost)}/month. Top cost is ${topSub.name} at ${formatRupees(topSub.price)}.`,
        financialImpact: `Cancelling or pausing one could add ~${formatRupees(Math.round(totalSubCost / metrics.inclusiveDaysRemaining))}/day to your daily allowance.`,
        actionLabel: 'Manage Subscriptions',
        actionRoute: '/subscriptions',
        scenarioPreset: {
          type: 'cancel_subscription',
          title: `Cancel ${topSub.name}`,
          amount: topSub.price,
          targetSubscriptionId: topSub.id,
        },
      })
    }
  }

  // 3. Commitment Cliff Notice
  const nearCommitments = metrics.unpaidCommitments.filter((c) => c.dueDay <= state.currentDay + 5)
  const nearTotal = nearCommitments.reduce((sum, c) => sum + c.amount, 0)
  if (nearCommitments.length > 0) {
    insights.push({
      id: 'insight-commitment-cliff',
      title: `${nearCommitments.length} obligation${nearCommitments.length > 1 ? 's' : ''} due in next 5 days`,
      type: 'risk',
      severity: nearTotal > metrics.cashBalance * 0.4 ? 'high' : 'medium',
      explanation: `${formatRupees(nearTotal)} in scheduled bills/subscriptions are due between Day ${state.currentDay} and Day ${state.currentDay + 5} (${nearCommitments.map((c) => c.name).join(', ')}).`,
      financialImpact: `Cash remaining after these obligations: ${formatRupees(Math.max(0, metrics.cashBalance - nearTotal))}.`,
      actionLabel: 'Inspect Commitments',
      actionRoute: '/budget',
    })
  }

  // 4. Savings Goal Momentum
  const laggingGoal = state.goals.find((g) => {
    const progress = g.targetAmount > 0 ? g.currentAmount / g.targetAmount : 0
    return progress < 0.5 && g.plannedCycleContribution > 0
  })

  if (laggingGoal && metrics.safeDailyAllowance > 250) {
    insights.push({
      id: 'insight-savings-opportunity',
      title: `Accelerate "${laggingGoal.name}" goal`,
      type: 'savings',
      severity: 'low',
      explanation: `Goal is at ${Math.round((laggingGoal.currentAmount / laggingGoal.targetAmount) * 100)}% (${formatRupees(laggingGoal.currentAmount)} of ${formatRupees(laggingGoal.targetAmount)}). Your daily allowance of ${formatRupees(metrics.safeDailyAllowance)} leaves room to contribute.`,
      financialImpact: `A ₹500 transfer finishes ${Math.round((500 / laggingGoal.targetAmount) * 100)}% more of this target.`,
      actionLabel: 'Simulate Savings Deposit',
      actionRoute: '/simulator',
      scenarioPreset: {
        type: 'savings_contribution',
        title: `Contribute ₹500 to ${laggingGoal.name}`,
        amount: 500,
        targetGoalId: laggingGoal.id,
      },
    })
  }

  // 5. Month-End Deficit Warning
  if (metrics.projectedMonthEndCash < 500) {
    insights.push({
      id: 'insight-deficit-hazard',
      title: metrics.projectedMonthEndCash < 0 ? 'Projected month-end deficit!' : 'Tight month-end buffer alert',
      type: 'risk',
      severity: 'high',
      explanation: metrics.projectedMonthEndCash < 0
        ? `At your current spending velocity, you are projected to face a ₹${Math.abs(Math.round(metrics.projectedMonthEndCash))} cash deficit before Day 30.`
        : `Only ${formatRupees(metrics.projectedMonthEndCash)} is forecasted to remain on Day 30. An unexpected ₹500 cost would deplete your funds.`,
      financialImpact: `Reduce daily variable spend to ${formatRupees(Math.max(0, metrics.safeDailyAllowance * 0.7))}/day to build a safety cushion.`,
      actionLabel: 'Test Budget Adjustments',
      actionRoute: '/simulator',
    })
  }

  return insights
}
