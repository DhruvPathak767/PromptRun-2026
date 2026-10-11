import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Zap, ArrowRight, X } from 'lucide-react'
import { useFinance } from '../../state/useFinance'
import { formatRupees } from '../../finance/financeEngine'

/**
 * Interconnected Consequence Live Tracker.
 * Dynamically highlights cross-screen ripple effects following each financial decision.
 */
export const ConsequencePill: React.FC = () => {
  const { state, metrics } = useFinance()
  const [dismissedTxId, setDismissedTxId] = useState<string | null>(null)

  if (state.transactions.length === 0) return null

  const latestTx = state.transactions[0]
  if (dismissedTxId === latestTx.id) return null

  return (
    <div
      role="region"
      aria-label="Recent Decision Consequence"
      className="mb-4 px-4 py-2.5 rounded-xl bg-[#141822]/95 border border-[#263045] hover:border-[#3B4A6B] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg backdrop-blur-md"
    >
      <div className="flex items-center gap-2.5">
        <div className="w-6 h-6 rounded-lg bg-[#C8FF4D]/15 text-[#C8FF4D] flex items-center justify-center shrink-0">
          <Zap className="w-3.5 h-3.5" />
        </div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
          <span className="font-semibold text-[#F5F7FA]">Interconnected Ripple:</span>
          <span className="text-[#A5ADBE]">
            "{latestTx.description}" ({latestTx.type === 'expense' ? '-' : '+'}{formatRupees(latestTx.amount)}) shifted daily allowance to
          </span>
          <span className="font-mono font-bold text-[#63E5F4]">
            {formatRupees(metrics.safeDailyAllowance)}/day
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
        <Link
          to="/simulator"
          className="text-xs font-semibold text-[#C8FF4D] hover:underline flex items-center gap-1"
        >
          <span>Simulate What-If</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
        <button
          type="button"
          onClick={() => setDismissedTxId(latestTx.id)}
          className="p-1 rounded-md text-[#A5ADBE] hover:text-[#F5F7FA] hover:bg-white/5 transition-colors"
          aria-label="Dismiss consequence tracker"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
