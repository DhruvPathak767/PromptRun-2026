import React from 'react'
import { Calendar, Trash2 } from 'lucide-react'
import { type Subscription } from '../../finance/financeTypes'
import { formatRupees } from '../../finance/financeEngine'

interface SubscriptionCardsListProps {
  subscriptions: Subscription[]
  currentDay: number
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export const SubscriptionCardsList: React.FC<SubscriptionCardsListProps> = ({
  subscriptions,
  currentDay,
  onToggle,
  onDelete,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {subscriptions.map((sub) => {
        const willChargeThisCycle = sub.active && sub.billingDay >= currentDay

        return (
          <div
            key={sub.id}
            className={`p-5 sm:p-6 rounded-2xl border shadow-xl flex flex-col justify-between transition-all ${
              sub.active
                ? 'bg-[#141822] border-[#263045] hover:border-[#3B4A6B]'
                : 'bg-[#141822]/50 border-[#263045]/40 opacity-70'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold font-display text-[#F5F7FA]">
                    {sub.name}
                  </h3>
                  <span className="text-xs text-[#A5ADBE] block mt-0.5">
                    {sub.tier || 'Monthly Subscription'} • {sub.category}
                  </span>
                </div>

                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    sub.active
                      ? 'bg-[#C8FF4D]/15 text-[#C8FF4D]'
                      : 'bg-[#FF5C5C]/15 text-[#FF5C5C]'
                  }`}
                >
                  {sub.active ? 'ACTIVE' : 'CANCELLED'}
                </span>
              </div>

              {/* Price & Billing Day */}
              <div className="mt-4 flex items-baseline justify-between">
                <div>
                  <span className="text-2xl font-black font-mono text-[#F5F7FA]">
                    {formatRupees(sub.price)}
                  </span>
                  <span className="text-xs text-[#A5ADBE] font-mono"> / month</span>
                </div>
                <span className="text-xs text-[#A5ADBE] flex items-center gap-1 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-[#C8FF4D]" /> Day {sub.billingDay}
                </span>
              </div>

              <p className="text-xs text-[#A5ADBE] mt-3">
                {willChargeThisCycle
                  ? `Scheduled to charge on Day ${sub.billingDay} (reserves ₹${sub.price} from cash).`
                  : sub.active
                  ? `Already billed earlier this cycle on Day ${sub.billingDay}.`
                  : 'Subscription is paused/cancelled. No future charges scheduled.'}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-5 pt-3 border-t border-[#263045]/60 flex items-center justify-between">
              <button
                onClick={() => onToggle(sub.id)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                  sub.active
                    ? 'border-[#FF5C5C]/30 text-[#FF5C5C] hover:bg-[#FF5C5C]/10'
                    : 'border-[#C8FF4D]/30 text-[#C8FF4D] hover:bg-[#C8FF4D]/10'
                }`}
              >
                {sub.active ? 'Cancel Future Charges' : 'Reactivate Service'}
              </button>

              <button
                onClick={() => onDelete(sub.id)}
                className="p-2 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-[#A5ADBE] hover:text-[#FF5C5C] hover:bg-[#FF5C5C]/10 transition-colors"
                title="Delete subscription"
                aria-label={`Delete ${sub.name}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
