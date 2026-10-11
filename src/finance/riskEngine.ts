import type { HealthBand, HealthFactor } from './financeTypes'

export interface RiskInput {
  cashBalance: number
  availableDiscretionaryFunds: number
  upcomingCommitmentsTotal: number
  projectedMonthEndCash: number
  plannedSavingsTotal: number
  savingsContributedThisCycle: number
  openingBudget: number
  currentDay: number
}

export interface RiskOutput {
  healthScore: number
  healthBand: HealthBand
  healthColor: string
  healthFactors: HealthFactor[]
}

/**
 * Deterministic, transparent, and explainable financial health scoring model (0 - 100).
 * Handled gracefully across all edge cases (negative balance, high obligations, end-of-cycle).
 */
export function calculateHealthScore(input: RiskInput): RiskOutput {
  const {
    cashBalance,
    availableDiscretionaryFunds,
    upcomingCommitmentsTotal,
    projectedMonthEndCash,
    plannedSavingsTotal,
    savingsContributedThisCycle,
    openingBudget,
  } = input

  // 1. Discretionary Buffer Factor (0 - 35 points)
  // Evaluates whether user has uncommitted liquid breathing room
  let bufferScore = 0
  let bufferStatus: 'good' | 'warning' | 'critical' = 'critical'
  let bufferExplanation = ''

  if (availableDiscretionaryFunds <= 0) {
    bufferScore = 0
    bufferStatus = 'critical'
    bufferExplanation = `Discretionary deficit of ₹${Math.abs(Math.round(availableDiscretionaryFunds))}. Budget is severely constrained by commitments.`
  } else {
    // Relative to opening budget (10k baseline)
    const bufferRatio = availableDiscretionaryFunds / (openingBudget * 0.4) // target 40% discretionary
    bufferScore = Math.min(35, Math.max(5, Math.round(bufferRatio * 35)))
    if (bufferScore >= 25) {
      bufferStatus = 'good'
      bufferExplanation = `Solid discretionary cushion of ₹${Math.round(availableDiscretionaryFunds)} available.`
    } else {
      bufferStatus = 'warning'
      bufferExplanation = `Moderate discretionary room (₹${Math.round(availableDiscretionaryFunds)}). Mindful spending required.`
    }
  }

  // 2. Projected Month-End Cash Factor (0 - 30 points)
  // Evaluates forecasted liquidity on Day 30 based on current variable spending pace
  let forecastScore = 0
  let forecastStatus: 'good' | 'warning' | 'critical' = 'critical'
  let forecastExplanation = ''

  if (projectedMonthEndCash < 0) {
    forecastScore = 0
    forecastStatus = 'critical'
    forecastExplanation = `Projected cycle deficit of ₹${Math.abs(Math.round(projectedMonthEndCash))}. At current burn rate, funds will exhaust before Day 30.`
  } else if (projectedMonthEndCash < 500) {
    forecastScore = Math.round((projectedMonthEndCash / 500) * 12)
    forecastStatus = 'warning'
    forecastExplanation = `Tight finish projected: only ₹${Math.round(projectedMonthEndCash)} anticipated on Day 30.`
  } else {
    // 500 to 2,000+ scales from 15 to 30 points
    const progress = Math.min(1, (projectedMonthEndCash - 500) / 1500)
    forecastScore = Math.round(15 + progress * 15)
    forecastStatus = forecastScore >= 22 ? 'good' : 'warning'
    forecastExplanation = `Healthy month-end projection of ₹${Math.round(projectedMonthEndCash)} safely remaining.`
  }

  // 3. Commitment Burden Factor (0 - 20 points)
  // Evaluates whether upcoming bills and subscriptions swallow too much cash
  let commitmentScore = 0
  let commitmentStatus: 'good' | 'warning' | 'critical' = 'critical'
  let commitmentExplanation = ''

  if (cashBalance <= 0) {
    commitmentScore = 0
    commitmentStatus = 'critical'
    commitmentExplanation = 'No cash available to satisfy obligations.'
  } else {
    const commitmentRatio = upcomingCommitmentsTotal / cashBalance
    if (commitmentRatio <= 0.25) {
      commitmentScore = 20
      commitmentStatus = 'good'
      commitmentExplanation = `Low commitment burden: obligations are only ${Math.round(commitmentRatio * 100)}% of cash.`
    } else if (commitmentRatio <= 0.6) {
      commitmentScore = Math.round(20 - ((commitmentRatio - 0.25) / 0.35) * 10)
      commitmentStatus = 'warning'
      commitmentExplanation = `Moderate obligations (${Math.round(commitmentRatio * 100)}% of current cash reserved).`
    } else {
      commitmentScore = Math.max(2, Math.round(10 - ((commitmentRatio - 0.6) / 0.4) * 8))
      commitmentStatus = 'critical'
      commitmentExplanation = `High commitment risk: ${Math.round(commitmentRatio * 100)}% of cash is locked in obligations.`
    }
  }

  // 4. Savings Progress & Consistency Factor (0 - 15 points)
  // Evaluates progress towards 30-day savings milestones
  let savingsScore = 0
  let savingsStatus: 'good' | 'warning' | 'critical' = 'critical'
  let savingsExplanation = ''

  if (plannedSavingsTotal <= 0) {
    // If no goals set, award neutral baseline of 8 points
    savingsScore = 8
    savingsStatus = 'warning'
    savingsExplanation = 'No savings goals configured for this 30-day cycle.'
  } else {
    const savingsRatio = savingsContributedThisCycle / plannedSavingsTotal
    savingsScore = Math.min(15, Math.round(savingsRatio * 15))
    if (savingsScore >= 11) {
      savingsStatus = 'good'
      savingsExplanation = `Savings on track: ${Math.round(savingsRatio * 100)}% of planned cycle targets fulfilled.`
    } else if (savingsScore >= 5) {
      savingsStatus = 'warning'
      savingsExplanation = `Partial savings progress: ${Math.round(savingsRatio * 100)}% achieved so far.`
    } else {
      savingsStatus = 'critical'
      savingsExplanation = `Behind on savings targets: only ${Math.round(savingsRatio * 100)}% achieved.`
    }
  }

  const totalScore = Math.min(100, Math.max(0, bufferScore + forecastScore + commitmentScore + savingsScore))

  let healthBand: HealthBand = 'Healthy'
  let healthColor = '#C8FF4D' // Electric Lime

  if (totalScore >= 80) {
    healthBand = 'Healthy'
    healthColor = '#C8FF4D'
  } else if (totalScore >= 55) {
    healthBand = 'Needs Attention'
    healthColor = '#FFB340' // Amber Warning
  } else {
    healthBand = 'High Risk'
    healthColor = '#FF5C5C' // High Risk Coral
  }

  const healthFactors: HealthFactor[] = [
    {
      name: 'Discretionary Cushion',
      score: bufferScore,
      maxScore: 35,
      explanation: bufferExplanation,
      status: bufferStatus,
    },
    {
      name: 'Month-End Runaway',
      score: forecastScore,
      maxScore: 30,
      explanation: forecastExplanation,
      status: forecastStatus,
    },
    {
      name: 'Commitment Burden',
      score: commitmentScore,
      maxScore: 20,
      explanation: commitmentExplanation,
      status: commitmentStatus,
    },
    {
      name: 'Savings Consistency',
      score: savingsScore,
      maxScore: 15,
      explanation: savingsExplanation,
      status: savingsStatus,
    },
  ]

  return {
    healthScore: totalScore,
    healthBand,
    healthColor,
    healthFactors,
  }
}
