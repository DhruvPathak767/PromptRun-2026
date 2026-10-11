import React, { useState } from 'react'
import { Modal } from '../common/Modal'
import {
  EXPENSE_CATEGORIES,
  type ExpenseCategory,
  type TransactionType,
} from '../../finance/financeTypes'
import { useFinance } from '../../state/useFinance'

import { sanitizeText, sanitizeAmount, sanitizeCycleDay } from '../../lib/sanitize'
import { playChimeSound } from '../../lib/soundEffects'

interface TransactionFormModalProps {
  isOpen: boolean
  onClose: () => void
}

export const TransactionFormModal: React.FC<TransactionFormModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { state, addTransaction } = useFinance()

  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<ExpenseCategory>('Food & Dining')
  const [type, setType] = useState<TransactionType>('expense')
  const [isFixed, setIsFixed] = useState(false)
  const [cycleDay, setCycleDay] = useState(state.currentDay)
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const cleanDesc = sanitizeText(description, 100)
    if (!cleanDesc) {
      setError('Please provide a valid transaction description.')
      return
    }

    const amountValidation = sanitizeAmount(amount, 1, 100000)
    if (!amountValidation.valid) {
      setError(amountValidation.error || 'Please enter a valid positive amount in rupees.')
      return
    }

    const cleanDay = sanitizeCycleDay(cycleDay)
    const cleanNote = note ? sanitizeText(note, 200) : undefined

    addTransaction({
      description: cleanDesc,
      amount: amountValidation.amount,
      category,
      type,
      isFixed,
      cycleDay: cleanDay,
      date: `Day ${cleanDay} • Added`,
      note: cleanNote,
    })

    playChimeSound()

    // Reset and close
    setDescription('')
    setAmount('')
    setNote('')
    setError(null)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Transaction"
      description="Record an immediate expense or income in your 30-day ledger."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-[#FF5C5C]/15 border border-[#FF5C5C]/30 text-xs text-[#FF5C5C]">
            {error}
          </div>
        )}

        {/* Transaction Type Selector */}
        <div className="flex rounded-xl bg-[#1B2130] p-1 border border-[#263045]">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              type === 'expense'
                ? 'bg-[#141822] text-[#F5F7FA] shadow-sm'
                : 'text-[#A5ADBE] hover:text-[#F5F7FA]'
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              type === 'income'
                ? 'bg-[#141822] text-[#C8FF4D] shadow-sm'
                : 'text-[#A5ADBE] hover:text-[#F5F7FA]'
            }`}
          >
            Income
          </button>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="tx-desc" className="block text-xs font-medium text-[#A5ADBE] mb-1">
            Description
          </label>
          <input
            id="tx-desc"
            type="text"
            required
            placeholder="e.g. Campus Canteen Lunch, Metro Pass"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 bg-[#1B2130] border border-[#263045] rounded-xl text-xs text-[#F5F7FA] placeholder-[#6B778C] focus:outline-none focus:border-[#C8FF4D]"
          />
        </div>

        {/* Amount & Cycle Day */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="tx-amount" className="block text-xs font-medium text-[#A5ADBE] mb-1">
              Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-xs text-[#A5ADBE]">₹</span>
              <input
                id="tx-amount"
                type="number"
                step="1"
                min="1"
                max="50000"
                required
                placeholder="250"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-7 pr-3 py-2 bg-[#1B2130] border border-[#263045] rounded-xl text-xs font-mono text-[#F5F7FA] placeholder-[#6B778C] focus:outline-none focus:border-[#C8FF4D]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="tx-day" className="block text-xs font-medium text-[#A5ADBE] mb-1">
              Cycle Day (1-30)
            </label>
            <input
              id="tx-day"
              type="number"
              min="1"
              max="30"
              required
              value={cycleDay}
              onChange={(e) => setCycleDay(Number(e.target.value))}
              className="w-full px-3 py-2 bg-[#1B2130] border border-[#263045] rounded-xl text-xs font-mono text-[#F5F7FA] focus:outline-none focus:border-[#C8FF4D]"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="tx-category" className="block text-xs font-medium text-[#A5ADBE] mb-1">
            Category
          </label>
          <select
            id="tx-category"
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

        {/* Fixed vs Variable Toggle */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#1B2130]/60 border border-[#263045]">
          <div>
            <span className="text-xs font-medium text-[#F5F7FA]">Fixed / Committed Bill</span>
            <p className="text-[11px] text-[#A5ADBE]">
              Fixed costs (rent, subscriptions) are separated from variable daily pacing.
            </p>
          </div>
          <input
            type="checkbox"
            checked={isFixed}
            onChange={(e) => setIsFixed(e.target.checked)}
            className="w-4 h-4 rounded border-[#263045] text-[#C8FF4D] focus:ring-[#C8FF4D] bg-[#141822]"
          />
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="tx-notes" className="block text-xs font-medium text-[#A5ADBE] mb-1">
            Notes (Optional)
          </label>
          <input
            id="tx-notes"
            type="text"
            placeholder="Add any contextual note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-3 py-2 bg-[#1B2130] border border-[#263045] rounded-xl text-xs text-[#F5F7FA] placeholder-[#6B778C] focus:outline-none focus:border-[#C8FF4D]"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#263045]/60">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#A5ADBE] hover:text-[#F5F7FA] bg-[#1B2130] hover:bg-[#263045] rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-bold bg-[#C8FF4D] hover:bg-[#B5F530] text-[#0B0D12] rounded-xl transition-all shadow-md shadow-[#C8FF4D]/20 active:scale-95"
          >
            Save Transaction
          </button>
        </div>
      </form>
    </Modal>
  )
}
