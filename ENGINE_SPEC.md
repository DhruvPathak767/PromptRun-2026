# RupeeFlow Financial Engine Specification

## 1. Domain Overview
RupeeFlow implements a deterministic, client-side financial simulation engine designed for managing a ₹10,000 monthly allowance over 30 days.

All calculations are pure functions:
$$\text{State}_{t} \xrightarrow{f} \text{Metrics}_{t}$$

---

## 2. Core Mathematical Formulations

### 2.1 Liquid Cash Balance ($C_t$)
$$C_t = \text{Initial Budget} + \sum_{i} \text{Income}_i - \sum_{j} \text{Expenses}_j$$

* Invariant: Real money paid out directly decreases $C_t$.

### 2.2 Locked Savings Balance ($S_t$)
$$S_t = \sum_{k} \text{SavedAmount}_k$$

* Invariant: Funds allocated to goal vaults remain liquid assets in cash, but are ring-fenced from discretionary spending.

### 2.3 Unpaid Mandatory Commitments ($U_t$)
$$U_t = \sum_{m \in \text{Unpaid}} \text{Amount}_m + \sum_{s \in \text{Unpaid Subs}} \text{Cost}_s$$

### 2.4 Available Discretionary Funds ($D_t$)
$$D_t = C_t - S_t - U_t$$

* Positive ($D_t > 0$): Surplus buffer for daily lifestyle spending.
* Negative ($D_t < 0$): Immediate cash deficit risk—user will default on bills or break savings goals before Day 30.

### 2.5 Safe Daily Spending Allowance ($A_t$)
$$A_t = \max\left(0, \; \left\lfloor \frac{D_t}{30 - t + 1} \right\rfloor \right)$$

Where $t \in [1, 30]$ is the current simulation cycle day, and $(30 - t + 1)$ is the remaining days inclusive.

### 2.6 Projected Month-End Cash ($P_t$)
$$P_t = C_t - U_t - (\text{Estimated Remaining Discretionary Spend})$$

### 2.7 Financial Health Score ($H_t \in [0, 100]$)
Composed of 4 weighted component vectors:
1. **Discretionary Solvency (35 pts)**: $35 \times \min(1, \max(0, D_t / 3000))$
2. **Pacing Discipline (25 pts)**: Ratio of current daily spend to safe daily allowance.
3. **Savings Rate (20 pts)**: $20 \times \min(1, S_t / 1000)$
4. **Commitment Coverage (20 pts)**: $20$ if $C_t \ge U_t$, decaying linearly if cash drops below unpaid commitments.

---

## 3. What-If Simulation Algorithm
When evaluating a hypothetical scenario $\Delta$ without mutating actual state:
$$\text{SimState} = \text{Reducer}(\text{CurrentState}, \Delta)$$
$$\text{SimMetrics} = \text{CalculateFinancialMetrics}(\text{SimState})$$
$$\Delta\text{Metrics} = \text{SimMetrics} - \text{CurrentMetrics}$$

The engine delivers instant delta reporting for:
- $\Delta C$ (Immediate liquid cash shift)
- $\Delta A$ (Change in safe daily spending capacity)
- $\Delta P$ (Impact on Day 30 finish balance)
- $\Delta H$ (Health score change)
