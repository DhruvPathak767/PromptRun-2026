import React from 'react'
import { Target, Trash2, Plus } from 'lucide-react'
import { type SavingsGoal, type Transaction } from '../../finance/financeTypes'
import { formatRupees } from '../../finance/financeEngine'

interface GoalCardProps {
  goal: SavingsGoal
  transactions: Transaction[]
  safeDailyAllowance: number
  onDeposit: (goal: SavingsGoal) => void
  onDelete: (id: string) => void
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  transactions,
  safeDailyAllowance,
  onDeposit,
  onDelete,
}) => {
  const progressPercent = Math.min(
    100,
    Math.round((goal.currentAmount / goal.targetAmount) * 100)
  )
  const remainingTarget = Math.max(0, goal.targetAmount - goal.currentAmount)
  const isComplete = goal.currentAmount >= goal.targetAmount

  const cycleTransfers = transactions.filter(
    (tx) => tx.type === 'savings_transfer' && tx.relatedId === goal.id
  )
  const cycleTransferredTotal = cycleTransfers.reduce((sum, tx) => sum + tx.amount, 0)

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[#141822] border border-[#263045] shadow-xl flex flex-col justify-between hover:border-[#3B4A6B] transition-all group">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
              style={{
                backgroundColor: `${goal.color}20`,
                color: goal.color,
                border: `1px solid ${goal.color}40`,
              }}
            >
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F5F7FA] font-display">
                {goal.name}
              </h3>
              <span className="text-[10px] text-[#A5ADBE] font-medium">
                {goal.category}
              </span>
            </div>
          </div>

          <button
            onClick={() => onDelete(goal.id)}
            className="p-1.5 rounded-lg text-[#A5ADBE] hover:text-[#FF5C5C] hover:bg-[#FF5C5C]/10 transition-colors"
            title="Delete goal"
            aria-label={`Delete ${goal.name}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {goal.description && (
          <p className="text-xs text-[#A5ADBE] mt-3 leading-relaxed">
            {goal.description}
          </p>
        )}

        <div className="mt-5 space-y-2">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xl font-bold font-mono text-[#F5F7FA]">
                {formatRupees(goal.currentAmount)}
              </span>
              <span className="text-xs text-[#A5ADBE] font-mono">
                {' '}
                / {formatRupees(goal.targetAmount)}
              </span>
            </div>
            <span
              className="text-xs font-mono font-bold"
              style={{ color: goal.color }}
            >
              {progressPercent}%
            </span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-[#1B2130] overflow-hidden border border-[#263045]/60" role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100} aria-label={`${goal.name} progress`}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: goal.color,
              }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-[#A5ADBE]">
            <span>
              {isComplete ? 'Goal Achieved! 🎉' : `Remaining: ${formatRupees(remainingTarget)}`}
            </span>
            <span>Planned this cycle: {formatRupees(goal.plannedCycleContribution)}</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#263045]/60 text-[11px] text-[#A5ADBE]">
          <span>Cycle Deposits: </span>
          <strong className="text-[#63E5F4] font-mono">
            {formatRupees(cycleTransferredTotal)}
          </strong>
          {cycleTransfers.length > 0 && (
            <span className="text-[#6B778C]"> ({cycleTransfers.length} transfers)</span>
          )}
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-[#263045]/60 flex items-center justify-between">
        <span className="text-[11px] text-[#A5ADBE]">
          {safeDailyAllowance > 0
            ? 'Safe cash available'
            : 'Budget constrained'}
        </span>

        <button
          onClick={() => onDeposit(goal)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#1B2130] hover:bg-[#263045] text-[#F5F7FA] border border-[#263045] hover:border-[#C8FF4D] transition-all"
        >
          <Plus className="w-3.5 h-3.5 text-[#C8FF4D]" />
          <span>Deposit Funds</span>
        </button>
      </div>
    </div>
  )
}
