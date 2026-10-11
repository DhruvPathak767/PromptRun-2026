import React, { useState } from 'react'
import {
  Target,
  Plus,
  PiggyBank,
  Trash2,
} from 'lucide-react'
import { useFinance } from '../state/useFinance'
import { formatRupees } from '../finance/financeEngine'
import { type SavingsGoal } from '../finance/financeTypes'
import { Modal } from '../components/common/Modal'
import { ConfirmDialog } from '../components/common/ConfirmDialog'
import { sanitizeText, sanitizeAmount } from '../lib/sanitize'

export const GoalsPage: React.FC = () => {
  const { state, metrics, addGoal, deleteGoal, contributeToGoal } = useFinance()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [contributeTargetGoal, setContributeTargetGoal] = useState<SavingsGoal | null>(null)
  const [depositAmount, setDepositAmount] = useState('500')

  // Create Goal form state
  const [name, setName] = useState('')
  const [targetAmount, setTargetAmount] = useState('3000')
  const [plannedContribution, setPlannedContribution] = useState('500')
  const [category, setCategory] = useState('Tech & Gadgets')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState('#C8FF4D')

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const cleanName = sanitizeText(name, 60)
    const targetValidation = sanitizeAmount(targetAmount, 1, 1000000)
    const plannedValidation = sanitizeAmount(plannedContribution, 0, 1000000)

    if (!cleanName || !targetValidation.valid) return

    addGoal({
      name: cleanName,
      targetAmount: targetValidation.amount,
      currentAmount: 0,
      plannedCycleContribution: plannedValidation.valid ? plannedValidation.amount : 0,
      color,
      category,
      iconName: 'Target',
      description: sanitizeText(description, 200),
    })

    setName('')
    setTargetAmount('3000')
    setPlannedContribution('500')
    setDescription('')
    setIsCreateOpen(false)
  }

  const handleContributeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!contributeTargetGoal) return
    const amountVal = sanitizeAmount(depositAmount, 1, Math.max(1, metrics.cashBalance))
    if (!amountVal.valid) return

    contributeToGoal(contributeTargetGoal.id, amountVal.amount)
    setContributeTargetGoal(null)
    setDepositAmount('500')
  }

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
            <span className="text-[10px] text-[#A5ADBE] uppercase font-bold block">
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
        {state.goals.map((goal) => {
          const progressPercent = Math.min(
            100,
            Math.round((goal.currentAmount / goal.targetAmount) * 100)
          )
          const remainingTarget = Math.max(0, goal.targetAmount - goal.currentAmount)
          const isComplete = goal.currentAmount >= goal.targetAmount

          // Contributions made in this cycle
          const cycleTransfers = state.transactions.filter(
            (tx) => tx.type === 'savings_transfer' && tx.relatedId === goal.id
          )
          const cycleTransferredTotal = cycleTransfers.reduce((sum, tx) => sum + tx.amount, 0)

          return (
            <div
              key={goal.id}
              className="p-5 sm:p-6 rounded-2xl bg-[#141822] border border-[#263045] shadow-xl flex flex-col justify-between hover:border-[#3B4A6B] transition-all group"
            >
              <div>
                {/* Card Top */}
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

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setDeleteTargetId(goal.id)}
                      className="p-1.5 rounded-lg text-[#A5ADBE] hover:text-[#FF5C5C] hover:bg-[#FF5C5C]/10 transition-colors"
                      title="Delete goal"
                      aria-label={`Delete ${goal.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {goal.description && (
                  <p className="text-xs text-[#A5ADBE] mt-3 leading-relaxed">
                    {goal.description}
                  </p>
                )}

                {/* Progress Bar & Numerical Target */}
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

                  <div className="w-full h-2.5 rounded-full bg-[#1B2130] overflow-hidden border border-[#263045]/60">
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

                {/* Cycle Transfer Activity */}
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

              {/* Deposit Action */}
              <div className="mt-5 pt-3 border-t border-[#263045]/60 flex items-center justify-between">
                <span className="text-[11px] text-[#A5ADBE]">
                  {metrics.safeDailyAllowance > 0
                    ? `Safe cash available`
                    : 'Budget constrained'}
                </span>

                <button
                  onClick={() => setContributeTargetGoal(goal)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#1B2130] hover:bg-[#263045] text-[#F5F7FA] border border-[#263045] hover:border-[#C8FF4D] transition-all"
                >
                  <Plus className="w-3.5 h-3.5 text-[#C8FF4D]" />
                  <span>Deposit Funds</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Deposit Modal */}
      <Modal
        isOpen={contributeTargetGoal !== null}
        onClose={() => setContributeTargetGoal(null)}
        title={`Deposit into ${contributeTargetGoal?.name}`}
        description="Transfer liquid funds from cash into this dedicated savings goal."
        maxWidth="sm"
      >
        <form onSubmit={handleContributeSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#A5ADBE] mb-1">
              Deposit Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-xs text-[#A5ADBE]">₹</span>
              <input
                type="number"
                min="1"
                max={metrics.cashBalance}
                required
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full pl-7 pr-3 py-2 bg-[#1B2130] border border-[#263045] rounded-xl text-xs font-mono text-[#F5F7FA] focus:outline-none focus:border-[#C8FF4D]"
              />
            </div>
            <span className="text-[11px] text-[#6B778C] mt-1 block">
              Max available liquid cash: {formatRupees(metrics.cashBalance)}
            </span>
          </div>

          <div className="flex gap-2">
            {[250, 500, 1000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setDepositAmount(preset.toString())}
                className="flex-1 py-1 rounded-lg bg-[#1B2130] hover:bg-[#263045] text-xs font-mono text-[#A5ADBE] border border-[#263045]"
              >
                ₹{preset}
              </button>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#263045]">
            <button
              type="button"
              onClick={() => setContributeTargetGoal(null)}
              className="px-4 py-2 text-xs font-medium text-[#A5ADBE] bg-[#1B2130] rounded-xl hover:bg-[#263045]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold bg-[#C8FF4D] text-[#0B0D12] rounded-xl hover:bg-[#B5F530]"
            >
              Transfer Funds
            </button>
          </div>
        </form>
      </Modal>

      {/* Create Goal Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Savings Goal"
        description="Set a target and cycle contribution goal."
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#A5ADBE] mb-1">Goal Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Sony Headphones, Goa Trip, Laptop Fund"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-[#1B2130] border border-[#263045] rounded-xl text-xs text-[#F5F7FA] focus:outline-none focus:border-[#C8FF4D]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#A5ADBE] mb-1">
                Target Amount (₹)
              </label>
              <input
                type="number"
                min="100"
                required
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="w-full px-3 py-2 bg-[#1B2130] border border-[#263045] rounded-xl text-xs font-mono text-[#F5F7FA] focus:outline-none focus:border-[#C8FF4D]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#A5ADBE] mb-1">
                Cycle Target (₹)
              </label>
              <input
                type="number"
                min="0"
                required
                value={plannedContribution}
                onChange={(e) => setPlannedContribution(e.target.value)}
                className="w-full px-3 py-2 bg-[#1B2130] border border-[#263045] rounded-xl text-xs font-mono text-[#F5F7FA] focus:outline-none focus:border-[#C8FF4D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A5ADBE] mb-1">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Tech, Travel, Emergency"
              className="w-full px-3 py-2 bg-[#1B2130] border border-[#263045] rounded-xl text-xs text-[#F5F7FA] focus:outline-none focus:border-[#C8FF4D]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A5ADBE] mb-1">
              Description (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Context or timeline for this goal"
              className="w-full px-3 py-2 bg-[#1B2130] border border-[#263045] rounded-xl text-xs text-[#F5F7FA] focus:outline-none focus:border-[#C8FF4D]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A5ADBE] mb-1">Color Accent</label>
            <div className="flex gap-2">
              {['#C8FF4D', '#63E5F4', '#9875FF', '#FF72D2', '#FFB340', '#34D399'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full border-2 transition-transform ${
                    color === c ? 'scale-110 border-white' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#263045]">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="px-4 py-2 text-xs font-medium text-[#A5ADBE] bg-[#1B2130] rounded-xl hover:bg-[#263045]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold bg-[#C8FF4D] text-[#0B0D12] rounded-xl hover:bg-[#B5F530]"
            >
              Save Goal
            </button>
          </div>
        </form>
      </Modal>

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
