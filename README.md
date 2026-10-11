# 🌌 RupeeFlow — Make Every Rupee Count

[![TypeScript Strict](https://img.shields.io/badge/TypeScript-Strict_Mode_100%25-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vitest Passing](https://img.shields.io/badge/Tests-44%2F44_Passed-4EAA25?logo=vitest&logoColor=white)](https://vitest.dev/)
[![ESLint & Oxlint](https://img.shields.io/badge/Linter-0_Errors_%7C_0_Warnings-4B32C3?logo=eslint&logoColor=white)](https://eslint.org/)
[![WCAG 2.2 AA Compliant](https://img.shields.io/badge/Accessibility-WCAG_2.2_AA_Compliant-9875FF)](./ACCESSIBILITY.md)
[![Security Audited](https://img.shields.io/badge/Security-0_Vulnerabilities_%7C_CSP_Strict-00C781)](./SECURITY.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![CI Workflow](https://img.shields.io/badge/CI-GitHub_Actions_Passing-2088FF?logo=githubactions&logoColor=white)](./.github/workflows/ci.yml)

> **Live Deployment:** [https://rupee-flow-124.netlify.app/](https://rupee-flow-124.netlify.app/)  
> **Team:** `FrontendSmashers` | **Hackathon Track:** *Broke But Functional — Survive the Month*  
> **Repository:** [https://github.com/DhruvPathak767/PromptRun-2026](https://github.com/DhruvPathak767/PromptRun-2026)

---

## 🧭 Architectural & Governance Documentation

- 🏗️ **[System Architecture & Data Flow (ARCHITECTURE.md)](./ARCHITECTURE.md)**: Layered design, domain math decoupling, state lifecycle, and bundle splitting topology.
- 📐 **[Financial Engine Math Specification (ENGINE_SPEC.md)](./ENGINE_SPEC.md)**: Formal mathematical definitions, invariants, and What-If simulation delta formulas.
- 🛡️ **[Security Policy & Threat Model (SECURITY.md)](./SECURITY.md)**: XSS tag-stripping, prototype-pollution defenses, and production Content-Security-Policy headers.
- ♿ **[Accessibility & WCAG 2.2 AA Audit Matrix (ACCESSIBILITY.md)](./ACCESSIBILITY.md)**: Focus trap implementation, ARIA live announcements, and keyboard shortcuts map.
- 📝 **[Changelog (CHANGELOG.md)](./CHANGELOG.md)**: Structured release history following Keep a Changelog.
- 🤝 **[Contributing Guidelines (CONTRIBUTING.md)](./CONTRIBUTING.md)**: Engineering standards and automated CI checklist.
- 📜 **[Code of Conduct (CODE_OF_CONDUCT.md)](./CODE_OF_CONDUCT.md)**: Contributor Covenant v2.1.
- 📄 **[MIT License (LICENSE)](./LICENSE)**: Permissive open-source licensing.

---

## 🚀 Product Overview

**RupeeFlow** is a production-grade personal finance command center designed for Gen Z managing a limited ₹10,000 budget over 30 days. Rather than acting as a static expense tracker, RupeeFlow transforms financial survival into a transparent, gamified decision-making system.

Young adults face recurring commitments, sudden social temptations, and unpredictable cash cliffs. RupeeFlow provides immediate mathematical clarity, distinguishing illusory cash from **safe discretionary funds**, and delivers actionable tools to survive the month with positive savings.

---

## ✨ Signature Gen Z Innovations

### 1. 🚨 "Broke Mode" Auto-Triage & 1-Click Bailout Engine
- **Algorithmic Liquidity Rescue**: When discretionary cash drops below safety thresholds (< ₹1,000), Broke Mode activates.
- **3-Step Prioritized Triage**:
  1. *Freeze Non-Essential Subscriptions* (Spotify, Netflix).
  2. *Ration Daily Allowance* (calculates emergency daily allowance cuts across remaining cycle days).
  3. *Goal Vault Micro-Shield* (safely unlocks emergency allocations without defaulting on core bills).
- **1-Click Execution**: Instantly updates state, saves buffer, and plays milestone feedback.

### 2. ⏩ 30-Day Time-Travel Engine & Zero-Cash Forecast
- **Interactive Fast-Forward Scrubber**: Scrub or auto-play through days 1–30 to simulate cash depletion in real time.
- **Deficit Crash Date Predictor**: Dynamically forecasts the exact calendar day user will run out of money based on current spending velocity.

### 3. ⚡ Impulse Buy Reality Checker & 24h Cool-Down Chamber
- **Tapri Chai & Campus Meal Index**: Translates any impulse craving (e.g., ₹799 Zara hoodie or Swiggy order) into tangible units: **40 cups of Tapri Chai ☕** or **6.7 Campus Meals 🍱**.
- **Allowance Destruction Calculator**: Shows how many days of daily allowance are burned.
- **24-Hour Cool-Down Chamber**: Locks impulse cravings into local storage (87% urge decay psychology).

### 4. 🔥 "Survive the Month" Challenge & Streak Gamification
- **Deterministic Survival Probability**: Real-time score (15%–99%) forecasting likelihood of reaching Day 30 without deficit.
- **30-Day Cycle Streak**: Consecutive days without budget exhaustion with particle confetti animations.
- **Achievement Badges**: *Discretionary Discipline*, *Zen Cash Buffer*, *Subscription Auditor*, *Vault Builder*.

### 5. ✨ 30-Day Money Vibe Card (Spotify-Wrapped Style)
- Generates a personalized Gen Z financial archetype (*The Chai-Powered Strategist ☕*, *The Vault Builder 🎯*, *The High-Octane Explorer ⚡*).
- 1-click clipboard sharing for social media.

### 6. 🔊 Pure Web Audio Haptic & Synthesizer Feedback
- Zero-dependency audio feedback using browser `AudioContext`: positive transaction chimes, deficit alert hums, and celebration fanfares with an accessible global mute toggle.

### 7. ⌨️ Accessible Keyboard Navigation & Shortcuts Cheatsheet
- Power-user keyboard bindings (`Alt+N` Add Expense, `Alt+I` Impulse Buster, `Alt+B` Broke Mode, `Alt+S` Simulator) with global cheatsheet dialog via `?`.

---

## 🛠️ Technology Stack & Architecture

- **Framework**: React 19 + TypeScript (Strict Mode with zero `any`)
- **Build Tool**: Vite 8 with Rollup manual route chunking
- **Styling**: Tailwind CSS v4 + Vanilla CSS Design System
- **Icons**: Lucide React
- **Visuals**: Three.js & React Three Fiber (deferred loading behind on-demand toggle)
- **Charts**: Recharts with screen-reader table fallback toggle
- **Quality**: ESLint 9, Oxlint, Vitest, JSDOM

---

## 🧪 Local Setup & Verification

```bash
# 1. Clone the repository
git clone https://github.com/dhruvpathak767/promptrun-2026.git
cd promptrun-2026

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev

# 4. Run automated test suite (44/44 tests)
npm run test

# 5. Run linter (0 errors, 0 warnings)
npm run lint

# 6. Strict typecheck
npm run typecheck

# 7. Production build
npm run build
```

---

## 📜 License
Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for full details.
