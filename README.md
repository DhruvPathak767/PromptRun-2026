# 🌌 RupeeFlow — Make Every Rupee Count

> 🌐 **Live Production Deployment:** [https://rupee-flow-124.netlify.app/](https://rupee-flow-124.netlify.app/)  
> 🏆 **Frontend Arena Track:** *Broke But Functional — Survive the Month* (₹10,000 / 30-Day Budget Challenge)  
> 📦 **GitHub Repository:** [https://github.com/DhruvPathak767/PromptRun-2026](https://github.com/DhruvPathak767/PromptRun-2026)

[![TypeScript Strict](https://img.shields.io/badge/TypeScript-Strict_Mode_100%25-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vitest Passing](https://img.shields.io/badge/Tests-57%2F57_Passed-4EAA25?logo=vitest&logoColor=white)](https://vitest.dev/)
[![ESLint & Oxlint](https://img.shields.io/badge/Linter-0_Errors_%7C_0_Warnings-4B32C3?logo=eslint&logoColor=white)](https://eslint.org/)
[![WCAG 2.2 AA Verified](https://img.shields.io/badge/Accessibility-WCAG_2.2_AA_Verified-9875FF)](./ACCESSIBILITY.md)
[![Bundle Entry](https://img.shields.io/badge/Entry_Bundle-108_KB_gzipped-00C781)](https://vitejs.dev/)
[![Security Audited](https://img.shields.io/badge/Security-0_Vulnerabilities_%7C_CSP_Strict-00C781)](./SECURITY.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## 🧭 Engineering & Architecture Documentation (`docs/`)

- 📐 **[Financial Engine Math Specification (docs/ENGINE.md)](./docs/ENGINE.md)**: Formal mathematical definitions, invariants, Chaos Mode resilience scoring ($0-100$), and simulation formulas.
- 🏗️ **[State Machine & Lifecycle (docs/STATE.md)](./docs/STATE.md)**: Unidirectional immutable state flow, action creators, LocalStorage schema v1, and fallback hydration.
- ⚖️ **[Architecture Decision Records (docs/DECISIONS.md)](./docs/DECISIONS.md)**: Formal ADR log covering Pure Deterministic Engine, Zero Preload Chunking, On-Demand 3D, and WCAG AA contrast tokens.
- 📝 **[Changelog (CHANGELOG.md)](./CHANGELOG.md)**: SemVer release log tracking all versioned updates.
- 🛡️ **[Security Policy (SECURITY.md)](./SECURITY.md)**: XSS tag-stripping, prototype-pollution defenses, and production Content-Security-Policy headers.
- ♿ **[Accessibility Audit (ACCESSIBILITY.md)](./ACCESSIBILITY.md)**: WCAG 2.2 AA token audit, keyboard shortcut map, and form linking.

---

## 🚀 Product Overview

**RupeeFlow** is a modern personal finance decision simulator built for Gen Z university students and young professionals managing a limited **₹10,000 budget over 30 days**.

Unlike static expense loggers that simply record past regrets, RupeeFlow models the **interconnected consequences** of financial decisions before they are committed:
- Distinguishes deceptive liquid cash from **safe discretionary living funds**.
- Dynamically recalculates **safe daily spending allowances** across remaining cycle days.
- Forecasts the exact **Deficit Crash Day** when zero-cash will occur under current spending velocities.
- Provides immediate automated recovery mechanisms through **Broke Mode** and **Chaos Mode**.

---

## ✨ Signature Innovations

### 1. 💥 Chaos Mode Financial Shock Generator & Resilience Engine
- **Real-Life Gen Z Emergencies**: Injects real-world financial surprises into the simulation (e.g., *Laptop Liquid Spill Repair* ₹1,450, *Phone Screen Shatter* ₹1,950, *Bike Tyre Burst* ₹520, *Emergency Dental Care* ₹980).
- **Algorithmic Resilience Score (0–100)**: Evaluates liquid buffer capacity ($40\%$), discretionary buffer surplus ($30\%$), and daily allowance sustainability ($30\%$). Classifies financial posture into *Antifragile*, *Resilient*, *Vulnerable*, or *Deficit Risk*.
- **1-Click Absorption**: Integrates shocks directly into the 30-day ledger and updates cross-screen consequences.

### 2. ⚡ Interconnected Consequence Live Ripple Tracker
- A persistent cross-screen indicator displaying the exact ripple effect of every financial decision.
- Translates additions, subscription changes, and emergency shocks into immediate daily allowance shifts and crash date forecasts across all views.

### 3. 🚨 "Broke Mode" Auto-Triage & 1-Click Bailout
- **Automated Liquidity Rescue**: Triggers when available discretionary funds drop below critical thresholds.
- **3-Step Prioritized Triage**:
  1. *Freeze Non-Essential Subscriptions* (Spotify, Netflix).
  2. *Ration Daily Allowance* (calculates minimum sustainable emergency spending per day).
  3. *Goal Vault Micro-Shield* (safely unlocks emergency allocations without defaulting on core bills).
- **1-Tap Execution**: Dispatches atomic state updates and plays celebratory fanfare.

### 4. ⏩ 30-Day Time-Travel Engine & Fast-Forward Scrubber
- **Interactive Scrubber & Auto-Play**: Fast-forward through Days 1–30 to simulate cash depletion and trajectory in real time.
- **Deficit Crash Date Predictor**: Pinpoints the exact calendar day when liquid funds reach ₹0.

### 5. ⚡ Impulse Buy Reality Checker & 24h Cool-Down Chamber
- **Tapri Chai & Campus Meal Equivalence**: Translates impulse cravings into tangible daily living units: **40 cups of Tapri Chai ☕** or **6.7 Campus Meals 🍱**.
- **Allowance Destruction Metric**: Visualizes how many days of future spending capacity the purchase burns.
- **24-Hour Cool-Down Vault**: Places impulse items in temporary isolation to leverage psychological urge decay.

### 6. 🔥 "Survive the Month" Gamification & Survival Streaks
- **Survival Probability Forecast**: Real-time score (15%–99%) forecasting likelihood of reaching Day 30 without deficit.
- **Cycle Milestones**: Tracks consecutive solvent cycle days with dynamic on-demand confetti animations.

### 7. ✨ 30-Day Money Vibe Card (Spotify-Wrapped Style)
- Generates a personalized Gen Z financial archetype (*The Chai-Powered Strategist ☕*, *The Vault Builder 🎯*, *The High-Octane Explorer ⚡*).
- 1-click clipboard sharing for social media.

### 8. 🔊 Zero-Asset Web Audio API Synthesizer
- Zero-dependency audio feedback generated in real time using native `AudioContext` (transaction chimes, deficit warning hums, milestone fanfares) with an accessible global mute toggle.

---

## ⚡ Performance Optimization & Architecture

- **Ultra-Lightweight Entry Payload**: Home entry bundle starts at **~108 KB gzipped** (down from >215 KB gzipped).
- **Zero Preload Vendor Chunking**: Vite/Rollup config isolates `vendor-react`. Recharts (`SpendingChart`) and Three.js (`FinanceScene`) are dynamic on-demand chunks with **zero `<link rel="modulepreload">` tags** in `dist/index.html`.
- **On-Demand 3D with 2.5D Fallback**: Initial hero renders an accessible CSS 2.5D visualizer; Three.js initializes only when user toggles the interactive orbit.
- **Pure Financial Selectors (`src/finance/selectors.ts`)**: 15 pure selector functions enforce the **UI $\rightarrow$ Engine** unidirectional boundary with zero financial reductions or rounding in UI components.
- **Streamlined Typography**: Google Fonts subset with `display=swap` and DNS prefetch.
- **PWA Ready**: Complete `/manifest.json`, `/robots.txt`, `/sitemap.xml`, and `/og-image.svg`.

---

## ♿ Accessibility Compliance (WCAG 2.2 Level AA)

- **Certified Contrast Tokens**: All secondary text updated to `#A5ADBE` (>5.5:1 contrast against dark card and page backgrounds, exceeding 4.5:1 AA requirement).
- **Zero Sub-12px Text**: 100% of micro-copy standardized to minimum `text-xs` (12px).
- **Accessible Touch Targets**: Minimum 36px–44px hitboxes on all interactive buttons and action icons.
- **Semantic Landmark Structure**: Semantic `<header>`, `<main>`, `<section aria-labelledby="...">`, and `<footer>`.
- **Form Error Linking**: Form errors programmatically linked to inputs via `aria-describedby` and `aria-invalid`.
- **Keyboard Shortcuts**: Global modal bindings (`?`, `Alt+N`, `Alt+I`, `Alt+B`, `Alt+C`, `Alt+V`).

---

## 🧪 Local Setup & Verification

```bash
# 1. Clone repository
git clone https://github.com/DhruvPathak767/PromptRun-2026.git
cd PromptRun-2026

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev

# 4. Run automated test suite (57/57 tests passing across 10 test suites)
npm run test

# 5. Run linter (0 errors, 0 warnings)
npm run lint

# 6. Run strict TypeScript check
npm run typecheck

# 7. Build production bundle
npm run build
```

---

## 📜 License
Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for details.
