# 🛡️ RupeeFlow Security Policy & Threat Model

> **RupeeFlow** is designed with a defense-in-depth model tailored for client-side fintech applications. Since it manages personal financial data on client devices without a centralized backend, security is anchored on strict input validation, browser sandbox isolation, and strong HTTP headers.

---

## 🔒 1. Threat Model & Mitigations

### 1.1 Cross-Site Scripting (XSS)
- **Threat**: Malicious user inputs injected into transaction notes, subscription descriptions, or goal names executing script payloads.
- **Defense**:
  1. All inputs pass through `sanitizeText()` in [`src/lib/sanitize.ts`](file:///src/lib/sanitize.ts), which strips all HTML tags (`/<[^>]*>?/gm`) and non-printable ASCII control characters (`/[\x00-\x1F\x7F]/g`).
  2. Strings are stored in plain form so React automatically contextual-escapes content during JSX rendering.
  3. No `dangerouslySetInnerHTML` is used anywhere in the codebase.

### 1.2 Prototype Pollution & Object Tampering
- **Threat**: Injected malicious keys (e.g., `__proto__`, `constructor`, `prototype`) through altered `localStorage` payloads attempting to modify Object prototypes.
- **Defense**:
  1. [`sanitizeSafeObject()`](file:///src/lib/sanitize.ts) deep-copies data into a null-prototype dictionary (`Object.create(null)`), discarding prototype override keys.
  2. Data loaded from `localStorage` undergoes strict schema verification before state dispatch.

### 1.3 Floating-Point Anomalies & Financial Overflow
- **Threat**: Non-finite numbers (`NaN`, `Infinity`), negative amounts in positive fields, or floating-point precision drifts causing mathematical inconsistencies.
- **Defense**:
  1. [`sanitizeAmount()`](file:///src/lib/sanitize.ts) validates finite numeric status, enforces minimum/maximum limits (e.g., max ₹1,000,000), and rounds to 2 decimal places using `Math.round(num * 100) / 100`.
  2. Cycle days are clamped between `1` and `30` via `sanitizeCycleDay()`.

### 1.4 Clickjacking & UI Redressing
- **Threat**: Malicious third-party sites framing RupeeFlow within an invisible iframe to hijack user interactions.
- **Defense**:
  - `X-Frame-Options: DENY` header configured in [`netlify.toml`](file:///netlify.toml) and [`vercel.json`](file:///vercel.json).
  - CSP directive `frame-ancestors 'none'` blocks all iframe embedding.

---

## 🌐 2. HTTP Security Headers

RupeeFlow ships with production-grade security headers configured across all deployment targets:

```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
Cache-Control: public, max-age=31536000, immutable (for static assets)
```

---

## 🔍 3. Dependency Vulnerability Auditing

- **Automated Audit**: Continuous verification via `npm audit`.
- **Policy**: Zero vulnerabilities permitted in production dependencies.
- **Current Status**: `0 vulnerabilities` across all 466 audited packages.
