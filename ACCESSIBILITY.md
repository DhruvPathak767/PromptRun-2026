# ♿ RupeeFlow Accessibility & WCAG 2.2 AA Specification

> **RupeeFlow** is built with accessibility as a core architectural constraint. Every interactive element, financial visualization, modal window, and data table adheres strictly to WCAG 2.2 Level AA guidelines.

---

## 📋 1. WCAG 2.2 AA Audit Matrix

| Guideline | WCAG Criterion | Implementation in RupeeFlow |
| :--- | :--- | :--- |
| **Non-text Content** | 1.1.1 (Level A) | Charts include `role="img"`, dynamic `aria-label` summary, and a dedicated **"View as Table"** toggle. Icons have descriptive `aria-label`s or are marked decorative. |
| **Info and Relationships** | 1.3.1 (Level A) | Semantic landmarks (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`). Form `<label>` tags explicitly linked to inputs with `htmlFor` and `id`. Data tables feature `scope="col"` and `scope="row"` headers. |
| **Contrast (Minimum)** | 1.4.3 (Level AA) | All body text, data points, and labels exceed the 4.5:1 contrast ratio against the dark background (`#0B0D12` / `#141822`). Brand accents (`#C8FF4D`, `#63E5F4`) provide >8:1 contrast. |
| **Keyboard Accessible** | 2.1.1 (Level A) | 100% of user flows (What-If simulation, goal creation, expense editing, day stepping) are operable via standard keyboard without requiring a mouse. |
| **No Keyboard Trap** | 2.1.2 (Level A) | Modals trap focus circularly (`Tab` and `Shift+Tab` stay inside active dialog) and release focus properly to the triggering element upon closure or `Escape`. |
| **Bypass Blocks** | 2.4.1 (Level A) | A visible-on-focus skip link (`#main-content`) is available at the start of every page. |
| **Page Titled** | 2.4.2 (Level A) | Document title updates dynamically on every route change (`RupeeFlow — Dashboard`, `RupeeFlow — What-If Simulator`, etc.). |
| **Focus Visible** | 2.4.7 (Level AA) | High-visibility focus indicators enabled across all interactive controls (`focus-visible:ring-2 focus-visible:ring-[#C8FF4D]`). |
| **Status Messages** | 4.1.3 (Level AA) | Dynamic route changes, notifications, and balance recalculations are announced via `aria-live="polite"` regions. |
| **Reduced Motion** | 2.3.3 (Level AAA) | Wrapped in `<MotionConfig reducedMotion="user">` and CSS `@media (prefers-reduced-motion: reduce)`. 3D Three.js canvas gracefully switches to a static 2.5D visualizer. |

---

## ⌨️ 2. Keyboard Navigation Map

- **`Tab` / `Shift + Tab`**: Navigate sequentially through interactive elements.
- **`Enter` / `Space`**: Activate buttons, open modals, toggle table views.
- **`Escape`**: Dismiss active modals, dropdowns, or notifications.
- **`Arrow Keys`**: Adjust range sliders (e.g. elasticity sliders in Budget planner).

---

## 🔍 3. Automated & Unit Accessibility Testing

RupeeFlow includes automated component-level accessibility tests in `src/test/Accessibility.test.tsx`:
- Focus trap verification inside `Modal`
- ARIA attribute validation (`role="dialog"`, `aria-modal="true"`, `aria-label`)
- Skip link navigation target resolution
- Form label-to-control association verification
