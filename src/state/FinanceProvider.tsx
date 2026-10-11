import React, {
  useReducer,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react'
import {
  type SimulatedScenario,
  type Transaction,
  type Commitment,
  type Subscription,
  type SavingsGoal,
} from '../finance/financeTypes'
import { financeReducer } from './financeReducer'
import { loadPersistedState, savePersistedState, clearPersistedState } from './persistence'
import { calculateFinancialMetrics } from '../finance/financeEngine'
import { generateFinancialInsights } from '../finance/insightsEngine'
import { simulateScenario } from '../finance/scenarioEngine'
import { FinanceContext, type ToastMessage, type FinanceContextValue } from './FinanceContext'

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(financeReducer, undefined, loadPersistedState)
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  // Toast management
  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Math.random().toString(36).slice(2, 9)}`
    setToasts((prev) => [...prev, { ...toast, id }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4500)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // Auto-persist on state change
  useEffect(() => {
    savePersistedState(state)
  }, [state])

  // Derive all metrics consistently from the single source of truth
  const metrics = useMemo(() => calculateFinancialMetrics(state), [state])

  // Derive insights
  const insights = useMemo(() => generateFinancialInsights(state, metrics), [state, metrics])

  // Derive simulation comparison when active
  const simulationComparison = useMemo(() => {
    if (!state.activeSimulation) return null
    return simulateScenario(state, state.activeSimulation)
  }, [state])

  // Wrapped actions
  const setCurrentDay = useCallback((day: number) => {
    dispatch({ type: 'SET_CURRENT_DAY', payload: day })
    addToast({
      title: 'Simulation Day Advanced',
      message: `Now viewing financial state on Day ${day} of 30.`,
      type: 'info',
    })
  }, [addToast])

  const addTransaction = useCallback((tx: Omit<Transaction, 'id'> & { id?: string }) => {
    dispatch({ type: 'ADD_TRANSACTION', payload: tx })
    addToast({
      title: tx.type === 'income' ? 'Income Recorded' : 'Expense Added',
      message: `${tx.description} for ₹${Math.round(tx.amount)} recorded on Day ${tx.cycleDay}.`,
      type: 'success',
    })
  }, [addToast])

  const updateTransaction = useCallback((tx: Transaction) => {
    dispatch({ type: 'UPDATE_TRANSACTION', payload: tx })
    addToast({
      title: 'Transaction Updated',
      message: `${tx.description} updated successfully.`,
      type: 'info',
    })
  }, [addToast])

  const deleteTransaction = useCallback((id: string) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id })
    addToast({
      title: 'Transaction Removed',
      message: 'Transaction deleted and finances recalculated.',
      type: 'info',
    })
  }, [addToast])

  const addCommitment = useCallback((c: Omit<Commitment, 'id'> & { id?: string }) => {
    dispatch({ type: 'ADD_COMMITMENT', payload: c })
    addToast({
      title: 'Commitment Scheduled',
      message: `${c.name} (₹${c.amount}) due on Day ${c.dueDay}.`,
      type: 'success',
    })
  }, [addToast])

  const updateCommitment = useCallback((c: Commitment) => {
    dispatch({ type: 'UPDATE_COMMITMENT', payload: c })
    addToast({
      title: 'Commitment Updated',
      message: `${c.name} modified.`,
      type: 'info',
    })
  }, [addToast])

  const markCommitmentPaid = useCallback((id: string, payDay?: number) => {
    dispatch({ type: 'MARK_COMMITMENT_PAID', payload: { id, payDay } })
    addToast({
      title: 'Obligation Paid',
      message: 'Commitment satisfied and deducted from cash balance.',
      type: 'success',
    })
  }, [addToast])

  const deleteCommitment = useCallback((id: string) => {
    dispatch({ type: 'DELETE_COMMITMENT', payload: id })
    addToast({
      title: 'Commitment Removed',
      message: 'Obligation removed from cycle calendar.',
      type: 'info',
    })
  }, [addToast])

  const addSubscription = useCallback((s: Omit<Subscription, 'id'> & { id?: string }) => {
    dispatch({ type: 'ADD_SUBSCRIPTION', payload: s })
    addToast({
      title: 'Subscription Tracked',
      message: `${s.name} (₹${s.price}/mo) added to recurring charges.`,
      type: 'success',
    })
  }, [addToast])

  const updateSubscription = useCallback((s: Subscription) => {
    dispatch({ type: 'UPDATE_SUBSCRIPTION', payload: s })
    addToast({
      title: 'Subscription Updated',
      message: `${s.name} settings updated.`,
      type: 'info',
    })
  }, [addToast])

  const toggleSubscription = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_SUBSCRIPTION', payload: id })
    addToast({
      title: 'Subscription Status Toggled',
      message: 'Future recurring charges adjusted.',
      type: 'info',
    })
  }, [addToast])

  const deleteSubscription = useCallback((id: string) => {
    dispatch({ type: 'DELETE_SUBSCRIPTION', payload: id })
    addToast({
      title: 'Subscription Removed',
      message: 'Subscription permanently deleted.',
      type: 'info',
    })
  }, [addToast])

  const addGoal = useCallback((g: Omit<SavingsGoal, 'id'> & { id?: string }) => {
    dispatch({ type: 'ADD_GOAL', payload: g })
    addToast({
      title: 'Savings Goal Created',
      message: `Target for ${g.name} set to ₹${g.targetAmount}.`,
      type: 'success',
    })
  }, [addToast])

  const updateGoal = useCallback((g: SavingsGoal) => {
    dispatch({ type: 'UPDATE_GOAL', payload: g })
    addToast({
      title: 'Goal Updated',
      message: `${g.name} modified.`,
      type: 'info',
    })
  }, [addToast])

  const contributeToGoal = useCallback((goalId: string, amount: number, note?: string) => {
    dispatch({ type: 'CONTRIBUTE_TO_GOAL', payload: { goalId, amount, note } })
    addToast({
      title: 'Funds Moved to Savings',
      message: `₹${Math.round(amount)} transferred from cash into goal.`,
      type: 'success',
    })
  }, [addToast])

  const deleteGoal = useCallback((id: string) => {
    dispatch({ type: 'DELETE_GOAL', payload: id })
    addToast({
      title: 'Goal Removed',
      message: 'Savings goal deleted.',
      type: 'info',
    })
  }, [addToast])

  const setActiveSimulation = useCallback((scenario: SimulatedScenario) => {
    dispatch({ type: 'SET_ACTIVE_SIMULATION', payload: scenario })
  }, [])

  const clearActiveSimulation = useCallback(() => {
    dispatch({ type: 'CLEAR_ACTIVE_SIMULATION' })
  }, [])

  const applyActiveSimulation = useCallback(() => {
    if (state.activeSimulation) {
      const scenarioTitle = state.activeSimulation.title
      dispatch({ type: 'APPLY_ACTIVE_SIMULATION' })
      addToast({
        title: 'Decision Applied to Real Budget!',
        message: `Applied "${scenarioTitle}" into your 30-day ledger.`,
        type: 'success',
      })
    }
  }, [state.activeSimulation, addToast])

  const resetDemoData = useCallback(() => {
    clearPersistedState()
    dispatch({ type: 'RESET_DEMO_DATA' })
    addToast({
      title: 'Demo State Reset',
      message: 'Returned to Day 12 baseline with ₹10,000 opening cycle.',
      type: 'info',
    })
  }, [addToast])

  const value: FinanceContextValue = {
    state,
    metrics,
    insights,
    simulationComparison,
    toasts,
    addToast,
    removeToast,
    setCurrentDay,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCommitment,
    updateCommitment,
    markCommitmentPaid,
    deleteCommitment,
    addSubscription,
    updateSubscription,
    toggleSubscription,
    deleteSubscription,
    addGoal,
    updateGoal,
    contributeToGoal,
    deleteGoal,
    setActiveSimulation,
    clearActiveSimulation,
    applyActiveSimulation,
    resetDemoData,
  }

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
}
