import React from 'react'
import { Modal } from '../common/Modal'
import { EXPENSE_CATEGORIES, type ExpenseCategory } from '../../finance/financeTypes'

interface AddSubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (sub: {
    name: string
    price: number
    billingDay: number
    category: ExpenseCategory
    tier?: string
  }) => void
}

export const AddSubscriptionModal: React.FC<AddSubscriptionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [subName, setSubName] = React.useState('')
  const [subPrice, setSubPrice] = React.useState('199')
  const [subDay, setSubDay] = React.useState(15)
  const [subCategory, setSubCategory] = React.useState<ExpenseCategory>('Tech & Subscriptions')
  const [subTier, setSubTier] = React.useState('Monthly Plan')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const price = parseFloat(subPrice)
    if (!subName.trim() || isNaN(price) || price <= 0) return

    onSubmit({
      name: subName.trim(),
      price,
      billingDay: Math.min(30, Math.max(1, subDay)),
      category: subCategory,
      tier: subTier.trim() || undefined,
    })

    setSubName('')
    setSubPrice('199')
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Recurring Subscription"
      description="Track monthly services that charge your budget on a recurring day."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="sub-name" className="block text-xs font-medium text-[#A5ADBE] mb-1">
            Service Name
          </label>
          <input
            id="sub-name"
            type="text"
            required
            placeholder="e.g. Netflix Mobile, Disney+ Hotstar, GitHub Copilot"
            value={subName}
            onChange={(e) => setSubName(e.target.value)}
            className="w-full px-3 py-2 bg-[#1B2130] border border-[#263045] rounded-xl text-xs text-[#F5F7FA] focus:outline-none focus:border-[#C8FF4D]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="sub-price" className="block text-xs font-medium text-[#A5ADBE] mb-1">
              Monthly Price (₹)
            </label>
            <input
              id="sub-price"
              type="number"
              min="1"
              required
              value={subPrice}
              onChange={(e) => setSubPrice(e.target.value)}
              className="w-full px-3 py-2 bg-[#1B2130] border border-[#263045] rounded-xl text-xs font-mono text-[#F5F7FA] focus:outline-none focus:border-[#C8FF4D]"
            />
          </div>

          <div>
            <label htmlFor="sub-day" className="block text-xs font-medium text-[#A5ADBE] mb-1">
              Billing Cycle Day (1-30)
            </label>
            <input
              id="sub-day"
              type="number"
              min="1"
              max="30"
              required
              value={subDay}
              onChange={(e) => setSubDay(Number(e.target.value))}
              className="w-full px-3 py-2 bg-[#1B2130] border border-[#263045] rounded-xl text-xs font-mono text-[#F5F7FA] focus:outline-none focus:border-[#C8FF4D]"
            />
          </div>
        </div>

        <div>
          <label htmlFor="sub-category" className="block text-xs font-medium text-[#A5ADBE] mb-1">
            Category
          </label>
          <select
            id="sub-category"
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value as ExpenseCategory)}
            className="w-full px-3 py-2 bg-[#1B2130] border border-[#263045] rounded-xl text-xs text-[#F5F7FA] focus:outline-none focus:border-[#C8FF4D]"
          >
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="sub-tier" className="block text-xs font-medium text-[#A5ADBE] mb-1">
            Plan Tier / Notes
          </label>
          <input
            id="sub-tier"
            type="text"
            placeholder="e.g. Student Discount, Standard HD"
            value={subTier}
            onChange={(e) => setSubTier(e.target.value)}
            className="w-full px-3 py-2 bg-[#1B2130] border border-[#263045] rounded-xl text-xs text-[#F5F7FA] focus:outline-none focus:border-[#C8FF4D]"
          />
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
            Save Subscription
          </button>
        </div>
      </form>
    </Modal>
  )
}

interface AddCommitmentModalProps {
  isOpen: boolean
  currentDay: number
  onClose: () => void
  onSubmit: (commitment: {
    name: string
    amount: number
    dueDay: number
    category: ExpenseCategory
  }) => void
}

export const AddCommitmentModal: React.FC<AddCommitmentModalProps> = ({
  isOpen,
  currentDay,
  onClose,
  onSubmit,
}) => {
  const [commitName, setCommitName] = React.useState('')
  const [commitAmount, setCommitAmount] = React.useState('500')
  const [commitDueDay, setCommitDueDay] = React.useState(currentDay + 5)
  const [commitCategory, setCommitCategory] = React.useState<ExpenseCategory>('Tech & Subscriptions')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(commitAmount)
    if (!commitName.trim() || isNaN(amount) || amount <= 0) return

    onSubmit({
      name: commitName.trim(),
      amount,
      dueDay: Math.min(30, Math.max(1, commitDueDay)),
      category: commitCategory,
    })

    setCommitName('')
    setCommitAmount('500')
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Scheduled Bill Obligation"
      description="Schedule a known bill that must be paid during this cycle."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="commit-name" className="block text-xs font-medium text-[#A5ADBE] mb-1">
            Obligation Name
          </label>
          <input
            id="commit-name"
            type="text"
            required
            placeholder="e.g. Wi-Fi Share, Electric Bill, Laundry Service"
            value={commitName}
            onChange={(e) => setCommitName(e.target.value)}
            className="w-full px-3 py-2 bg-[#1B2130] border border-[#263045] rounded-xl text-xs text-[#F5F7FA] focus:outline-none focus:border-[#C8FF4D]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="commit-amount" className="block text-xs font-medium text-[#A5ADBE] mb-1">
              Amount (₹)
            </label>
            <input
              id="commit-amount"
              type="number"
              min="1"
              required
              value={commitAmount}
              onChange={(e) => setCommitAmount(e.target.value)}
              className="w-full px-3 py-2 bg-[#1B2130] border border-[#263045] rounded-xl text-xs font-mono text-[#F5F7FA] focus:outline-none focus:border-[#C8FF4D]"
            />
          </div>

          <div>
            <label htmlFor="commit-due-day" className="block text-xs font-medium text-[#A5ADBE] mb-1">
              Due Cycle Day (1-30)
            </label>
            <input
              id="commit-due-day"
              type="number"
              min="1"
              max="30"
              required
              value={commitDueDay}
              onChange={(e) => setCommitDueDay(Number(e.target.value))}
              className="w-full px-3 py-2 bg-[#1B2130] border border-[#263045] rounded-xl text-xs font-mono text-[#F5F7FA] focus:outline-none focus:border-[#C8FF4D]"
            />
          </div>
        </div>

        <div>
          <label htmlFor="commit-category" className="block text-xs font-medium text-[#A5ADBE] mb-1">
            Category
          </label>
          <select
            id="commit-category"
            value={commitCategory}
            onChange={(e) => setCommitCategory(e.target.value as ExpenseCategory)}
            className="w-full px-3 py-2 bg-[#1B2130] border border-[#263045] rounded-xl text-xs text-[#F5F7FA] focus:outline-none focus:border-[#C8FF4D]"
          >
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
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
            Save Obligation
          </button>
        </div>
      </form>
    </Modal>
  )
}
