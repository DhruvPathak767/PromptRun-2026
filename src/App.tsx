import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import { FinanceProvider } from './state/FinanceProvider'
import { AppShell } from './components/layout/AppShell'
import { ErrorBoundary } from './components/common/ErrorBoundary'

// Lazy-load page components for optimal initial load speed and code splitting
const DashboardPage = lazy(() =>
  import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage }))
)
const TransactionsPage = lazy(() =>
  import('./pages/TransactionsPage').then((m) => ({ default: m.TransactionsPage }))
)
const BudgetPage = lazy(() =>
  import('./pages/BudgetPage').then((m) => ({ default: m.BudgetPage }))
)
const GoalsPage = lazy(() =>
  import('./pages/GoalsPage').then((m) => ({ default: m.GoalsPage }))
)
const SubscriptionsPage = lazy(() =>
  import('./pages/SubscriptionsPage').then((m) => ({ default: m.SubscriptionsPage }))
)
const SimulatorPage = lazy(() =>
  import('./pages/SimulatorPage').then((m) => ({ default: m.SimulatorPage }))
)
const InsightsPage = lazy(() =>
  import('./pages/InsightsPage').then((m) => ({ default: m.InsightsPage }))
)
const SettingsPage = lazy(() =>
  import('./pages/SettingsPage').then((m) => ({ default: m.SettingsPage }))
)

const PageLoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 rounded-full border-2 border-[#263045] border-t-[#C8FF4D] animate-spin" />
      <span className="text-xs font-mono text-[#A5ADBE] animate-pulse">
        RupeeFlow Engine Synchronizing...
      </span>
    </div>
  </div>
)

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
        <FinanceProvider>
          <BrowserRouter>
            <Suspense fallback={<PageLoadingFallback />}>
              <Routes>
                <Route element={<AppShell />}>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/transactions" element={<TransactionsPage />} />
                  <Route path="/budget" element={<BudgetPage />} />
                  <Route path="/goals" element={<GoalsPage />} />
                  <Route path="/subscriptions" element={<SubscriptionsPage />} />
                  <Route path="/simulator" element={<SimulatorPage />} />
                  <Route path="/insights" element={<InsightsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </FinanceProvider>
      </MotionConfig>
    </ErrorBoundary>
  )
}

export default App
