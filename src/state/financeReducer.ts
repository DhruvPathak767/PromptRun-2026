import {
  type RupeeFlowState,
  type Transaction,
  type Commitment,
  type Subscription,
  type SavingsGoal,
  type SimulatedScenario,
} from '../finance/financeTypes'
import { INITIAL_DEMO_STATE } from '../data/demoData'
import { applyScenarioToState } from '../finance/scenarioEngine'

export type FinanceAction =
  | { type: 'SET_CURRENT_DAY'; payload: number }
  | { type: 'ADD_TRANSACTION'; payload: Omit<Transaction, 'id'> & { id?: string } }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'ADD_COMMITMENT'; payload: Omit<Commitment, 'id'> & { id?: string } }
  | { type: 'UPDATE_COMMITMENT'; payload: Commitment }
  | { type: 'MARK_COMMITMENT_PAID'; payload: { id: string; payDay?: number } }
  | { type: 'DELETE_COMMITMENT'; payload: string }
  | { type: 'ADD_SUBSCRIPTION'; payload: Omit<Subscription, 'id'> & { id?: string } }
  | { type: 'UPDATE_SUBSCRIPTION'; payload: Subscription }
  | { type: 'TOGGLE_SUBSCRIPTION'; payload: string }
  | { type: 'DELETE_SUBSCRIPTION'; payload: string }
  | { type: 'ADD_GOAL'; payload: Omit<SavingsGoal, 'id'> & { id?: string } }
  | { type: 'UPDATE_GOAL'; payload: SavingsGoal }
  | { type: 'CONTRIBUTE_TO_GOAL'; payload: { goalId: string; amount: number; note?: string } }
  | { type: 'DELETE_GOAL'; payload: string }
  | { type: 'SET_ACTIVE_SIMULATION'; payload: SimulatedScenario }
  | { type: 'CLEAR_ACTIVE_SIMULATION' }
  | { type: 'APPLY_ACTIVE_SIMULATION' }
  | { type: 'RESET_DEMO_DATA' }

export function financeReducer(state: RupeeFlowState, action: FinanceAction): RupeeFlowState {
  switch (action.type) {
    case 'SET_CURRENT_DAY': {
      const nextDay = Math.min(30, Math.max(1, action.payload))
      return {
        ...state,
        currentDay: nextDay,
        lastUpdated: new Date().toISOString(),
      }
    }

    case 'ADD_TRANSACTION': {
      const tx: Transaction = {
        ...action.payload,
        id: action.payload.id || `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        amount: Math.abs(action.payload.amount),
      }
      return {
        ...state,
        transactions: [tx, ...state.transactions],
        lastUpdated: new Date().toISOString(),
      }
    }

    case 'UPDATE_TRANSACTION': {
      return {
        ...state,
        transactions: state.transactions.map((tx) =>
          tx.id === action.payload.id ? { ...action.payload, amount: Math.abs(action.payload.amount) } : tx
        ),
        lastUpdated: new Date().toISOString(),
      }
    }

    case 'DELETE_TRANSACTION': {
      return {
        ...state,
        transactions: state.transactions.filter((tx) => tx.id !== action.payload),
        lastUpdated: new Date().toISOString(),
      }
    }

    case 'ADD_COMMITMENT': {
      const c: Commitment = {
        ...action.payload,
        id: action.payload.id || `comm-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        amount: Math.abs(action.payload.amount),
        dueDay: Math.min(30, Math.max(1, action.payload.dueDay)),
      }
      return {
        ...state,
        commitments: [...state.commitments, c],
        lastUpdated: new Date().toISOString(),
      }
    }

    case 'UPDATE_COMMITMENT': {
      return {
        ...state,
        commitments: state.commitments.map((c) =>
          c.id === action.payload.id ? { ...action.payload, amount: Math.abs(action.payload.amount) } : c
        ),
        lastUpdated: new Date().toISOString(),
      }
    }

    case 'MARK_COMMITMENT_PAID': {
      const target = state.commitments.find((c) => c.id === action.payload.id)
      if (!target || target.isPaid) return state

      const payDay = action.payload.payDay || state.currentDay
      const txId = `tx-paid-${target.id}-${Date.now()}`

      // Create completed bill_payment transaction
      const billTx: Transaction = {
        id: txId,
        cycleDay: payDay,
        date: `Day ${payDay} • Paid`,
        amount: target.amount,
        description: `Bill Paid: ${target.name}`,
        category: target.category,
        type: 'bill_payment',
        isFixed: true,
        relatedId: target.id,
      }

      const updatedCommitments = state.commitments.map((c) =>
        c.id === target.id
          ? { ...c, isPaid: true, paidOnDay: payDay, paidTransactionId: txId }
          : c
      )

      return {
        ...state,
        transactions: [billTx, ...state.transactions],
        commitments: updatedCommitments,
        lastUpdated: new Date().toISOString(),
      }
    }

    case 'DELETE_COMMITMENT': {
      return {
        ...state,
        commitments: state.commitments.filter((c) => c.id !== action.payload),
        lastUpdated: new Date().toISOString(),
      }
    }

    case 'ADD_SUBSCRIPTION': {
      const sub: Subscription = {
        ...action.payload,
        id: action.payload.id || `sub-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        price: Math.abs(action.payload.price),
        billingDay: Math.min(30, Math.max(1, action.payload.billingDay)),
      }
      return {
        ...state,
        subscriptions: [...state.subscriptions, sub],
        lastUpdated: new Date().toISOString(),
      }
    }

    case 'UPDATE_SUBSCRIPTION': {
      return {
        ...state,
        subscriptions: state.subscriptions.map((s) =>
          s.id === action.payload.id ? { ...action.payload, price: Math.abs(action.payload.price) } : s
        ),
        lastUpdated: new Date().toISOString(),
      }
    }

    case 'TOGGLE_SUBSCRIPTION': {
      return {
        ...state,
        subscriptions: state.subscriptions.map((s) =>
          s.id === action.payload ? { ...s, active: !s.active } : s
        ),
        lastUpdated: new Date().toISOString(),
      }
    }

    case 'DELETE_SUBSCRIPTION': {
      return {
        ...state,
        subscriptions: state.subscriptions.filter((s) => s.id !== action.payload),
        lastUpdated: new Date().toISOString(),
      }
    }

    case 'ADD_GOAL': {
      const goal: SavingsGoal = {
        ...action.payload,
        id: action.payload.id || `goal-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        targetAmount: Math.abs(action.payload.targetAmount),
        currentAmount: Math.abs(action.payload.currentAmount || 0),
        plannedCycleContribution: Math.abs(action.payload.plannedCycleContribution || 0),
      }
      return {
        ...state,
        goals: [...state.goals, goal],
        lastUpdated: new Date().toISOString(),
      }
    }

    case 'UPDATE_GOAL': {
      return {
        ...state,
        goals: state.goals.map((g) =>
          g.id === action.payload.id ? { ...action.payload } : g
        ),
        lastUpdated: new Date().toISOString(),
      }
    }

    case 'CONTRIBUTE_TO_GOAL': {
      const { goalId, amount, note } = action.payload
      if (amount <= 0) return state

      const targetGoal = state.goals.find((g) => g.id === goalId)
      if (!targetGoal) return state

      const updatedGoals = state.goals.map((g) =>
        g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount } : g
      )

      const transferTx: Transaction = {
        id: `tx-sav-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        cycleDay: state.currentDay,
        date: `Day ${state.currentDay} • Savings Transfer`,
        amount,
        description: `Deposit to ${targetGoal.name}`,
        category: 'Learning & Books',
        type: 'savings_transfer',
        isFixed: false,
        note: note || `Manual savings contribution on Day ${state.currentDay}`,
        relatedId: goalId,
      }

      return {
        ...state,
        goals: updatedGoals,
        transactions: [transferTx, ...state.transactions],
        lastUpdated: new Date().toISOString(),
      }
    }

    case 'DELETE_GOAL': {
      return {
        ...state,
        goals: state.goals.filter((g) => g.id !== action.payload),
        lastUpdated: new Date().toISOString(),
      }
    }

    case 'SET_ACTIVE_SIMULATION': {
      return {
        ...state,
        activeSimulation: action.payload,
      }
    }

    case 'CLEAR_ACTIVE_SIMULATION': {
      return {
        ...state,
        activeSimulation: null,
      }
    }

    case 'APPLY_ACTIVE_SIMULATION': {
      if (!state.activeSimulation) return state
      return applyScenarioToState(state, state.activeSimulation)
    }

    case 'RESET_DEMO_DATA': {
      return {
        ...INITIAL_DEMO_STATE,
        lastUpdated: new Date().toISOString(),
      }
    }

    default:
      return state
  }
}
