# Changelog

All notable changes to the **RupeeFlow** personal finance command center are documented in this file.
The project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.2.0] - 2026-10-11
### Added
- **Chaos Mode Shock Simulator**: Dedicated financial shock generator injecting unexpected Gen Z emergencies (laptop spills, medical care, bike punctures) with real-time **Financial Resilience Score (0–100)** calculation.
- **Interconnected Consequence Live Tracker**: Persistent cross-screen ripple indicator displaying how recent decisions affect safe daily spending allowances and deficit forecasts.
- **Pure Financial Selectors Layer (`src/finance/selectors.ts`)**: 15 pure selectors isolating mathematical reductions, Chai equivalence, subscription amortization, and triage metrics from UI components.
- **Comprehensive Documentation Suite (`docs/`)**: Added `docs/ENGINE.md`, `docs/STATE.md`, and `docs/DECISIONS.md` (ADR log).
- **Architecture Barrel Files & `@/` Path Alias**: Organized modular imports across finance, hooks, components, and layout domains.
- **PWA & Site Manifest**: Added `/manifest.json`, `/robots.txt`, `/sitemap.xml`, and branded `/og-image.svg`.

### Optimized
- **Zero Preload Dynamic Chunking**: Eliminated Recharts and Three.js from the initial HTML preloader; entry bundle reduced from >215 KB gzipped to ~108 KB gzipped.
- **On-Demand WebGL Scene**: Defaulted to high-efficiency CSS 2.5D visualizer; Three.js loads strictly on demand.
- **Dynamic Confetti Module**: Converted static `canvas-confetti` imports to on-demand asynchronous loaders.
- **Streamlined Typography**: Substituted Google Fonts subset for lightning-fast First Contentful Paint.

### Accessibility & Quality Fixes
- **WCAG 2.2 AA Contrast Enforcement**: Replaced all `#6B778C` text with `#A5ADBE` (>5.5:1 contrast against dark backgrounds).
- **Typography Standardization**: Eliminated 100% of text under 12px (`text-[10px]` and `text-[11px]` upgraded to `text-xs`).
- **Touch Target Sizing**: Enforced minimum 36px–44px hitboxes on all interactive buttons and action icons.
- **Semantic Structure**: Added semantic `<footer>`, linked form errors to inputs with `aria-describedby` and `aria-invalid`, and balanced `<h1>` $\rightarrow$ `<h2>` $\rightarrow$ `<h3>` heading hierarchies.
- **Strict Linting**: Configured `.prettierrc` and elevated `@typescript-eslint/no-explicit-any` to `error`.

---

## [2.1.0] - 2026-10-10
### Added
- **Broke Mode Auto-Triage**: Algorithmic 3-step recovery system for budget deficits.
- **Survival Streak Gamification**: Day-by-day milestone tracking and financial resilience badges.
- **Money Vibe Wrap**: Personality archetypes summarizing spending habits over 30 days.
- **Impulse Buy Reality Checker**: Converts impulse purchases into Tapri Chai and Campus Meal equivalents.
- **Keyboard Shortcuts Engine**: Global modal bindings (`?`, `Alt+N`, `Alt+I`, `Alt+B`, `Alt+C`, `Alt+V`).

---

## [2.0.0] - 2026-10-09
### Added
- **What-If Simulation Lab**: Non-destructive hypothetical sandbox comparing baseline vs. proposed scenarios.
- **30-Day Calendar & Scrubber**: Time-travel timeline simulating cycle day transitions (Days 1 to 30).
- **Web Audio API Synthesizer**: Zero-dependency audio feedback for transactions and milestone unlocks.

---

## [1.0.0] - 2026-10-08
### Added
- Initial release of RupeeFlow 30-day financial tracker for ₹10,000 budget.
- Transaction ledger, recurring subscriptions manager, and savings goals vaults.
