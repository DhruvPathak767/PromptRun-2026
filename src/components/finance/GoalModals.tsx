import React, { useState } from 'react'
import { Modal } from '../common/Modal'
import { formatRupees } from '../../finance/financeEngine'
import { type SavingsGoal } from '../../finance/financeTypes'
import { sanitizeText, sanitizeAmount } from '../../lib/sanitize'

interface DepositModalProps {
  isOpen: boolean
  goal: SavingsGoal | null
  cashBalance: number
  onClose: () => void
  onDeposit: (goalId: string, amount: number) => void
}

export const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  goal,
  cashBalance,
  onClose,
  onDeposit,
}) => {
  const [depositAmount, setDepositAmount] = useState('500')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!goal) return
    const amountVal = sanitizeAmount(depositAmount, 1, Math.max(1, cashBalance))
    if (!amountVal.valid) return

    onDeposit(goal.id, amountVal.amount)
    setDepositAmount('500')
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen && goal !== null}
      onClose={onClose}
      title={`Deposit into ${goal?.name || 'Goal'}`}
      description="Transfer liquid funds from cash into this dedicated savings goal."
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="deposit-amount" className="block text-xs font-medium text-[#A5ADBE] mb-1">
            Deposit Amount (₹)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-xs text-[#A5ADBE]">₹</span>
            <input
              id="deposit-amount"
              type="number"
              min="1"
              max={cashBalance}
              required
              autoComplete="off"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="w-full pl-7 pr-3 py-2 bg-[#1B2130] border border-[#263045] rounded-xl text-xs font-mono text-[#F5F7FA] focus:outline-none focus:border-[#C8FF4D]"
            />
          </div>
          <span className="text-xs text-[#A5ADBE] mt-1 block">
            Max available liquid cash: {formatRupees(cashBalance)}
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
            onClick={onClose}
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
  )
}

interface CreateGoalModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (goal: {
    name: string
    targetAmount: number
    plannedCycleContribution: number
    color: string
    category: string
    iconName: string
    description: string
  }) => void
}

export const CreateGoalModal: React.FC<CreateGoalModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState('')
  const [targetAmount, setTargetAmount] = useState('3000')
  const [plannedContribution, setPlannedContribution] = useState('500')
  const [category, setCategory] = useState('Tech & Gadgets')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState('#C8FF4D')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const cleanName = sanitizeText(name, 60)
    const targetValidation = sanitizeAmount(targetAmount, 1, 1000000)
    const plannedValidation = sanitizeAmount(plannedContribution, 0, 1000000)

    if (!cleanName || !targetValidation.valid) return

    onCreate({
      name: cleanName,
      targetAmount: targetValidation.amount,
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
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Savings Goal"
      description="Set a target and cycle contribution goal."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="goal-name" className="block text-xs font-medium text-[#A5ADBE] mb-1">Goal Name</label>
          <input
            id="goal-name"
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
            <label htmlFor="goal-target" className="block text-xs font-medium text-[#A5ADBE] mb-1">
              Target Amount (₹)
            </label>
            <input
              id="goal-target"
              type="number"
              min="100"
              required
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className="w-full px-3 py-2 bg-[#1B2130] border border-[#263045] rounded-xl text-xs font-mono text-[#F5F7FA] focus:outline-none focus:border-[#C8FF4D]"
            />
          </div>

          <div>
            <label htmlFor="goal-cycle-target" className="block text-xs font-medium text-[#A5ADBE] mb-1">
              Cycle Target (₹)
            </label>
            <input
              id="goal-cycle-target"
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
          <label htmlFor="goal-category" className="block text-xs font-medium text-[#A5ADBE] mb-1">Category</label>
          <input
            id="goal-category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Tech, Travel, Emergency"
            className="w-full px-3 py-2 bg-[#1B2130] border border-[#263045] rounded-xl text-xs text-[#F5F7FA] focus:outline-none focus:border-[#C8FF4D]"
          />
        </div>

        <div>
          <label htmlFor="goal-description" className="block text-xs font-medium text-[#A5ADBE] mb-1">
            Description (Optional)
          </label>
          <input
            id="goal-description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Context or timeline for this goal"
            className="w-full px-3 py-2 bg-[#1B2130] border border-[#263045] rounded-xl text-xs text-[#F5F7FA] focus:outline-none focus:border-[#C8FF4D]"
          />
        </div>

        <div>
          <span id="color-accent-label" className="block text-xs font-medium text-[#A5ADBE] mb-1">Color Accent</span>
          <div className="flex gap-2" role="group" aria-labelledby="color-accent-label">
            {['#C8FF4D', '#63E5F4', '#9875FF', '#FF72D2', '#FFB340', '#34D399'].map((c) => (
              <button
                key={c}
                type="button"
                aria-label={`Select color ${c}`}
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
            onClick={onClose}
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
  )
}
