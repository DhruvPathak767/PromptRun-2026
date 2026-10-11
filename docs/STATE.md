# RupeeFlow State Architecture & Lifecycle

## 1. Architectural Philosophy
RupeeFlow implements an **unidirectional, deterministic state architecture**. Financial state is strictly immutable and decoupled from the React presentation layer. 

```
┌────────────────────────────────┐
│      User Interactions / UI    │
└───────────────┬────────────────┘
                │ Dispatches Action
                ▼
┌────────────────────────────────┐
│   Finance Reducer (Pure Fns)   │
└───────────────┬────────────────┘
                │ Calculates New State
                ▼
┌────────────────────────────────┐
│ Immutable State + Derived Math │
│   (re-computed in O(1)/O(N))   │
└───────────────┬────────────────┘
                │ Synced to
                ▼
┌────────────────────────────────┐
│    LocalStorage (Schema v1)    │
└────────────────────────────────┘
```

---

## 2. State Schema (`FinanceState`)

```typescript
export interface FinanceState {
  currentDay: number               // 1 to 30
  startingBudget: number           // Default: ₹10,000
  transactions: Transaction[]      // Ledger entries
  commitments: Commitment[]        // Fixed bills & obligations
  subscriptions: Subscription[]    // Recurring digital services
  goals: SavingsGoal[]             // Targeted piggy-bank reserves
  activeSimulation: Scenario | null // Active What-If scenario
}
```

### Derived Metrics Container (`FinancialMetrics`)
Every state change automatically produces a frozen `FinancialMetrics` object via `computeFinancialMetrics(state)`:
- `cashBalance`: Current liquid funds
- `availableDiscretionaryFunds`: Unallocated cash buffer
- `safeDailyAllowance`: Sustainable spending per remaining day
- `actualDailyAverage`: Historical burn rate
- `projectedDeficitCrashDay`: Zero-cash date or null if solvent
- `survivalStreak`: Consecutive solvent cycle days
- `moneyVibe`: Gamified Gen Z archetype ('Disciplined Monk', 'Chaotic Spender', etc.)

---

## 3. Storage Persistence & Migration (`src/state/storage.ts`)

- **Storage Key**: `rupeeflow_v1_data`
- **Schema Validation**: Validates loaded JSON structure, data types, and array formats.
- **Corrupt Storage Fallback**: If corrupted or malformed data is found in `localStorage`, the storage engine gracefully falls back to the canonical seed state without crashing.
- **Reset to Seed**: Users can reset to factory baseline at any time via the Settings page (`RESET_TO_SEED`).

---

## 4. Action Creators & Dispatch Methods

| Action | Description | Consequence |
|---|---|---|
| `ADD_TRANSACTION` | Prepends new ledger entry | Recalculates cash balance & daily allowance |
| `UPDATE_TRANSACTION` | Modifies existing transaction | Updates ledger retroactively |
| `DELETE_TRANSACTION` | Removes transaction | Restores balance & recalculates pacing |
| `TOGGLE_SUBSCRIPTION` | Pauses or unpauses recurring bill | Adjusts upcoming commitments & monthly cost |
| `MARK_COMMITMENT_PAID` | Flags commitment as settled | Deducts cash balance, removes pending obligation |
| `DEPOSIT_GOAL` | Transfers cash into savings vault | Locks liquidity, increases goal progress % |
| `SET_CURRENT_DAY` | Changes simulation cycle day (1-30) | Updates days remaining and allowance pacing |
| `SET_ACTIVE_SIMULATION` | Activates What-If scenario overlay | Enables cross-screen comparative previews |

---

## 5. React Integration via `FinanceContext`

Components access state and actions through the strictly-typed custom hook:
```typescript
const { state, metrics, insights, addTransaction, setCurrentDay } = useFinance()
```
The provider memoizes state, derived metrics, and dispatch handlers to prevent unnecessary component re-renders.
