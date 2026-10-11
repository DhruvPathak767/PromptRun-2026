# 🌌 RupeeFlow — Make Every Rupee Count

> **A 30-Day Financial Command Center for Gen Z**  
> Manage a limited ₹10,000 monthly budget, simulate financial decisions before committing real rupees, and build lasting financial resilience.

---

## 🚀 Product Overview

**RupeeFlow** is an interactive personal finance application designed for digitally native young adults, college students, and early-career professionals in India. Managing a ₹10,000 monthly budget across 30 days is inherently restrictive, but RupeeFlow turns constraint into a strategic game.

Unlike generic expense trackers, RupeeFlow’s central differentiator is the **What-If Decision Lab**: a dedicated non-destructive financial sandbox where users can test purchases (e.g. ₹2,499 sneakers), recurring subscriptions, savings deposits, or unexpected expenses to inspect their real-time impact on:
- **Cash in hand vs. safe discretionary funds**
- **Safe daily spending allowance** across remaining cycle days
- **Upcoming obligations and commitment cliffs**
- **Projected month-end balance** on Day 30
- **Deterministic 0–100 Financial Health score**

---

## ✨ Key Features

1. **Central Financial Engine**
   - Pure, deterministic calculation engine where opening budget (₹10,000), income, completed expenses, and savings transfers reconcile mathematically.
   - Strictly separates total cash from *safe discretionary funds* by factoring in unpaid bills, subscription charges, and outstanding planned savings.

2. **What-If Decision Lab (The Core Differentiator)**
   - Side-by-side comparison matrix of **Before Decision** vs. **After Decision** across 8 required metrics.
   - Plain-language consequence analysis (e.g. explains how a ₹2,499 purchase shrinks daily allowance from ₹394/day to ₹263/day for the next 19 days).
   - Instant live feedback as parameters change without mutating real state.
   - One-click **Apply Decision** workflow to commit the transaction directly to your persistent ledger.

3. **Interactive 30-Day Budget Planner**
   - 30-day visual cycle calendar tracking past spending, current position (Day 12), and forecasted burn.
   - Interactive cycle day inspector to see exactly which transactions occurred on any day.
   - **Purchase-to-Allowance Elasticity slider** illustrating how spontaneous costs shrink daily spending limits.

4. **Signature 3D Composition & Rich Aesthetics**
   - Original Three.js + React Three Fiber composition featuring a metallic bevelled ₹ rupee coin, orbiting 30-day cycle rings, and floating balance nodes.
   - Code-split and lazy-loaded with a high-fidelity 2.5D CSS/SVG `SceneFallback` ensuring instant first paint and graceful degradation on low-power devices.
   - Premium dark fintech palette: Midnight (`#0B0D12`), Electric Lime (`#C8FF4D`), Electric Violet (`#9875FF`), and Cyan (`#63E5F4`).

5. **Explainable Financial Health Score (0–100)**
   - Transparent scoring based on 4 deterministic factors: Discretionary Cushion (35 pts), Month-End Runaway (30 pts), Commitment Burden (20 pts), and Savings Consistency (15 pts).
   - Categorized into *Healthy* (80–100), *Needs Attention* (55–79), and *High Risk* (0–54).

6. **Savings Goal Vaults**
   - Goal progress tracking for emergency buffers, headphones, and certification bootcamps.
   - Deposits move money from cash to savings without incorrectly categorizing transfers as expenses.

7. **Subscriptions & Commitments Manager**
   - Manage monthly recurring charges (Spotify, iCloud, Prime).
   - Schedule fixed bills (hostel Wi-Fi, laundry, phone recharge).
   - Built-in deduplication ensures subscription charges and commitments are never double counted.

8. **Client-Side Persistence & Privacy**
   - Versioned schema stored in `localStorage` with defensive validation and fallback.
   - 100% private and offline: zero external bank APIs, zero backend servers, zero credential tracking.

---

## 🛠️ Technology Stack

- **Framework:** React 19 with TypeScript (Strict Mode enabled)
- **Tooling:** Vite 8
- **Styling:** Tailwind CSS v4 with custom CSS theme tokens & Glassmorphism
- **Routing:** React Router v7 with route-based code splitting
- **3D Graphics:** Three.js + React Three Fiber (`@react-three/fiber`)
- **Charts:** Recharts
- **Icons:** Lucide React
- **State Management:** React Context + `useReducer` with defensive localStorage persistence
- **Testing:** Vitest + React Testing Library (with jsdom)
- **Linter:** Oxlint (0 warnings, 0 errors)

---

## 📁 Project Structure

```text
src/
├── components/
│   ├── common/               # Modal, ConfirmDialog, ToastContainer
│   ├── dashboard/            # BalanceHero, FinancialMetric, SpendingChart, CommitmentsPreview, InsightsPreview
│   ├── finance/              # TransactionFormModal
│   ├── layout/               # AppShell, Sidebar, MobileNavigation, PageHeader
│   └── visualization/        # FinanceScene (3D R3F), SceneFallback (2.5D CSS)
├── data/
│   └── demoData.ts           # Pristine ₹10k Day 12 cycle baseline
├── finance/
│   ├── financeEngine.ts      # Core mathematical calculations & formatting
│   ├── financeEngine.test.ts # Comprehensive Vitest test suite
│   ├── financeTypes.ts       # Typed interfaces for transactions, metrics, goals, & scenarios
│   ├── insightsEngine.ts     # Rule-based contextual recommendations
│   ├── riskEngine.ts         # Deterministic 0-100 financial health model
│   └── scenarioEngine.ts     # Non-destructive What-If simulation engine
├── pages/
│   ├── BudgetPage.tsx        # 30-day timeline & allowance elasticity
│   ├── DashboardPage.tsx     # Hero command center
│   ├── GoalsPage.tsx         # Savings goals & deposits
│   ├── InsightsPage.tsx      # Health breakdown & recommendations
│   ├── SettingsPage.tsx      # Cycle day stepper & demo reset
│   ├── SimulatorPage.tsx     # What-If Decision Lab
│   ├── SubscriptionsPage.tsx # Recurring services & scheduled bills
│   └── TransactionsPage.tsx  # Searchable & editable ledger
├── state/
│   ├── FinanceContext.ts     # React Context definition & types
│   ├── FinanceProvider.tsx   # Root provider with auto-persistence
│   ├── financeReducer.ts     # Immutable state reducer
│   ├── persistence.ts        # Defensive localStorage parser
│   └── useFinance.ts         # Custom state hook
├── test/
│   ├── baseline.test.ts      # Testing environment smoke test
│   └── setup.ts              # Vitest DOM setup
├── App.tsx                   # Code-split SPA routing
├── index.css                 # Design tokens, typography, glassmorphism
└── main.tsx                  # App entry point
```

---

## 💻 Local Installation & Run Instructions

### 1. Prerequisites
- Node.js `v18+` or `v20+` (tested on Node `v24.19.0`)
- npm `v9+` or `v11+`

### 2. Clone and Install
```bash
# Clone the repository
git clone https://github.com/DhruvPathak767/PromptRun-2026.git
cd PromptRun-2026

# Install dependencies
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Available Validation Scripts

All evaluation scripts have been executed and verified:

```bash
# 1. Run strict TypeScript compiler
npm run typecheck

# 2. Run fast linter (Oxlint)
npm run lint

# 3. Run automated unit & integration test suite (Vitest)
npm run test

# 4. Create optimized production build
npm run build

# 5. Preview production build locally
npm run preview
```

---

## 📊 The Financial Model Explained

- **Opening Budget:** Exactly ₹10,000 baseline added once per cycle.
- **Cash Balance:** `Opening Budget + Additional Income − Expenses − Savings Deposits`.
- **Safe Discretionary Funds:** `Cash Balance − Upcoming Commitments − Outstanding Planned Savings`.
- **Safe Daily Allowance:** `Discretionary Funds ÷ Inclusive Days Remaining` (clamped to ₹0 if in deficit).
- **Projected Month-End Cash:** `Cash − Unpaid Obligations − Remaining Variable Spend Rate − Outstanding Planned Savings`.
- **Health Score (0–100):** Weighted sum of discretionary buffer (35%), projected month-end cushion (30%), obligation burden (20%), and savings consistency (15%).

---

## 🧪 How to Test a What-If Scenario

1. Click **What-If Lab** in the sidebar (or bottom bar on mobile).
2. Click the preset **"Buy sneakers for ₹2,499"** or enter a custom amount.
3. Observe the side-by-side comparison table updating in real time:
   - Notice liquid cash drops by ₹2,499.
   - Notice the Safe Daily Allowance drops from ~₹394/day to ~₹263/day across remaining days.
   - Read the generated consequence explanation describing how the purchase reduces liquidity cushion.
4. Click **Apply Decision to Ledger**:
   - The transaction is committed to real state.
   - An accessible confirmation toast confirms the addition.
   - Navigate to the **Dashboard** or **Transactions** to see all metrics updated in lockstep!

---

## 🌐 Static Deployment Instructions (Vercel / Netlify / Cloudflare Pages)

The project includes `vercel.json` configured for single-page history fallback:

### Deploy to Vercel
1. Push your repository to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. Framework Preset: **Vite**.
4. Build Command: `npm run build`.
5. Output Directory: `dist`.
6. Click **Deploy**. Direct navigation to any route (e.g. `/simulator`, `/budget`) works out of the box with zero 404 errors.

---

## 🔒 Privacy & Local Storage Disclosure

RupeeFlow is a **100% frontend simulation**. All financial data, custom transactions, and scenario comparisons run strictly in client-side memory and browser `localStorage`. No external financial accounts or APIs are connected.
