import { createContext, useContext } from 'react'
import {
  type RupeeFlowState,
  type FinancialMetrics,
  type FinancialInsight,
  type SimulationComparison,
  type SimulatedScenario,
  type Transaction,
  type Commitment,
  type Subscription,
  type SavingsGoal,
} from '../finance/financeTypes'

export interface ToastMessage {
  id: string
  title: string
  message: string
  type: 'success' | 'info' | 'warning' | 'error'
}

export interface FinanceContextValue {
  state: RupeeFlowState
  metrics: FinancialMetrics
  insights: FinancialInsight[]
  simulationComparison: SimulationComparison | null
  toasts: ToastMessage[]
  addToast: (toast: Omit<ToastMessage, 'id'>) => void
  removeToast: (id: string) => void
  // Dispatch actions
  setCurrentDay: (day: number) => void
  addTransaction: (tx: Omit<Transaction, 'id'> & { id?: string }) => void
  updateTransaction: (tx: Transaction) => void
  deleteTransaction: (id: string) => void
  addCommitment: (c: Omit<Commitment, 'id'> & { id?: string }) => void
  updateCommitment: (c: Commitment) => void
  markCommitmentPaid: (id: string, payDay?: number) => void
  deleteCommitment: (id: string) => void
  addSubscription: (s: Omit<Subscription, 'id'> & { id?: string }) => void
  updateSubscription: (s: Subscription) => void
  toggleSubscription: (id: string) => void
  deleteSubscription: (id: string) => void
  addGoal: (g: Omit<SavingsGoal, 'id'> & { id?: string }) => void
  updateGoal: (g: SavingsGoal) => void
  contributeToGoal: (goalId: string, amount: number, note?: string) => void
  deleteGoal: (id: string) => void
  setActiveSimulation: (scenario: SimulatedScenario) => void
  clearActiveSimulation: () => void
  applyActiveSimulation: () => void
  resetDemoData: () => void
}

export const FinanceContext = createContext<FinanceContextValue | null>(null)

export function useFinance(): FinanceContextValue {
  const context = useContext(FinanceContext)
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider')
  }
  return context
}
