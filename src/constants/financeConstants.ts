/**
 * RupeeFlow Core Financial & Behavioral Constants
 * Single source of truth for all simulation rules and metric thresholds.
 */

export const FINANCE_CONSTANTS = {
  // Budget Challenge Constraints
  INITIAL_BUDGET_CAP: 10000,
  CYCLE_TOTAL_DAYS: 30,

  // Gen Z Behavioral Cost Units
  TAPRI_CHAI_COST: 20,
  CAMPUS_MEAL_COST: 120,
  OTT_SUB_AVERAGE: 199,

  // Financial Health Thresholds (0 - 100 scale)
  HEALTH_THRESHOLDS: {
    EXCELLENT: 80,
    GOOD: 65,
    FAIR: 50,
    DANGER: 35,
  },

  // Discretionary Cushion Targets
  COMFORTABLE_DISCRETIONARY_BUFFER: 3000,
  MINIMUM_SAFE_DAILY_ALLOWANCE: 150,

  // Cool-down Chamber Decay Duration (hours)
  COOL_DOWN_HOURS: 24,

  // Storage Keys
  STORAGE_KEYS: {
    STATE: 'rupeeflow_state_v1',
    COOLDOWN_VAULT: 'rupeeflow_cooldown_vault_v1',
    AUDIO_MUTED: 'rupeeflow_audio_muted',
  },
} as const
