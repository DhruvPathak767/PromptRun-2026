import { useFinance } from '../state/useFinance'
import {
  selectActiveSubscriptions,
  selectTotalMonthlySubCost,
  selectDailySubCost,
  selectCategorySpend,
  selectChaiEquivalence,
  selectGoalProgressPercent,
  selectGoalRemainingTarget,
} from '../finance/selectors'
import type { ExpenseCategory, SavingsGoal } from '../finance/financeTypes'

export { useFinance }

/**
 * Custom hook returning precomputed selectors for the active financial state.
 */
export function useFinanceSelectors() {
  const { state, metrics } = useFinance()

  const activeSubscriptions = selectActiveSubscriptions(state.subscriptions)
  const totalMonthlySubCost = selectTotalMonthlySubCost(state.subscriptions)
  const dailySubCost = selectDailySubCost(state.subscriptions, metrics.inclusiveDaysRemaining)

  const getCategorySpend = (category: ExpenseCategory) =>
    selectCategorySpend(state.transactions, category)

  const getChaiEquivalent = (amount: number) => selectChaiEquivalence(amount)

  const getGoalProgress = (goal: SavingsGoal) => ({
    percentage: selectGoalProgressPercent(goal.currentAmount, goal.targetAmount),
    remaining: selectGoalRemainingTarget(goal.currentAmount, goal.targetAmount),
  })

  return {
    activeSubscriptions,
    totalMonthlySubCost,
    dailySubCost,
    getCategorySpend,
    getChaiEquivalent,
    getGoalProgress,
  }
}
