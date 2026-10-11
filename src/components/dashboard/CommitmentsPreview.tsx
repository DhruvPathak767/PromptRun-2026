import React from 'react'
import { Link } from 'react-router-dom'
import { Lock, Check, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useFinance } from '../../state/useFinance'
import { formatRupees } from '../../finance/financeEngine'

export const CommitmentsPreview: React.FC = () => {
  const { metrics, state, markCommitmentPaid } = useFinance()

  const commitments = metrics.unpaidCommitments.slice(0, 4)

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[#141822] border border-[#263045] shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[#263045]/60">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#9875FF]" />
            <h2 className="text-base font-bold font-display text-[#F5F7FA]">
              Upcoming Commitments
            </h2>
          </div>
          <Link
            to="/subscriptions"
            className="text-xs text-[#9875FF] hover:underline flex items-center gap-1 font-medium"
          >
            <span>View All ({metrics.upcomingCommitmentsCount})</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <p className="text-xs text-[#A5ADBE] mt-2">
          Scheduled bills and active subscriptions due before Day 30 that reserve cash.
        </p>

        {commitments.length === 0 ? (
          <div className="py-8 text-center text-[#A5ADBE] text-xs">
            <CheckCircle2 className="w-8 h-8 text-[#C8FF4D] mx-auto mb-2" />
            No pending commitments remaining for this cycle! All clear.
          </div>
        ) : (
          <div className="mt-4 space-y-2.5">
            {commitments.map((c) => {
              const isVirtualSub = c.id.startsWith('virtual-sub-')
              const daysAway = c.dueDay - state.currentDay
              return (
                <div
                  key={c.id}
                  className="p-3 rounded-xl bg-[#1B2130]/70 border border-[#263045] flex items-center justify-between gap-3 hover:border-[#3B4A6B] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#F5F7FA] truncate">
                        {c.name}
                      </span>
                      <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-[#141822] text-[#A5ADBE] border border-[#263045]">
                        {c.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-[#A5ADBE]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#C8FF4D]" /> Due Day {c.dueDay}
                      </span>
                      <span>•</span>
                      <span className={daysAway <= 3 ? 'text-[#FF5C5C] font-semibold' : ''}>
                        {daysAway === 0
                          ? 'Due Today!'
                          : daysAway > 0
                          ? `in ${daysAway} days`
                          : 'Due'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold font-mono text-[#F5F7FA]">
                      {formatRupees(c.amount)}
                    </span>
                    {!isVirtualSub && (
                      <button
                        onClick={() => markCommitmentPaid(c.id)}
                        className="p-2 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg bg-[#C8FF4D]/10 hover:bg-[#C8FF4D] text-[#C8FF4D] hover:text-[#0B0D12] transition-colors focus:outline-none focus:ring-1 focus:ring-[#C8FF4D]"
                        title="Mark as Paid"
                        aria-label={`Mark ${c.name} as paid`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-[#263045]/60 flex items-center justify-between text-xs text-[#A5ADBE]">
        <span>Total Reserved:</span>
        <span className="font-bold font-mono text-[#9875FF]">
          {formatRupees(metrics.upcomingCommitmentsTotal)}
        </span>
      </div>
    </div>
  )
}
