export type DayNumber = number // 1 to 30

export type ExpenseCategory =
  | 'Food & Dining'
  | 'Groceries & Essentials'
  | 'Transit & Commute'
  | 'Tech & Subscriptions'
  | 'Entertainment & Social'
  | 'Shopping & Apparel'
  | 'Personal Care'
  | 'Learning & Books'
  | 'Unexpected & Emergency'

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Food & Dining',
  'Groceries & Essentials',
  'Transit & Commute',
  'Tech & Subscriptions',
  'Entertainment & Social',
  'Shopping & Apparel',
  'Personal Care',
  'Learning & Books',
  'Unexpected & Emergency',
]

export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  'Food & Dining': '#FFB340', // Amber
  'Groceries & Essentials': '#34D399', // Emerald
  'Transit & Commute': '#63E5F4', // Cyan
  'Tech & Subscriptions': '#9875FF', // Violet
  'Entertainment & Social': '#FF72D2', // Pink
  'Shopping & Apparel': '#C8FF4D', // Lime
  'Personal Care': '#38BDF8', // Sky
  'Learning & Books': '#A78BFA', // Purple
  'Unexpected & Emergency': '#FF5C5C', // Coral
}

export type TransactionType = 'expense' | 'income' | 'savings_transfer' | 'bill_payment'

export interface Transaction {
  id: string
  cycleDay: number // 1 to 30
  date: string // e.g. "Day 8 • Oct 18"
  amount: number // in INR (positive number)
  description: string
  category: ExpenseCategory
  type: TransactionType
  isFixed: boolean // true if fixed bill/subscription, false if variable discretionary
  note?: string
  relatedId?: string // commitment id or savings goal id
}

export interface Commitment {
  id: string
  name: string
  amount: number
  dueDay: number // 1 to 30
  category: ExpenseCategory
  isPaid: boolean
  paidOnDay?: number
  paidTransactionId?: string
  relatedSubscriptionId?: string // if linked to an active subscription
}

export interface Subscription {
  id: string
  name: string
  price: number
  billingDay: number // 1 to 30
  category: ExpenseCategory
  active: boolean
  tier?: string
  serviceIcon?: string
}

export interface SavingsGoal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  plannedCycleContribution: number
  color: string
  category: string
  iconName: string
  description: string
}

export type SimulatedScenarioType =
  | 'purchase'
  | 'add_subscription'
  | 'cancel_subscription'
  | 'unexpected_expense'
  | 'savings_contribution'
  | 'add_income'
  | 'add_commitment'
  | 'adjust_savings_plan'

export interface SimulatedScenario {
  id: string
  type: SimulatedScenarioType
  title: string
  description: string
  amount: number
  category?: ExpenseCategory
  dueDay?: number
  targetGoalId?: string
  targetSubscriptionId?: string
  customNotes?: string
}

export type HealthBand = 'Healthy' | 'Needs Attention' | 'High Risk'

export interface HealthFactor {
  name: string
  score: number
  maxScore: number
  explanation: string
  status: 'good' | 'warning' | 'critical'
}

export interface FinancialMetrics {
  openingBudget: number // fixed ₹10,000
  currentDay: number // 1 to 30
  totalIncome: number
  totalExpenses: number
  totalSavingsTransfers: number
  cashBalance: number
  savingsBalance: number
  totalRemainingFunds: number // cashBalance + savingsBalance
  upcomingCommitmentsTotal: number
  upcomingCommitmentsCount: number
  outstandingPlannedSavingsTotal: number
  availableDiscretionaryFunds: number
  daysRemaining: number // max(0, 30 - currentDay)
  inclusiveDaysRemaining: number // max(1, 31 - currentDay)
  safeDailyAllowance: number
  projectedMonthEndCash: number
  variableSpendPerElapsedDay: number
  estimatedRemainingVariableSpend: number
  healthScore: number // 0 to 100
  healthBand: HealthBand
  healthColor: string
  healthFactors: HealthFactor[]
  spendingPace: {
    actualDailyAverage: number
    targetDailyPace: number
    paceRatio: number
    status: 'under_budget' | 'on_track' | 'over_budget'
  }
  categoryBreakdown: Array<{
    category: ExpenseCategory
    amount: number
    percentage: number
    color: string
    count: number
  }>
  dailyTimeline: Array<{
    day: number
    actualSpend: number
    projectedSpend: number
    cumulativeSpend: number
    isPast: boolean
    isToday: boolean
    isFuture: boolean
  }>
  unpaidCommitments: Commitment[]
}

export interface SimulationComparison {
  baseline: FinancialMetrics
  simulated: FinancialMetrics
  scenario: SimulatedScenario
  deltas: {
    cashBalanceDelta: number
    discretionaryDelta: number
    dailyAllowanceDelta: number
    commitmentsDelta: number
    savingsDelta: number
    monthEndDelta: number
    healthScoreDelta: number
    healthBandChanged: boolean
  }
  explanations: Array<{
    type: 'positive' | 'negative' | 'neutral'
    text: string
  }>
  isAffordable: boolean
  warningNotice?: string
}

export interface FinancialInsight {
  id: string
  title: string
  type: 'risk' | 'opportunity' | 'pacing' | 'savings' | 'subscription'
  severity: 'low' | 'medium' | 'high'
  explanation: string
  financialImpact?: string
  actionLabel: string
  actionRoute: string
  scenarioPreset?: Partial<SimulatedScenario>
}

export interface RupeeFlowState {
  version: number
  currentDay: number
  openingBudget: number
  transactions: Transaction[]
  commitments: Commitment[]
  subscriptions: Subscription[]
  goals: SavingsGoal[]
  activeSimulation: SimulatedScenario | null
  lastUpdated: string
}
