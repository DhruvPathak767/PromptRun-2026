import React, { useState } from 'react'
import {
  Calendar,
  PieChart,
  Info,
} from 'lucide-react'
import { useFinance } from '../state/useFinance'
import { formatRupees } from '../finance/financeEngine'
import {
  selectTransactionsTotal,
  selectHypotheticalDailyImpact,
  selectVariableDiscretionarySpend,
  selectFixedExpensesSoFar,
} from '../finance/selectors'

export const BudgetPage: React.FC = () => {
  const { state, metrics, setCurrentDay } = useFinance()
  const [selectedDay, setSelectedDay] = useState<number>(state.currentDay)

  // Transactions belonging to selected day
  const dayTransactions = state.transactions.filter((tx) => tx.cycleDay === selectedDay)

  // Commitments due on selected day
  const dayCommitments = state.commitments.filter((c) => c.dueDay === selectedDay)

  const dayTotalSpend = selectTransactionsTotal(
    dayTransactions.filter((tx) => tx.type === 'expense' || tx.type === 'bill_payment')
  )

  // What-If Impact preview calculator: how a ₹X purchase impacts daily allowance
  const [hypoPurchase, setHypoPurchase] = useState<number>(500)
  const hypoAllowanceImpact = selectHypotheticalDailyImpact(
    hypoPurchase,
    metrics.inclusiveDaysRemaining
  )

  return (
    <div className="space-y-6">
      {/* Overview Metric Row */}
      <section aria-labelledby="budget-overview-heading" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <h2 id="budget-overview-heading" className="sr-only">
          30-Day Budget Key Rates
        </h2>
        <div className="p-4 rounded-xl bg-[#141822] border border-[#263045]">
          <span className="text-xs text-[#A5ADBE] font-medium">Safe Daily Spending Rate</span>
          <span className="text-2xl font-black font-mono text-[#C8FF4D] block mt-1">
            {formatRupees(metrics.safeDailyAllowance)}/day
          </span>
          <p className="text-xs text-[#A5ADBE] mt-1">
            Across {metrics.inclusiveDaysRemaining} remaining days (Day {state.currentDay}..30).
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#141822] border border-[#263045]">
          <span className="text-xs text-[#A5ADBE] font-medium">Discretionary Buffer</span>
          <span className="text-2xl font-black font-mono text-[#63E5F4] block mt-1">
            {formatRupees(metrics.availableDiscretionaryFunds)}
          </span>
          <p className="text-xs text-[#A5ADBE] mt-1">
            Total unallocated capital for spontaneous living.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#141822] border border-[#263045]">
          <span className="text-xs text-[#A5ADBE] font-medium">Fixed & Scheduled Obligations</span>
          <span className="text-2xl font-black font-mono text-[#9875FF] block mt-1">
            {formatRupees(metrics.upcomingCommitmentsTotal)}
          </span>
          <p className="text-xs text-[#A5ADBE] mt-1">
            {metrics.upcomingCommitmentsCount} upcoming bills & active subscriptions.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#141822] border border-[#263045]">
          <span className="text-xs text-[#A5ADBE] font-medium">Target Savings Allocation</span>
          <span className="text-2xl font-black font-mono text-[#34D399] block mt-1">
            {formatRupees(metrics.outstandingPlannedSavingsTotal)}
          </span>
          <p className="text-xs text-[#A5ADBE] mt-1">
            Cycle contributions reserved for goals.
          </p>
        </div>
      </section>

      {/* 30-Day Calendar Grid */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#141822] border border-[#263045] shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#263045]/60">
          <div>
            <h2 className="text-base font-bold font-display text-[#F5F7FA] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#C8FF4D]" /> 30-Day Cycle Timeline & Calendar
            </h2>
            <p className="text-xs text-[#A5ADBE] mt-0.5">
              Click any cycle day to inspect transactions, scheduled obligations, and spending burn.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#A5ADBE]">Simulate Current Day:</span>
            <div className="flex gap-1 bg-[#1B2130] p-1 rounded-xl border border-[#263045]">
              {[1, 5, 12, 18, 25, 30].map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    setCurrentDay(d)
                    setSelectedDay(d)
                  }}
                  className={`px-2 py-0.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    state.currentDay === d
                      ? 'bg-[#C8FF4D] text-[#0B0D12]'
                      : 'text-[#A5ADBE] hover:text-[#F5F7FA]'
                  }`}
                >
                  D{d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 30 Day Interactive Matrix (5 rows of 6 or 6 rows of 5) */}
        <section
          aria-label="30-day budget calendar matrix"
          className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-10 gap-2 sm:gap-2.5 mt-5"
        >
          {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
            const isPast = day < state.currentDay
            const isToday = day === state.currentDay
            const isFuture = day > state.currentDay
            const isSelected = day === selectedDay

            // Spending on this day
            const spend = selectTransactionsTotal(
              state.transactions.filter(
                (tx) => tx.cycleDay === day && (tx.type === 'expense' || tx.type === 'bill_payment')
              )
            )

            // Obligations due
            const hasCommitment = state.commitments.some((c) => c.dueDay === day) ||
              state.subscriptions.some((s) => s.active && s.billingDay === day)

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`p-2.5 rounded-xl border text-left flex flex-col justify-between h-20 transition-all relative ${
                  isSelected
                    ? 'border-[#C8FF4D] bg-[#1B2130] shadow-md ring-1 ring-[#C8FF4D]'
                    : isToday
                    ? 'border-[#63E5F4] bg-[#141822] shadow-sm'
                    : 'border-[#263045] bg-[#141822]/70 hover:border-[#3B4A6B]'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-xs font-bold font-mono ${
                      isToday
                        ? 'text-[#63E5F4]'
                        : isPast
                        ? 'text-[#F5F7FA]'
                        : 'text-[#A5ADBE]'
                    }`}
                  >
                    D{day}
                  </span>
                  {isToday && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#63E5F4] animate-ping" />
                  )}
                  {hasCommitment && !isToday && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9875FF]" title="Commitment Due" />
                  )}
                </div>

                <div className="w-full">
                  {spend > 0 ? (
                    <span className="text-xs font-mono font-bold text-[#FF5C5C] block truncate">
                      −₹{spend}
                    </span>
                  ) : isFuture ? (
                    <span className="text-xs font-mono text-[#A5ADBE] block truncate">
                      ~₹{metrics.safeDailyAllowance}
                    </span>
                  ) : (
                    <span className="text-xs text-[#A5ADBE] block">₹0</span>
                  )}
                </div>
              </button>
            )
          })}
        </section>
      </div>

      {/* Selected Day Inspector & Category Allocations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Selected Day Inspector (Left Column) */}
        <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl bg-[#141822] border border-[#263045] shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#263045]/60">
            <div>
              <h3 className="text-sm font-bold font-display text-[#F5F7FA]">
                Day {selectedDay} Breakdown
              </h3>
              <span className="text-xs text-[#A5ADBE]">
                {selectedDay === state.currentDay
                  ? 'Today (Current Position)'
                  : selectedDay < state.currentDay
                  ? 'Completed Historical Day'
                  : 'Upcoming Future Day'}
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-[#F5F7FA]">
              {selectedDay <= state.currentDay
                ? `Actual: ${formatRupees(dayTotalSpend)}`
                : `Target Allowance: ${formatRupees(metrics.safeDailyAllowance)}`}
            </span>
          </div>

          {/* Scheduled Commitments on this Day */}
          {dayCommitments.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#9875FF] block">
                Scheduled Obligations Due Today:
              </span>
              {dayCommitments.map((c) => (
                <div
                  key={c.id}
                  className="p-2.5 rounded-xl bg-[#1B2130] border border-[#263045] flex items-center justify-between text-xs"
                >
                  <span className="font-medium text-[#F5F7FA]">{c.name}</span>
                  <span className="font-mono font-bold text-[#9875FF]">
                    {formatRupees(c.amount)} {c.isPaid ? '(Paid)' : '(Unpaid)'}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Transactions on this Day */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[#A5ADBE] block">
              Ledger Transactions ({dayTransactions.length}):
            </span>
            {dayTransactions.length === 0 ? (
              <p className="text-xs text-[#A5ADBE] py-2 italic">
                No recorded transactions on Day {selectedDay}.
              </p>
            ) : (
              <div className="space-y-2">
                {dayTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-2.5 rounded-xl bg-[#1B2130]/80 border border-[#263045] flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-medium text-[#F5F7FA] block">{tx.description}</span>
                      <span className="text-xs text-[#A5ADBE]">{tx.category}</span>
                    </div>
                    <span
                      className={`font-mono font-bold ${
                        tx.type === 'income' ? 'text-[#C8FF4D]' : 'text-[#F5F7FA]'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '−'}
                      {formatRupees(tx.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interactive Allowance Impact Explainer */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#1B2130] to-[#141822] border border-[#263045] text-xs">
            <div className="flex items-center gap-2 text-[#C8FF4D] font-bold mb-1.5">
              <Info className="w-4 h-4" />
              <span>Purchase-to-Allowance Elasticity</span>
            </div>
            <p className="text-xs text-[#A5ADBE] leading-relaxed">
              If you spend an extra ₹{hypoPurchase} today, your daily spending limit for every remaining{' '}
              {metrics.inclusiveDaysRemaining} days drops by{' '}
              <strong className="text-[#FF5C5C] font-mono">
                −₹{hypoAllowanceImpact}/day
              </strong>
              .
            </p>
            <div className="flex items-center gap-2 mt-2.5">
              <input
                type="range"
                aria-label="Simulated purchase amount"
                min="100"
                max="3000"
                step="100"
                value={hypoPurchase}
                onChange={(e) => setHypoPurchase(Number(e.target.value))}
                className="flex-1 accent-[#C8FF4D]"
              />
              <span className="font-mono text-xs text-[#F5F7FA]">₹{hypoPurchase}</span>
            </div>
          </div>
        </div>

        {/* Category Breakdown & Fixed vs Variable (Right Column) */}
        <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-[#141822] border border-[#263045] shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#263045]/60">
            <h3 className="text-sm font-bold font-display text-[#F5F7FA] flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[#63E5F4]" /> Category Allocations & Fixed vs Variable
            </h3>
            <span className="text-xs font-mono text-[#A5ADBE]">
              Total Spent: {formatRupees(metrics.totalExpenses)}
            </span>
          </div>

          {/* Category Progress Bars */}
          <div className="space-y-3">
            {metrics.categoryBreakdown.map((cat) => (
              <div key={cat.category} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#F5F7FA] font-medium flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    {cat.category}
                  </span>
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-[#A5ADBE]">{cat.percentage}%</span>
                    <span className="font-bold text-[#F5F7FA]">{formatRupees(cat.amount)}</span>
                  </div>
                </div>
                <div
                  className="w-full h-2 rounded-full bg-[#1B2130] overflow-hidden"
                  role="progressbar"
                  aria-valuenow={cat.percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${cat.category} expense allocation`}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${cat.percentage}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Fixed vs Variable Comparison Cards */}
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#263045]">
            <div className="p-3.5 rounded-xl bg-[#1B2130]/60 border border-[#263045]">
              <span className="text-xs font-medium text-[#A5ADBE] block">Fixed Bills & Obligations</span>
              <span className="text-base font-bold font-mono text-[#9875FF] block mt-1">
                {formatRupees(
                  selectFixedExpensesSoFar(
                    metrics.totalExpenses,
                    metrics.spendingPace.actualDailyAverage,
                    state.currentDay
                  )
                )}
              </span>
              <p className="text-xs text-[#A5ADBE] mt-0.5">
                Predictable commitments that cannot be easily skipped.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#1B2130]/60 border border-[#263045]">
              <span className="text-xs font-medium text-[#A5ADBE] block">Variable Discretionary Spend</span>
              <span className="text-base font-bold font-mono text-[#C8FF4D] block mt-1">
                {formatRupees(
                  selectVariableDiscretionarySpend(
                    metrics.spendingPace.actualDailyAverage,
                    state.currentDay
                  )
                )}
              </span>
              <p className="text-xs text-[#A5ADBE] mt-0.5">
                Food, leisure, and shopping choices controllable daily.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
