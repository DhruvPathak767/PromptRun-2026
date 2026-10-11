import { type RupeeFlowState } from '../finance/financeTypes'
import { INITIAL_DEMO_STATE } from '../data/demoData'

const STORAGE_KEY = 'rupeeflow_state_v1'

/**
 * Defensive schema validator for persisted RupeeFlow state.
 * Returns true only if restored object matches required shape and constraints.
 */
export function isValidState(data: unknown): data is RupeeFlowState {
  if (!data || typeof data !== 'object') return false
  const state = data as Record<string, unknown>

  if (typeof state.version !== 'number' || state.version !== 1) return false
  if (typeof state.currentDay !== 'number' || state.currentDay < 1 || state.currentDay > 30) return false
  if (typeof state.openingBudget !== 'number' || state.openingBudget <= 0) return false
  if (!Array.isArray(state.transactions)) return false
  if (!Array.isArray(state.commitments)) return false
  if (!Array.isArray(state.subscriptions)) return false
  if (!Array.isArray(state.goals)) return false

  // Validate transaction items
  for (const item of state.transactions) {
    if (!item || typeof item !== 'object') return false
    const tx = item as Record<string, unknown>
    if (typeof tx.id !== 'string' || typeof tx.amount !== 'number' || !Number.isFinite(tx.amount) || tx.amount <= 0) {
      return false
    }
  }

  // Validate goal items
  for (const item of state.goals) {
    if (!item || typeof item !== 'object') return false
    const goal = item as Record<string, unknown>
    if (typeof goal.id !== 'string' || typeof goal.targetAmount !== 'number' || goal.targetAmount <= 0) {
      return false
    }
  }

  return true
}

/**
 * Safely loads state from localStorage with fallback to pristine demo data.
 */
export function loadPersistedState(): RupeeFlowState {
  if (typeof window === 'undefined' || !window.localStorage) {
    return INITIAL_DEMO_STATE
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return INITIAL_DEMO_STATE
    }

    const parsed: unknown = JSON.parse(raw)
    if (isValidState(parsed)) {
      return parsed
    }

    console.warn('[RupeeFlow] Stored data failed schema validation. Falling back to default demo state.')
    return INITIAL_DEMO_STATE
  } catch (err) {
    console.error('[RupeeFlow] Error parsing localStorage data:', err)
    return INITIAL_DEMO_STATE
  }
}

/**
 * Safely persists state into localStorage.
 */
export function savePersistedState(state: RupeeFlowState): void {
  if (typeof window === 'undefined' || !window.localStorage) return

  try {
    const payload = JSON.stringify({
      ...state,
      activeSimulation: null, // never persist temporary simulation in main ledger
      lastUpdated: new Date().toISOString(),
    })
    localStorage.setItem(STORAGE_KEY, payload)
  } catch (err) {
    console.error('[RupeeFlow] Failed to write state to localStorage:', err)
  }
}

/**
 * Clears localStorage and resets application state to default demo dataset.
 */
export function clearPersistedState(): void {
  if (typeof window === 'undefined' || !window.localStorage) return
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (err) {
    console.error('[RupeeFlow] Failed to clear localStorage:', err)
  }
}
