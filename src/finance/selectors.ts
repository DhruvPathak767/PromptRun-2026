import type {
  Subscription,
  Transaction,
  ExpenseCategory,
  SavingsGoal,
  Commitment,
} from './financeTypes'

/**
 * Filter all active recurring subscriptions.
 *
 * @param subscriptions - List of all user subscriptions
 * @returns Array of active subscriptions
 * @example
 * ```ts
 * const active = selectActiveSubscriptions(subscriptions)
 * ```
 */
export function selectActiveSubscriptions(subscriptions: readonly Subscription[]): Subscription[] {
  return subscriptions.filter((s) => s.active)
}

/**
 * Calculate the total monthly cost of all currently active subscriptions.
 *
 * @param subscriptions - List of subscriptions
 * @returns Sum of active subscription prices in Rupees
 * @example
 * ```ts
 * const totalMonthly = selectTotalMonthlySubCost(subscriptions)
 * ```
 */
export function selectTotalMonthlySubCost(subscriptions: readonly Subscription[]): number {
  return selectActiveSubscriptions(subscriptions).reduce((sum, s) => sum + s.price, 0)
}

/**
 * Calculate the daily amortized cost of active subscriptions across remaining cycle days.
 *
 * @param subscriptions - List of subscriptions
 * @param daysRemaining - Inclusive days remaining in the 30-day budget cycle (>= 1)
 * @returns Daily amortized cost rounded to nearest integer
 * @example
 * ```ts
 * const dailyCost = selectDailySubCost(subscriptions, 15)
 * ```
 */
export function selectDailySubCost(
  subscriptions: readonly Subscription[],
  daysRemaining: number
): number {
  const safeDays = Math.max(1, daysRemaining)
  const totalMonthly = selectTotalMonthlySubCost(subscriptions)
  return Math.round(totalMonthly / safeDays)
}

/**
 * Sum all transactions belonging to a specific expense category.
 *
 * @param transactions - List of transactions
 * @param category - Category to filter and sum
 * @returns Total spending for the specified category
 * @example
 * ```ts
 * const foodSpend = selectCategorySpend(transactions, 'Food & Drinks')
 * ```
 */
export function selectCategorySpend(
  transactions: readonly Transaction[],
  category: ExpenseCategory
): number {
  return transactions
    .filter((tx) => tx.category === category && tx.type !== 'income')
    .reduce((sum, tx) => sum + tx.amount, 0)
}

/**
 * Sum the amounts of a list of transactions.
 *
 * @param transactions - List of transactions
 * @returns Total sum of transaction amounts
 * @example
 * ```ts
 * const total = selectTransactionsTotal(filteredTransactions)
 * ```
 */
export function selectTransactionsTotal(transactions: readonly Transaction[]): number {
  return transactions.reduce((sum, tx) => sum + tx.amount, 0)
}

/**
 * Calculate hypothetical daily allowance impact of an impulse or discretionary purchase.
 *
 * @param purchaseAmount - Potential purchase amount in Rupees
 * @param daysRemaining - Days remaining in the cycle (>= 1)
 * @returns Daily allowance reduction in Rupees
 * @example
 * ```ts
 * const dailyImpact = selectHypotheticalDailyImpact(450, 15) // ~30
 * ```
 */
export function selectHypotheticalDailyImpact(
  purchaseAmount: number,
  daysRemaining: number
): number {
  const safeDays = Math.max(1, daysRemaining)
  const safeAmount = Math.max(0, purchaseAmount)
  return Math.round(safeAmount / safeDays)
}

/**
 * Calculate goal completion percentage capped at 100%.
 *
 * @param currentAmount - Saved amount in goal
 * @param targetAmount - Total target amount for goal (> 0)
 * @returns Integer percentage between 0 and 100
 * @example
 * ```ts
 * const pct = selectGoalProgressPercent(2500, 5000) // 50
 * ```
 */
export function selectGoalProgressPercent(
  currentAmount: number,
  targetAmount: number
): number {
  if (targetAmount <= 0) return 100
  return Math.min(100, Math.max(0, Math.round((currentAmount / targetAmount) * 100)))
}

/**
 * Calculate remaining gap to reach goal target.
 *
 * @param currentAmount - Saved amount in goal
 * @param targetAmount - Total target amount
 * @returns Non-negative remaining deficit in Rupees
 * @example
 * ```ts
 * const gap = selectGoalRemainingTarget(1200, 3000) // 1800
 * ```
 */
export function selectGoalRemainingTarget(
  currentAmount: number,
  targetAmount: number
): number {
  return Math.max(0, targetAmount - currentAmount)
}

/**
 * Sum savings transfers made during current cycle for a specific goal or all goals.
 *
 * @param transactions - Transaction history
 * @param goalId - Optional goal ID to isolate
 * @returns Total cycle savings transfer amount
 * @example
 * ```ts
 * const goalTransfers = selectCycleTransfersTotal(transactions, 'goal-tech')
 * ```
 */
export function selectCycleTransfersTotal(
  transactions: readonly Transaction[],
  goalId?: string
): number {
  return transactions
    .filter(
      (tx) =>
        tx.type === 'savings_transfer' &&
        (!goalId || tx.category === goalId || tx.description.includes(goalId))
    )
    .reduce((sum, tx) => sum + tx.amount, 0)
}

/**
 * Convert a rupee amount into Gen Z "Chai Units" (₹20 standard tapri chai).
 *
 * @param amount - Cost in Rupees
 * @returns Number of tapri chais
 * @example
 * ```ts
 * const chais = selectChaiEquivalence(400) // 20
 * ```
 */
export function selectChaiEquivalence(amount: number): number {
  return Math.max(0, Math.round(amount / 20))
}

/**
 * Compute the total percentage of opening budget committed to expenses, obligations, and planned savings.
 *
 * @param totalExpenses - Actual expenses incurred so far
 * @param upcomingCommitments - Unpaid obligations due before Day 30
 * @param outstandingPlannedSavings - Cycle savings target remaining
 * @param openingBudget - Initial starting budget (₹10,000)
 * @returns Rounded percentage
 * @example
 * ```ts
 * const committedPct = selectCommittedPercentage(3200, 1800, 1000, 10000) // 60
 * ```
 */
export function selectCommittedPercentage(
  totalExpenses: number,
  upcomingCommitments: number,
  outstandingPlannedSavings: number,
  openingBudget: number
): number {
  if (openingBudget <= 0) return 0
  const total = totalExpenses + upcomingCommitments + outstandingPlannedSavings
  return Math.round((total / openingBudget) * 100)
}

/**
 * Compute the projected deficit crash day if current spending velocity continues.
 *
 * @param currentDay - Current cycle day (1 to 30)
 * @param cashBalance - Remaining cash balance in Rupees
 * @param dailyVelocity - Average spend per day
 * @returns Estimated cycle day (between currentDay and 30) when balance hits zero, or null if sustainable
 * @example
 * ```ts
 * const crashDay = selectDeficitCrashDay(10, 2000, 400) // Day 15
 * ```
 */
export function selectDeficitCrashDay(
  currentDay: number,
  cashBalance: number,
  dailyVelocity: number
): number | null {
  if (dailyVelocity <= 0 || cashBalance <= 0) return currentDay
  const daysRunway = cashBalance / dailyVelocity
  const projectedDay = Math.round(currentDay + daysRunway)
  return projectedDay <= 30 ? Math.min(30, Math.max(currentDay, projectedDay)) : null
}

/**
 * Sum all unpaid commitments.
 *
 * @param commitments - List of commitments
 * @returns Total unpaid commitment sum
 * @example
 * ```ts
 * const unpaidTotal = selectUnpaidCommitmentsTotal(commitments)
 * ```
 */
export function selectUnpaidCommitmentsTotal(commitments: readonly Commitment[]): number {
  return commitments.filter((c) => !c.isPaid).reduce((sum, c) => sum + c.amount, 0)
}

/**
 * Metrics and recoverable liquidity for Broke Mode emergency triage.
 *
 * @param subscriptions - Active subscriptions
 * @param safeDailyAllowance - Current safe daily allowance
 * @param daysRemaining - Inclusive days remaining
 * @param goals - User goals with liquidity
 * @returns Recoverable emergency liquidity breakdown
 */
export function selectEmergencyBailoutMetrics(
  subscriptions: readonly Subscription[],
  safeDailyAllowance: number,
  daysRemaining: number,
  goals: readonly SavingsGoal[]
): {
  potentialSubSavings: number
  emergencyTargetDaily: number
  dailyCut: number
  totalAllowanceSavings: number
  emergencyGoalLiquidity: number
  totalBufferRecoverable: number
} {
  const potentialSubSavings = selectTotalMonthlySubCost(subscriptions)
  const safeDays = Math.max(1, daysRemaining)
  const emergencyTargetDaily = Math.max(80, Math.round(safeDailyAllowance * 0.6))
  const dailyCut = Math.max(0, safeDailyAllowance - emergencyTargetDaily)
  const totalAllowanceSavings = dailyCut * safeDays

  const emergencyGoal = goals.find((g) => g.currentAmount > 0)
  const emergencyGoalLiquidity = emergencyGoal ? emergencyGoal.currentAmount : 0
  const totalBufferRecoverable = potentialSubSavings + totalAllowanceSavings + emergencyGoalLiquidity

  return {
    potentialSubSavings,
    emergencyTargetDaily,
    dailyCut,
    totalAllowanceSavings,
    emergencyGoalLiquidity,
    totalBufferRecoverable,
  }
}

/**
 * Compute total estimated variable discretionary spend elapsed so far.
 *
 * @param actualDailyAverage - Average daily spend rate
 * @param currentDay - Current cycle day (1 to 30)
 * @returns Total variable spend in Rupees
 */
export function selectVariableDiscretionarySpend(
  actualDailyAverage: number,
  currentDay: number
): number {
  return Math.round(actualDailyAverage * Math.max(1, currentDay - 1))
}

/**
 * Compute fixed expenses incurred so far by deducting estimated variable spend from total expenses.
 *
 * @param totalExpenses - Total expenses incurred
 * @param actualDailyAverage - Average daily spend rate
 * @param currentDay - Current cycle day
 * @returns Fixed expenses in Rupees
 */
export function selectFixedExpensesSoFar(
  totalExpenses: number,
  actualDailyAverage: number,
  currentDay: number
): number {
  const variable = selectVariableDiscretionarySpend(actualDailyAverage, currentDay)
  return Math.max(0, totalExpenses - variable)
}

