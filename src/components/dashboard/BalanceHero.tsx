import React, { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import {
  Wallet,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react'
import { useFinance } from '../../state/useFinance'
import { formatRupees } from '../../finance/financeEngine'
import { SceneFallback } from '../visualization/SceneFallback'

// Lazy-load the heavy 3D WebGL scene to optimize initial bundle and fast rendering
const FinanceScene = lazy(() => import('../visualization/FinanceScene'))

export const BalanceHero: React.FC = () => {
  const { state, metrics } = useFinance()

  const isDiscretionaryNegative = metrics.availableDiscretionaryFunds < 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* Left Col: 3D Visualization */}
      <div className="lg:col-span-5 flex flex-col justify-between">
        <Suspense
          fallback={
            <SceneFallback
              cashBalance={metrics.cashBalance}
              safeDailyAllowance={metrics.safeDailyAllowance}
            />
          }
        >
          <FinanceScene
            cashBalance={metrics.cashBalance}
            safeDailyAllowance={metrics.safeDailyAllowance}
            currentDay={state.currentDay}
          />
        </Suspense>

        {/* Quick Health Tag beneath 3D Scene */}
        <div className="mt-3 p-3 rounded-xl bg-[#141822] border border-[#263045] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: metrics.healthColor }}
            />
            <span className="text-xs font-semibold text-[#F5F7FA]">
              Financial Health: {metrics.healthBand}
            </span>
          </div>
          <Link
            to="/insights"
            className="text-xs text-[#C8FF4D] hover:underline flex items-center gap-1 font-mono font-medium"
          >
            <span>{metrics.healthScore}/100</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Right Col: Breakdown & Discretionary Status */}
      <div className="lg:col-span-7 flex flex-col justify-between p-6 rounded-2xl bg-[#141822] border border-[#263045] shadow-xl relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C8FF4D]/5 rounded-full blur-3xl pointer-events-none" />

        <div>
          {/* Tag and Quick Indicator */}
          <div className="flex items-center justify-between pb-3 border-b border-[#263045]/60">
            <span className="text-xs font-mono uppercase tracking-wider text-[#A5ADBE] font-bold flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-[#C8FF4D]" /> 30-Day Budget Allocation
            </span>
            <span className="text-xs font-mono text-[#A5ADBE]">
              Day {state.currentDay} of 30 • {metrics.inclusiveDaysRemaining} days to pace
            </span>
          </div>

          {/* Primary Balance Headlines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
            {/* Total Liquid Cash In Hand */}
            <div className="p-4 rounded-xl bg-[#1B2130]/70 border border-[#263045]">
              <span className="text-xs text-[#A5ADBE] flex items-center gap-1.5 font-medium">
                <Wallet className="w-3.5 h-3.5 text-[#63E5F4]" /> Current Cash In Hand
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black font-mono text-[#F5F7FA]">
                  {formatRupees(metrics.cashBalance)}
                </span>
                <span className="text-xs text-[#A5ADBE] font-mono">
                  / {formatRupees(metrics.openingBudget)}
                </span>
              </div>
              <p className="text-[11px] text-[#A5ADBE] mt-1">
                Liquid funds remaining from starting ₹10k budget.
              </p>
            </div>

            {/* Safe Available Discretionary Funds */}
            <div
              className={`p-4 rounded-xl border relative overflow-hidden ${
                isDiscretionaryNegative
                  ? 'bg-[#FF5C5C]/10 border-[#FF5C5C]/40 text-[#FF5C5C]'
                  : 'bg-[#C8FF4D]/10 border-[#C8FF4D]/30 text-[#C8FF4D]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Truly Safe to Spend
                </span>
                {isDiscretionaryNegative && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#FF5C5C] text-white">
                    DEFICIT
                  </span>
                )}
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black font-mono">
                  {formatRupees(metrics.availableDiscretionaryFunds)}
                </span>
              </div>
              <p className="text-[11px] text-[#A5ADBE] mt-1">
                {isDiscretionaryNegative
                  ? 'Shortfall: Cash is insufficient for upcoming obligations!'
                  : 'After subtracting upcoming bills & planned savings.'}
              </p>
            </div>
          </div>

          {/* Sub-allocations Bar */}
          <div className="mt-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#A5ADBE]">
              <span>Cycle Budget Consumption</span>
              <span className="font-mono">
                {Math.round(((metrics.totalExpenses + metrics.upcomingCommitmentsTotal + metrics.outstandingPlannedSavingsTotal) / metrics.openingBudget) * 100)}% committed
              </span>
            </div>

            {/* Multi-segmented visual bar */}
            <div className="w-full h-3 rounded-full bg-[#1B2130] flex overflow-hidden p-0.5 border border-[#263045]">
              {/* Spent */}
              <div
                className="h-full bg-[#FF5C5C] rounded-l-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (metrics.totalExpenses / metrics.openingBudget) * 100)}%`,
                }}
                title={`Completed Spending: ${formatRupees(metrics.totalExpenses)}`}
              />
              {/* Transferred to Savings */}
              <div
                className="h-full bg-[#63E5F4] transition-all duration-500"
                style={{
                  width: `${Math.min(100, (metrics.totalSavingsTransfers / metrics.openingBudget) * 100)}%`,
                }}
                title={`Saved to Goals: ${formatRupees(metrics.totalSavingsTransfers)}`}
              />
              {/* Reserved for Commitments */}
              <div
                className="h-full bg-[#9875FF] transition-all duration-500"
                style={{
                  width: `${Math.min(100, (metrics.upcomingCommitmentsTotal / metrics.openingBudget) * 100)}%`,
                }}
                title={`Reserved for Bills: ${formatRupees(metrics.upcomingCommitmentsTotal)}`}
              />
              {/* Discretionary Remaining */}
              <div
                className="h-full bg-[#C8FF4D] rounded-r-full transition-all duration-500"
                style={{
                  width: `${Math.max(0, Math.min(100, (metrics.availableDiscretionaryFunds / metrics.openingBudget) * 100))}%`,
                }}
                title={`Discretionary Remaining: ${formatRupees(metrics.availableDiscretionaryFunds)}`}
              />
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-[11px] text-[#A5ADBE]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5C5C]" />
                Spent: {formatRupees(metrics.totalExpenses)}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#63E5F4]" />
                Saved: {formatRupees(metrics.totalSavingsTransfers)}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#9875FF]" />
                Reserved Obligations: {formatRupees(metrics.upcomingCommitmentsTotal)}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C8FF4D]" />
                Discretionary: {formatRupees(Math.max(0, metrics.availableDiscretionaryFunds))}
              </span>
            </div>
          </div>
        </div>

        {/* Safe Daily Allowance Callout */}
        <div className="mt-5 p-3.5 rounded-xl bg-gradient-to-r from-[#1B2130] to-[#141822] border border-[#263045] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#C8FF4D]/20 text-[#C8FF4D] flex items-center justify-center font-bold font-mono">
              ₹
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#F5F7FA]">
                  Safe Daily Spending Allowance
                </span>
                <span className="text-[10px] text-[#C8FF4D] font-mono px-1.5 py-0.2 rounded bg-[#C8FF4D]/10">
                  Day {state.currentDay}..30
                </span>
              </div>
              <p className="text-[11px] text-[#A5ADBE]">
                {metrics.safeDailyAllowance > 0
                  ? `You can safely spend ${formatRupees(metrics.safeDailyAllowance)} today without jeopardizing upcoming commitments.`
                  : 'Allowance is ₹0 due to budget deficit. Freeze variable spending.'}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xl font-black font-mono text-[#C8FF4D]">
              {formatRupees(metrics.safeDailyAllowance)}
            </span>
            <span className="text-[10px] text-[#A5ADBE] block">/ day</span>
          </div>
        </div>
      </div>
    </div>
  )
}
