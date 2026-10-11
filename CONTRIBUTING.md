# 🤝 Contributing to RupeeFlow

Thank you for contributing to **RupeeFlow**! To maintain enterprise code quality, mathematical precision, and zero-defect accessibility, please adhere to the following development standards.

---

## 🛠️ Local Development Setup

1. **Clone repository**:
   ```bash
   git clone https://github.com/DhruvPathak767/PromptRun-2026.git
   cd PromptRun-2026
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start local development server**:
   ```bash
   npm run dev
   ```

4. **Run automated test suite**:
   ```bash
   npm run test
   ```

---

## 📐 Engineering Guidelines

### 1. Strict TypeScript
- All code must pass `npm run typecheck` with zero errors.
- Never use `any`. Use strict domain models from `src/finance/financeTypes.ts`.

### 2. Zero-Tolerance Linting
- Run `npm run lint` before committing.
- Codebase must have **0 ESLint errors** and **0 Oxlint errors**.
- All form inputs must have associated `<label htmlFor="...">` and `<input id="...">`.

### 3. Financial Engine Purity
- Logic in `src/finance/` must remain pure functions without React or browser DOM dependencies.
- Every new financial computation must be accompanied by unit tests in `src/finance/financeEngine.test.ts`.

---

## 🧪 Pre-Commit Verification Checklist

Before opening a pull request or pushing:
```bash
npm run lint       # Must return 0 errors, 0 warnings
npm run typecheck  # Must exit with code 0
npm run test       # Must pass all unit and integration tests
npm run build      # Must create a clean production build
npm audit          # Must report 0 vulnerabilities
```
