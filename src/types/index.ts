/**
 * Centralized Domain Type Definitions
 */

export * from '../finance/financeTypes'
export * from '../routes/routeMeta'

export interface KeyShortcut {
  key: string
  description: string
  action: () => void
}
