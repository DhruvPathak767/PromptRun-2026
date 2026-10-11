# RupeeFlow Financial Engine Specification

## 1. Domain Overview & Mathematical Invariants
RupeeFlow models a **30-day personal finance cycle** anchored to a constrained **₹10,000 starting budget** tailored for Gen Z university students and young professionals.

The core financial engine is strictly isolated from React, UI components, and side effects. All mathematical transformations are pure, deterministic, and verifiable through automated test suites.

---

## 2. Core Mathematical Formulas

### 2.1 Cash Balance (`cashBalance`)
Actual liquid currency in hand at cycle day $D \in [1, 30]$:

$$\text{Cash Balance} = \text{Starting Budget} + \sum \text{Income} - \sum \text{Expenses} - \sum \text{Savings Transferred}$$

```typescript
cashBalance = startingBudget + totalIncome - totalExpenses - totalSavingsTransferred
```

---

### 2.2 Available Discretionary Funds (`availableDiscretionaryFunds`)
The true financial buffer remaining for unplanned living after accounting for hard commitments and target savings:

$$\text{Discretionary Buffer} = \text{Cash Balance} - \text{Unpaid Commitments} - \text{Outstanding Planned Savings}$$

```typescript
availableDiscretionaryFunds = cashBalance - upcomingCommitmentsTotal - outstandingPlannedSavingsTotal
```

> **Invariant**: If $\text{Discretionary Buffer} < 0$, the system enters **Deficit Warning** state (`paceStatus = 'deficit'`), triggering the **Broke Mode** automated triage engine.

---

### 2.3 Safe Daily Spending Allowance (`safeDailyAllowance`)
The sustainable daily spending rate allowed over remaining days to prevent hitting ₹0 before Day 30:

$$\text{Inclusive Days Remaining} = \max(1, 30 - D + 1)$$

$$\text{Safe Daily Allowance} = \begin{cases} 
0 & \text{if Discretionary Buffer} \le 0 \\
\left\lfloor \frac{\text{Discretionary Buffer}}{\text{Inclusive Days Remaining}} \right\rfloor & \text{otherwise}
\end{cases}$$

---

### 2.4 Actual Daily Burn Pace (`actualDailyAverage`)
Historical daily expenditure rate across elapsed cycle days:

$$\text{Actual Daily Average} = \frac{\text{Discretionary Spent Elapsed}}{\max(1, D)}$$

---

### 2.5 Runway & Deficit Crash Day Forecast (`projectedDeficitCrashDay`)
Dynamic runway projection estimating when liquid funds reach ₹0 under the current spending trajectory:

$$\text{Runway Days} = \left\lfloor \frac{\text{Cash Balance}}{\text{Actual Daily Average}} \right\rfloor$$

$$\text{Deficit Crash Day} = \begin{cases}
D + \text{Runway Days} & \text{if } D + \text{Runway Days} \le 30 \\
\text{null (Safe to Day 30)} & \text{otherwise}
\end{cases}$$

---

## 3. Financial Resilience Engine (Chaos Mode)

The **Chaos Mode Resilience Score** $\mathcal{R} \in [0, 100]$ evaluates balance durability against sudden financial shocks:

$$\mathcal{R} = S_{\text{liquid}} + S_{\text{buffer}} + S_{\text{pacing}}$$

Where:
- **Liquid Capital Score** ($S_{\text{liquid}} \in [0, 40]$): $\min\left(40, \frac{\text{Cash Balance}}{10000} \times 40\right)$
- **Discretionary Buffer Score** ($S_{\text{buffer}} \in [0, 30]$): $\min\left(30, \frac{\max(0, \text{Discretionary Buffer})}{3000} \times 30\right)$
- **Pacing Score** ($S_{\text{pacing}} \in [0, 30]$): If $\text{Safe Daily Allowance} \ge 150$, score $= 30$; otherwise $\frac{\text{Safe Daily Allowance}}{150} \times 30$.

### Resilience Tiers
| Score | Classification | Financial Posture |
|---|---|---|
| **80 – 100** | **Antifragile** | Absorbs high-severity emergencies without breaching safety buffer. |
| **60 – 79** | **Resilient** | Moderate emergency capacity; daily allowance remains above ₹100/day. |
| **40 – 59** | **Vulnerable** | High risk; single unexpected shock causes deficit trajectory. |
| **0 – 39** | **Deficit Risk** | Immediate triage required via Broke Mode bailout. |

---

## 4. Pure Selectors Layer (`src/finance/selectors.ts`)

To enforce the **UI $\rightarrow$ Engine** unidirectional data boundary, all reductions and financial math are encapsulated in pure selectors:

| Selector | Parameters | Return Value | Complexity |
|---|---|---|---|
| `selectActiveSubscriptions` | `subscriptions` | `Subscription[]` | $O(N)$ |
| `selectTotalMonthlySubCost` | `subscriptions` | `number` (INR) | $O(N)$ |
| `selectDailySubCost` | `subscriptions, daysRemaining` | `number` (INR/day) | $O(N)$ |
| `selectCategorySpend` | `transactions, category` | `number` (INR) | $O(T)$ |
| `selectHypotheticalDailyImpact` | `amount, daysRemaining` | `number` (INR/day) | $O(1)$ |
| `selectGoalProgressPercent` | `current, target` | `number` ($0 - 100\%$) | $O(1)$ |
| `selectChaiEquivalence` | `amount` | `number` (cups of tapri chai) | $O(1)$ |
| `selectEmergencyBailoutMetrics` | `subscriptions, allowance, days, goals` | `TriageMetrics` | $O(S + G)$ |

---

## 5. Non-Destructive What-If Simulation Engine (`src/finance/scenarioEngine.ts`)

The simulator clones state and projects alternative futures without mutating local persistence:

```typescript
function simulateScenario(baseState: FinanceState, scenario: Scenario): SimulationResult
```

- Calculates before vs. after metrics in isolated memory.
- Produces delta vectors ($\Delta \text{Discretionary}$, $\Delta \text{Daily Allowance}$, $\Delta \text{Crash Day}$).
- Provides 1-tap promotion from hypothetical projection to official ledger.
