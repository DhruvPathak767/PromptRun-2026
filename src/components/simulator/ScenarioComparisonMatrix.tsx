import React from 'react'
import {
  Sparkles,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  HelpCircle,
} from 'lucide-react'
import { type SimulationComparison, type SimulatedScenarioType } from '../../finance/financeTypes'
import { formatRupees } from '../../finance/financeEngine'

interface ScenarioComparisonMatrixProps {
  comparison: SimulationComparison
  selectedType: SimulatedScenarioType
  parsedAmount: number
  onApply: () => void
  onReset: () => void
}

export const ScenarioComparisonMatrix: React.FC<ScenarioComparisonMatrixProps> = ({
  comparison,
  selectedType,
  parsedAmount,
  onApply,
  onReset,
}) => {
  const comparisonRows = [
    {
      metric: 'Cash Balance',
      baseline: formatRupees(comparison.baseline.cashBalance),
      simulated: formatRupees(comparison.simulated.cashBalance),
      delta: comparison.deltas.cashBalanceDelta,
      unit: '',
      explanation: 'Liquid cash remaining in hand',
      invertColor: false,
    },
    {
      metric: 'Safe Discretionary Funds',
      baseline: formatRupees(comparison.baseline.availableDiscretionaryFunds),
      simulated: formatRupees(comparison.simulated.availableDiscretionaryFunds),
      delta: comparison.deltas.discretionaryDelta,
      unit: '',
      explanation: 'Money available after bills & planned savings',
      invertColor: false,
    },
    {
      metric: 'Safe Daily Allowance',
      baseline: `${formatRupees(comparison.baseline.safeDailyAllowance)}/d`,
      simulated: `${formatRupees(comparison.simulated.safeDailyAllowance)}/d`,
      delta: comparison.deltas.dailyAllowanceDelta,
      unit: '/d',
      explanation: `Daily allowance across remaining ${comparison.baseline.inclusiveDaysRemaining} days`,
      invertColor: false,
    },
    {
      metric: 'Upcoming Commitments',
      baseline: formatRupees(comparison.baseline.upcomingCommitmentsTotal),
      simulated: formatRupees(comparison.simulated.upcomingCommitmentsTotal),
      delta: comparison.deltas.commitmentsDelta,
      unit: '',
      explanation: 'Unpaid bills & active subscription charges',
      invertColor: true,
    },
    {
      metric: 'Savings Goal Reserves',
      baseline: formatRupees(comparison.baseline.savingsBalance),
      simulated: formatRupees(comparison.simulated.savingsBalance),
      delta: comparison.deltas.savingsDelta,
      unit: '',
      explanation: 'Total savings accumulated in goals',
      invertColor: false,
    },
    {
      metric: 'Month-End Day 30 Forecast',
      baseline: formatRupees(comparison.baseline.projectedMonthEndCash),
      simulated: formatRupees(comparison.simulated.projectedMonthEndCash),
      delta: comparison.deltas.monthEndDelta,
      unit: '',
      explanation: 'Projected cash in hand at end of cycle',
      invertColor: false,
    },
    {
      metric: 'Financial Health Score',
      baseline: `${comparison.baseline.healthScore}/100`,
      simulated: `${comparison.simulated.healthScore}/100`,
      delta: comparison.deltas.healthScoreDelta,
      unit: ' pts',
      explanation: 'Overall 0-100 financial stability score',
      invertColor: false,
    },
    {
      metric: 'Risk Category Band',
      baseline: comparison.baseline.healthBand,
      simulated: comparison.simulated.healthBand,
      delta: 0,
      unit: '',
      explanation: 'Deterministic health rating classification',
      invertColor: false,
      isBand: true,
    },
  ]

  return (
    <div className="lg:col-span-7 space-y-4">
      {/* Plain-Language Explanations Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#141822] border border-[#263045] shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#263045]/60">
          <h3 className="text-sm font-bold font-display text-[#F5F7FA] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#63E5F4]" /> Plain-Language Consequence Analysis
          </h3>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              comparison.isAffordable
                ? 'bg-[#C8FF4D]/15 text-[#C8FF4D]'
                : 'bg-[#FF5C5C]/15 text-[#FF5C5C]'
            }`}
          >
            {comparison.isAffordable ? 'Financially Viable' : 'Deficit Risk'}
          </span>
        </div>

        {/* Warning Callout if Unaffordable */}
        {comparison.warningNotice && (
          <div className="mt-3 p-3.5 rounded-xl bg-[#FF5C5C]/15 border border-[#FF5C5C]/40 flex items-start gap-3 text-xs text-[#FF5C5C]">
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-[#FF5C5C]" />
            <div className="leading-relaxed font-medium">
              {comparison.warningNotice}
            </div>
          </div>
        )}

        <div className="mt-4 space-y-2">
          {comparison.explanations.map((exp, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
                exp.type === 'positive'
                  ? 'bg-[#C8FF4D]/10 border-[#C8FF4D]/30 text-[#F5F7FA]'
                  : exp.type === 'negative'
                  ? 'bg-[#FF5C5C]/10 border-[#FF5C5C]/30 text-[#F5F7FA]'
                  : 'bg-[#1B2130] border-[#263045] text-[#A5ADBE]'
              }`}
            >
              {exp.type === 'positive' && (
                <TrendingUp className="w-4 h-4 text-[#C8FF4D] shrink-0 mt-0.5" />
              )}
              {exp.type === 'negative' && (
                <TrendingDown className="w-4 h-4 text-[#FF5C5C] shrink-0 mt-0.5" />
              )}
              {exp.type === 'neutral' && (
                <HelpCircle className="w-4 h-4 text-[#63E5F4] shrink-0 mt-0.5" />
              )}
              <span className="leading-relaxed">{exp.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Side-by-Side Comparison Table */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#141822] border border-[#263045] shadow-xl overflow-hidden">
        <h3 className="text-sm font-bold font-display text-[#F5F7FA] pb-3 border-b border-[#263045]/60 mb-3">
          Baseline vs Simulated Outcome Matrix
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left" aria-label="Baseline vs Simulated Outcome Matrix">
            <thead>
              <tr className="border-b border-[#263045] text-[#A5ADBE]">
                <th scope="col" className="py-2.5 pr-2 font-medium">Financial Metric</th>
                <th scope="col" className="py-2.5 px-2 font-medium">Before Decision</th>
                <th scope="col" className="py-2.5 px-2 font-medium">After Decision</th>
                <th scope="col" className="py-2.5 pl-2 font-medium text-right">Net Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#263045]/40 font-mono">
              {comparisonRows.map((row) => {
                const isPositive = row.invertColor ? row.delta < 0 : row.delta > 0
                const isNegative = row.invertColor ? row.delta > 0 : row.delta < 0

                return (
                  <tr key={row.metric} className="hover:bg-[#1B2130]/40 transition-colors">
                    <th scope="row" aria-label={row.metric} className="py-3 pr-2 font-sans font-medium text-[#F5F7FA] text-left">
                      <div>
                        <span>{row.metric}</span>
                        <span className="block text-[10px] text-[#6B778C] font-normal">
                          {row.explanation}
                        </span>
                      </div>
                    </th>
                    <td className="py-3 px-2 text-[#A5ADBE]">{row.baseline}</td>
                    <td className="py-3 px-2 font-bold text-[#F5F7FA]">
                      {row.simulated}
                    </td>
                    <td className="py-3 pl-2 text-right">
                      {row.isBand ? (
                        <span
                          className={`text-[11px] font-sans font-bold px-1.5 py-0.5 rounded ${
                            row.simulated === 'Healthy'
                              ? 'bg-[#C8FF4D]/15 text-[#C8FF4D]'
                              : row.simulated === 'Needs Attention'
                              ? 'bg-[#FFB340]/15 text-[#FFB340]'
                              : 'bg-[#FF5C5C]/15 text-[#FF5C5C]'
                          }`}
                        >
                          {row.simulated}
                        </span>
                      ) : row.delta === 0 ? (
                        <span className="text-[#6B778C]">±0</span>
                      ) : (
                        <span
                          className={`font-bold ${
                            isPositive
                              ? 'text-[#C8FF4D]'
                              : isNegative
                              ? 'text-[#FF5C5C]'
                              : 'text-[#A5ADBE]'
                          }`}
                        >
                          {row.delta > 0 ? '+' : ''}
                          {formatRupees(row.delta)}
                          {row.unit}
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Commit or Discard Footer */}
        <div className="mt-5 pt-4 border-t border-[#263045] flex items-center justify-between">
          <span className="text-xs text-[#A5ADBE]">
            Non-destructive: No state modified until applied.
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onReset}
              className="px-3.5 py-2 text-xs font-semibold text-[#A5ADBE] hover:text-[#F5F7FA] bg-[#1B2130] rounded-xl hover:bg-[#263045] transition-colors"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={onApply}
              disabled={parsedAmount <= 0 && selectedType !== 'cancel_subscription'}
              className="px-4 py-2 text-xs font-bold bg-[#C8FF4D] hover:bg-[#B5F530] text-[#0B0D12] rounded-xl transition-all shadow-md shadow-[#C8FF4D]/20 active:scale-95 disabled:opacity-40"
            >
              Apply Decision to Ledger
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
