import React, { useState } from 'react'
import {
  FlaskConical,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  ShieldAlert,
  Sliders,
  HelpCircle,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import { useFinance } from '../state/useFinance'
import { PRESET_SCENARIOS, simulateScenario } from '../finance/scenarioEngine'
import {
  EXPENSE_CATEGORIES,
  type ExpenseCategory,
  type SimulatedScenarioType,
  type SimulatedScenario,
} from '../finance/financeTypes'
import { formatRupees } from '../finance/financeEngine'

export const SimulatorPage: React.FC = () => {
  const {
    state,
    setActiveSimulation,
    clearActiveSimulation,
    applyActiveSimulation,
  } = useFinance()

  // Scenario builder state
  const [selectedType, setSelectedType] = useState<SimulatedScenarioType>(
    state.activeSimulation?.type || 'purchase'
  )
  const [title, setTitle] = useState(
    state.activeSimulation?.title || 'Buy Sneakers'
  )
  const [amount, setAmount] = useState<string>(
    state.activeSimulation?.amount?.toString() || '2499'
  )
  const [category, setCategory] = useState<ExpenseCategory>(
    state.activeSimulation?.category || 'Shopping & Apparel'
  )
  const [targetGoalId, setTargetGoalId] = useState<string>(
    state.activeSimulation?.targetGoalId || (state.goals[0]?.id ?? '')
  )
  const [targetSubscriptionId, setTargetSubscriptionId] = useState<string>(
    state.activeSimulation?.targetSubscriptionId || (state.subscriptions[0]?.id ?? '')
  )

  // Construct current working scenario in real-time
  const parsedAmount = Math.max(0, parseFloat(amount) || 0)

  const currentScenario: SimulatedScenario = {
    id: state.activeSimulation?.id || 'active-sim',
    type: selectedType,
    title: title.trim() || 'Custom Scenario',
    description: `Simulating ${selectedType.replace('_', ' ')} of ₹${parsedAmount}`,
    amount: parsedAmount,
    category,
    targetGoalId,
    targetSubscriptionId,
  }

  // Pure hypothetical comparison computed on the fly
  const comparison = simulateScenario(state, currentScenario)

  const handleSelectPreset = (preset: SimulatedScenario) => {
    setSelectedType(preset.type)
    setTitle(preset.title)
    setAmount(preset.amount.toString())
    if (preset.category) setCategory(preset.category)
    if (preset.targetGoalId) setTargetGoalId(preset.targetGoalId)
    if (preset.targetSubscriptionId) setTargetSubscriptionId(preset.targetSubscriptionId)
    setActiveSimulation(preset)
  }

  const handleApply = () => {
    setActiveSimulation(currentScenario)
    applyActiveSimulation()
  }

  const handleReset = () => {
    clearActiveSimulation()
    setTitle('Buy Sneakers')
    setAmount('2499')
    setSelectedType('purchase')
  }

  // Metric rows for required 8 comparison factors
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
      invertColor: true, // higher commitments is negative for budget
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
      explanation: 'Estimated liquidity cushion at cycle end',
      invertColor: false,
    },
    {
      metric: 'Financial Health Score',
      baseline: `${comparison.baseline.healthScore} pts`,
      simulated: `${comparison.simulated.healthScore} pts`,
      delta: comparison.deltas.healthScoreDelta,
      unit: ' pts',
      explanation: '0 to 100 comprehensive financial resilience score',
      invertColor: false,
    },
    {
      metric: 'Risk Category',
      baseline: comparison.baseline.healthBand,
      simulated: comparison.simulated.healthBand,
      delta: 0,
      unit: '',
      isBand: true,
      explanation: 'Overall safety band evaluation',
      invertColor: false,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Intro Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#141822] via-[#1B2130] to-[#141822] border border-[#263045] shadow-xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#63E5F4]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-[#63E5F4]" />
              <h2 className="text-xl font-bold font-display text-[#F5F7FA]">
                What-If Decision Lab
              </h2>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#63E5F4]/15 text-[#63E5F4] border border-[#63E5F4]/30">
                Non-Destructive Sandbox
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#A5ADBE] mt-1 max-w-2xl">
              Simulate purchases, new subscriptions, emergency expenses, savings deposits, or freelance income.
              Test the consequences across your entire 30-day budget before committing real rupees.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#A5ADBE] hover:text-[#F5F7FA] bg-[#141822] border border-[#263045] hover:bg-[#1B2130] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Sandbox</span>
            </button>
            <button
              onClick={handleApply}
              disabled={parsedAmount <= 0 && selectedType !== 'cancel_subscription'}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#C8FF4D] hover:bg-[#B5F530] text-[#0B0D12] shadow-lg shadow-[#C8FF4D]/20 transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Apply Decision</span>
            </button>
          </div>
        </div>
      </div>

      {/* Preset Quick Simulations Carousel / Pills */}
      <div>
        <span className="text-xs font-mono uppercase tracking-wider text-[#A5ADBE] font-bold block mb-2.5">
          Quick Preset Scenarios
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {PRESET_SCENARIOS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className="p-3 rounded-xl bg-[#141822] border border-[#263045] hover:border-[#63E5F4] hover:bg-[#1B2130] text-left transition-all group"
            >
              <span className="text-xs font-bold text-[#F5F7FA] block group-hover:text-[#63E5F4] transition-colors line-clamp-1">
                {preset.title}
              </span>
              <span className="text-[11px] font-mono text-[#A5ADBE] block mt-1">
                ₹{preset.amount} • {preset.type.replace('_', ' ')}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Scenario Editor (Left Column) */}
        <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl bg-[#141822] border border-[#263045] shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#263045]/60">
            <h3 className="text-sm font-bold font-display text-[#F5F7FA] flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#C8FF4D]" /> Interactive Scenario Editor
            </h3>
            <span className="text-[10px] text-[#A5ADBE] font-mono">Live Preview</span>
          </div>

          {/* Scenario Type Selector */}
          <div>
            <label className="block text-xs font-medium text-[#A5ADBE] mb-1.5">
              Decision Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { type: 'purchase', label: 'One-Time Purchase' },
                { type: 'unexpected_expense', label: 'Unexpected Expense' },
                { type: 'add_subscription', label: 'Add Subscription' },
                { type: 'cancel_subscription', label: 'Cancel Subscription' },
                { type: 'savings_contribution', label: 'Save into Goal' },
                { type: 'add_income', label: 'Receive Extra Cash' },
                { type: 'add_commitment', label: 'Add Scheduled Bill' },
                { type: 'adjust_savings_plan', label: 'Adjust Goal Target' },
              ].map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setSelectedType(item.type as SimulatedScenarioType)}
                  className={`p-2 rounded-xl text-xs font-medium text-left border transition-all truncate ${
                    selectedType === item.type
                      ? 'bg-[#1B2130] text-[#F5F7FA] border-[#C8FF4D] shadow-sm'
                      : 'bg-[#141822] text-[#A5ADBE] border-[#263045] hover:text-[#F5F7FA]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scenario Title */}
          <div>
            <label htmlFor="sim-title" className="block text-xs font-medium text-[#A5ADBE] mb-1">
              Description / Title
            </label>
            <input
              id="sim-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Zara Jacket, Netflix UHD, Doctor consultation"
              className="w-full px-3 py-2 bg-[#1B2130] border border-[#263045] rounded-xl text-xs text-[#F5F7FA] focus:outline-none focus:border-[#C8FF4D]"
            />
          </div>

          {/* Amount (if not cancel_subscription) */}
          {selectedType !== 'cancel_subscription' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="sim-amount" className="text-xs font-medium text-[#A5ADBE]">
                  Hypothetical Amount (₹)
                </label>
                <span className="text-[11px] font-mono text-[#C8FF4D]">
                  {formatRupees(parsedAmount)}
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-[#A5ADBE]">₹</span>
                <input
                  id="sim-amount"
                  type="number"
                  min="0"
                  step="50"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 bg-[#1B2130] border border-[#263045] rounded-xl text-xs font-mono text-[#F5F7FA] focus:outline-none focus:border-[#C8FF4D]"
                />
              </div>

              {/* Quick Amount Steppers */}
              <div className="flex gap-1.5 mt-2">
                {[299, 500, 1000, 1800, 2499].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val.toString())}
                    className="flex-1 py-1 text-[10px] font-mono rounded-lg bg-[#1B2130] hover:bg-[#263045] text-[#A5ADBE] hover:text-[#F5F7FA] border border-[#263045]"
                  >
                    +{val}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Target Subscription Selector if cancel_subscription */}
          {selectedType === 'cancel_subscription' && (
            <div>
              <label htmlFor="sim-sub" className="block text-xs font-medium text-[#A5ADBE] mb-1">
                Choose Subscription to Cancel
              </label>
              <select
                id="sim-sub"
                value={targetSubscriptionId}
                onChange={(e) => setTargetSubscriptionId(e.target.value)}
                className="w-full px-3 py-2 bg-[#1B2130] border border-[#263045] rounded-xl text-xs text-[#F5F7FA] focus:outline-none focus:border-[#C8FF4D]"
              >
                {state.subscriptions
                  .filter((s) => s.active)
                  .map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name} ({formatRupees(sub.price)}/mo)
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* Target Goal Selector if savings_contribution */}
          {(selectedType === 'savings_contribution' || selectedType === 'adjust_savings_plan') && (
            <div>
              <label htmlFor="sim-goal" className="block text-xs font-medium text-[#A5ADBE] mb-1">
                Select Savings Goal Target
              </label>
              <select
                id="sim-goal"
                value={targetGoalId}
                onChange={(e) => setTargetGoalId(e.target.value)}
                className="w-full px-3 py-2 bg-[#1B2130] border border-[#263045] rounded-xl text-xs text-[#F5F7FA] focus:outline-none focus:border-[#C8FF4D]"
              >
                {state.goals.map((goal) => (
                  <option key={goal.id} value={goal.id}>
                    {goal.name} (Current: {formatRupees(goal.currentAmount)} / Target: {formatRupees(goal.targetAmount)})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Category Selector if purchase/commitment/unexpected */}
          {(selectedType === 'purchase' || selectedType === 'unexpected_expense' || selectedType === 'add_commitment' || selectedType === 'add_subscription') && (
            <div>
              <label htmlFor="sim-cat" className="block text-xs font-medium text-[#A5ADBE] mb-1">
                Category
              </label>
              <select
                id="sim-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full px-3 py-2 bg-[#1B2130] border border-[#263045] rounded-xl text-xs text-[#F5F7FA] focus:outline-none focus:border-[#C8FF4D]"
              >
                {EXPENSE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Side-by-Side Comparison Matrix (Right Column) */}
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
              <table className="w-full text-xs text-left" role="table">
                <thead>
                  <tr className="border-b border-[#263045] text-[#A5ADBE]">
                    <th className="py-2.5 pr-2 font-medium">Financial Metric</th>
                    <th className="py-2.5 px-2 font-medium">Before Decision</th>
                    <th className="py-2.5 px-2 font-medium">After Decision</th>
                    <th className="py-2.5 pl-2 font-medium text-right">Net Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#263045]/40 font-mono">
                  {comparisonRows.map((row) => {
                    const isPositive = row.invertColor ? row.delta < 0 : row.delta > 0
                    const isNegative = row.invertColor ? row.delta > 0 : row.delta < 0

                    return (
                      <tr key={row.metric} className="hover:bg-[#1B2130]/40 transition-colors">
                        <td className="py-3 pr-2 font-sans font-medium text-[#F5F7FA]">
                          <div>
                            <span>{row.metric}</span>
                            <span className="block text-[10px] text-[#6B778C] font-normal">
                              {row.explanation}
                            </span>
                          </div>
                        </td>
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
                  onClick={handleReset}
                  className="px-3.5 py-2 text-xs font-semibold text-[#A5ADBE] hover:text-[#F5F7FA] bg-[#1B2130] rounded-xl hover:bg-[#263045] transition-colors"
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  disabled={parsedAmount <= 0 && selectedType !== 'cancel_subscription'}
                  className="px-4 py-2 text-xs font-bold bg-[#C8FF4D] hover:bg-[#B5F530] text-[#0B0D12] rounded-xl transition-all shadow-md shadow-[#C8FF4D]/20 active:scale-95 disabled:opacity-40"
                >
                  Apply Decision to Ledger
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
