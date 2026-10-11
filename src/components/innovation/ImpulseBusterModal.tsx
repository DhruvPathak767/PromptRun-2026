import React, { useState } from 'react'
import { Coffee, Utensils, AlertTriangle, ShieldCheck, Clock, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Modal } from '../common/Modal'
import { useFinance } from '../../state/useFinance'
import { formatRupees } from '../../finance/financeEngine'
import { selectChaiEquivalence } from '../../finance/selectors'

interface ImpulseBusterModalProps {
  isOpen: boolean
  onClose: () => void
}

interface CoolDownItem {
  id: string
  item: string
  amount: number
  addedAt: number
}

const STORAGE_KEY = 'rupeeflow_cooldown_vault_v1'

export const ImpulseBusterModal: React.FC<ImpulseBusterModalProps> = ({ isOpen, onClose }) => {
  const { metrics, addToast } = useFinance()
  const navigate = useNavigate()

  const [itemName, setItemName] = useState('')
  const [itemPrice, setItemPrice] = useState('799')
  const [coolDownItems, setCoolDownItems] = useState<CoolDownItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  const price = Math.max(0, parseFloat(itemPrice) || 0)

  // Gen Z Conversions using pure selector
  const chaiCount = selectChaiEquivalence(price)
  const mealsCount = (price / 120).toFixed(1)
  const daysBurned = metrics.safeDailyAllowance > 0
    ? (price / metrics.safeDailyAllowance).toFixed(1)
    : '0'

  const remainingDays = Math.max(1, metrics.inclusiveDaysRemaining)
  const hypotheticalRemainingBuffer = Math.max(0, metrics.availableDiscretionaryFunds - price)
  const newDailyAllowance = Math.round(hypotheticalRemainingBuffer / remainingDays)

  const handleSaveToCoolDown = (e: React.FormEvent) => {
    e.preventDefault()
    if (!itemName.trim() || price <= 0) return

    const newItem: CoolDownItem = {
      id: `cd-${Date.now()}`,
      item: itemName.trim(),
      amount: price,
      addedAt: Date.now(),
    }

    const updated = [newItem, ...coolDownItems]
    setCoolDownItems(updated)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch {
      // Ignore
    }

    addToast({
      type: 'success',
      title: 'Locked in 24h Cool-Down Chamber! 🧊',
      message: `"${itemName.trim()}" is safe in cool-down. 87% of impulsive buying urges fade within 24 hours.`,
    })

    setItemName('')
    setItemPrice('799')
    onClose()
  }

  const handleTestInSimulator = () => {
    onClose()
    navigate('/simulator')
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="⚡ Impulse Buy Reality Checker & Cool-Down Chamber"
      description="Before hitting 'Buy Now' on Swiggy, Amazon, or Zara, see the instant reality check on your ₹10k budget."
      maxWidth="lg"
    >
      <div className="space-y-5">
        {/* Input Form */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-7">
            <label htmlFor="impulse-name" className="block text-xs font-medium text-[#A5ADBE] mb-1">
              Impulse Craving / Purchase
            </label>
            <input
              id="impulse-name"
              type="text"
              placeholder="e.g. Late-night Swiggy, Zara hoodie, Gaming skin"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full px-3 py-2 bg-[#1B2130] border border-[#263045] rounded-xl text-xs text-[#F5F7FA] focus:outline-none focus:border-[#C8FF4D]"
            />
          </div>

          <div className="sm:col-span-5">
            <label htmlFor="impulse-cost" className="block text-xs font-medium text-[#A5ADBE] mb-1">
              Price Tag (₹)
            </label>
            <input
              id="impulse-cost"
              type="number"
              min="1"
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
              className="w-full px-3 py-2 bg-[#1B2130] border border-[#263045] rounded-xl text-xs font-mono text-[#F5F7FA] focus:outline-none focus:border-[#C8FF4D]"
            />
          </div>
        </div>

        {/* Real-World Gen Z Equivalents Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-[#1B2130] border border-[#263045] text-center">
            <div className="w-7 h-7 rounded-lg bg-[#FFB340]/20 text-[#FFB340] flex items-center justify-center mx-auto mb-1.5">
              <Coffee className="w-4 h-4" />
            </div>
            <span className="text-xl font-bold font-mono text-[#F5F7FA] block">
              {chaiCount}
            </span>
            <span className="text-xs text-[#A5ADBE] block mt-0.5">Cups of Tapri Chai</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#1B2130] border border-[#263045] text-center">
            <div className="w-7 h-7 rounded-lg bg-[#63E5F4]/20 text-[#63E5F4] flex items-center justify-center mx-auto mb-1.5">
              <Utensils className="w-4 h-4" />
            </div>
            <span className="text-xl font-bold font-mono text-[#F5F7FA] block">
              {mealsCount}
            </span>
            <span className="text-xs text-[#A5ADBE] block mt-0.5">Campus Thali Meals</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#1B2130] border border-[#263045] text-center">
            <div className="w-7 h-7 rounded-lg bg-[#FF5C5C]/20 text-[#FF5C5C] flex items-center justify-center mx-auto mb-1.5">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <span className="text-xl font-bold font-mono text-[#FF5C5C] block">
              {daysBurned}d
            </span>
            <span className="text-xs text-[#A5ADBE] block mt-0.5">Daily Allowance Burned</span>
          </div>
        </div>

        {/* Impact Box */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-[#1B2130] via-[#141822] to-[#1B2130] border border-[#263045] text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[#A5ADBE]">Current Safe Daily Allowance:</span>
            <span className="font-mono font-bold text-[#C8FF4D]">
              {formatRupees(metrics.safeDailyAllowance)}/day
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#A5ADBE]">New Allowance if Purchased Today:</span>
            <span className="font-mono font-bold text-[#FF5C5C]">
              {formatRupees(newDailyAllowance)}/day
            </span>
          </div>
          <div className="pt-2 border-t border-[#263045] flex items-center gap-2 text-xs text-[#A5ADBE]">
            <Clock className="w-4 h-4 text-[#63E5F4] shrink-0" />
            <span>
              This one impulse burns{' '}
              <strong className="text-[#F5F7FA] font-mono">{formatRupees(metrics.safeDailyAllowance - newDailyAllowance)}/day</strong>{' '}
              for every single one of your remaining {remainingDays} days in cycle!
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleTestInSimulator}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#1B2130] hover:bg-[#263045] text-[#A5ADBE] hover:text-[#F5F7FA] border border-[#263045] flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Test in What-If Simulator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleSaveToCoolDown}
            className="px-5 py-2 text-xs font-bold rounded-xl bg-[#C8FF4D] hover:bg-[#B5F530] text-[#0B0D12] flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#C8FF4D]/20 active:scale-95"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Lock in 24h Cool-Down Chamber</span>
          </button>
        </div>
      </div>
    </Modal>
  )
}
