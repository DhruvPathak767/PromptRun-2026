import React from 'react'
import { Sliders } from 'lucide-react'
import {
  EXPENSE_CATEGORIES,
  type ExpenseCategory,
  type SimulatedScenarioType,
  type RupeeFlowState,
} from '../../finance/financeTypes'
import { formatRupees } from '../../finance/financeEngine'

interface ScenarioBuilderProps {
  state: RupeeFlowState
  selectedType: SimulatedScenarioType
  setSelectedType: (type: SimulatedScenarioType) => void
  title: string
  setTitle: (title: string) => void
  amount: string
  setAmount: (amount: string) => void
  category: ExpenseCategory
  setCategory: (category: ExpenseCategory) => void
  targetGoalId: string
  setTargetGoalId: (id: string) => void
  targetSubscriptionId: string
  setTargetSubscriptionId: (id: string) => void
  parsedAmount: number
}

export const ScenarioBuilder: React.FC<ScenarioBuilderProps> = ({
  state,
  selectedType,
  setSelectedType,
  title,
  setTitle,
  amount,
  setAmount,
  category,
  setCategory,
  targetGoalId,
  setTargetGoalId,
  targetSubscriptionId,
  setTargetSubscriptionId,
  parsedAmount,
}) => {
  return (
    <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl bg-[#141822] border border-[#263045] shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#263045]/60">
        <h3 className="text-sm font-bold font-display text-[#F5F7FA] flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#C8FF4D]" /> Interactive Scenario Editor
        </h3>
        <span className="text-[10px] text-[#A5ADBE] font-mono">Live Preview</span>
      </div>

      {/* Scenario Type Selector */}
      <div>
        <span id="decision-type-label" className="block text-xs font-medium text-[#A5ADBE] mb-1.5">
          Decision Type
        </span>
        <div className="grid grid-cols-2 gap-2" role="group" aria-labelledby="decision-type-label">
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
  )
}
