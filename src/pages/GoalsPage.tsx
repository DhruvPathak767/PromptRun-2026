import React, { useState } from 'react'
import { Plus, PiggyBank } from 'lucide-react'
import { useFinance } from '../state/useFinance'
import { formatRupees } from '../finance/financeEngine'
import { type SavingsGoal } from '../finance/financeTypes'
import { ConfirmDialog } from '../components/common/ConfirmDialog'
import { GoalCard } from '../components/finance/GoalCard'
import { DepositModal, CreateGoalModal } from '../components/finance/GoalModals'

export const GoalsPage: React.FC = () => {
  const { state, metrics, addGoal, deleteGoal, contributeToGoal } = useFinance()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [contributeTargetGoal, setContributeTargetGoal] = useState<SavingsGoal | null>(null)

  return (
    <div className="space-y-6">
      {/* Header Overview Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#141822] via-[#1B2130] to-[#141822] border border-[#263045] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <PiggyBank className="w-5 h-5 text-[#34D399]" />
            <h2 className="text-xl font-bold font-display text-[#F5F7FA]">
              Savings Goals & Reserve Vaults
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#A5ADBE] mt-1 max-w-xl">
            Allocations move funds from cash into safe savings without being counted as expenses.
            Every deposit is protected from spontaneous discretionary spending.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#141822] border border-[#263045] text-right">
            <span className="text-xs text-[#A5ADBE] uppercase font-bold block">
              Total Saved Reserves
            </span>
            <span className="text-xl font-black font-mono text-[#34D399]">
              {formatRupees(metrics.savingsBalance)}
            </span>
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#C8FF4D] hover:bg-[#B5F530] text-[#0B0D12] transition-all shadow-md shadow-[#C8FF4D]/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create Goal</span>
          </button>
        </div>
      </div>

      {/* Goals Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.goals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            transactions={state.transactions}
            safeDailyAllowance={metrics.safeDailyAllowance}
            onDeposit={(target) => setContributeTargetGoal(target)}
            onDelete={(id) => setDeleteTargetId(id)}
          />
        ))}
      </div>

      {/* Deposit Modal */}
      <DepositModal
        isOpen={contributeTargetGoal !== null}
        goal={contributeTargetGoal}
        cashBalance={metrics.cashBalance}
        onClose={() => setContributeTargetGoal(null)}
        onDeposit={(goalId, amount) => contributeToGoal(goalId, amount)}
      />

      {/* Create Goal Modal */}
      <CreateGoalModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={(goalData) => addGoal({ ...goalData, currentAmount: 0 })}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (deleteTargetId) {
            deleteGoal(deleteTargetId)
            setDeleteTargetId(null)
          }
        }}
        title="Delete Savings Goal"
        message="Are you sure you want to delete this savings goal? Stored savings metrics will adjust."
        confirmText="Delete Goal"
        isDestructive={true}
      />
    </div>
  )
}
