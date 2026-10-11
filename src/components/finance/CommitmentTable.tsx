import React from 'react'
import { Trash2 } from 'lucide-react'
import { type Commitment } from '../../finance/financeTypes'
import { formatRupees } from '../../finance/financeEngine'

interface CommitmentTableProps {
  commitments: Commitment[]
  currentDay: number
  onMarkPaid: (id: string) => void
  onDelete: (id: string) => void
}

export const CommitmentTable: React.FC<CommitmentTableProps> = ({
  commitments,
  currentDay,
  onMarkPaid,
  onDelete,
}) => {
  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[#141822] border border-[#263045] shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left" aria-label="Scheduled Bill Obligations">
          <thead>
            <tr className="border-b border-[#263045] text-[#A5ADBE]">
              <th scope="col" className="py-2.5 pr-2 font-medium">Obligation Name</th>
              <th scope="col" className="py-2.5 px-2 font-medium">Due Day</th>
              <th scope="col" className="py-2.5 px-2 font-medium">Category</th>
              <th scope="col" className="py-2.5 px-2 font-medium">Amount</th>
              <th scope="col" className="py-2.5 px-2 font-medium">Status</th>
              <th scope="col" className="py-2.5 pl-2 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#263045]/50">
            {commitments.map((c) => {
              const daysAway = c.dueDay - currentDay
              return (
                <tr key={c.id} className="hover:bg-[#1B2130]/30 transition-colors">
                  <td className="py-3 pr-2 font-semibold text-[#F5F7FA]">{c.name}</td>
                  <td className="py-3 px-2 font-mono text-[#A5ADBE]">
                    Day {c.dueDay}{' '}
                    {!c.isPaid && (
                      <span
                        className={`text-xs ml-1 ${
                          daysAway <= 3 ? 'text-[#FF5C5C] font-bold' : 'text-[#A5ADBE]'
                        }`}
                      >
                        ({daysAway === 0 ? 'Today' : daysAway > 0 ? `in ${daysAway}d` : 'Past due'})
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-2 text-[#A5ADBE]">{c.category}</td>
                  <td className="py-3 px-2 font-mono font-bold text-[#F5F7FA]">
                    {formatRupees(c.amount)}
                  </td>
                  <td className="py-3 px-2">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        c.isPaid
                          ? 'bg-[#34D399]/15 text-[#34D399]'
                          : 'bg-[#FFB340]/15 text-[#FFB340]'
                      }`}
                    >
                      {c.isPaid ? 'PAID' : 'PENDING'}
                    </span>
                  </td>
                  <td className="py-3 pl-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {!c.isPaid && (
                        <button
                          onClick={() => onMarkPaid(c.id)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#C8FF4D]/15 text-[#C8FF4D] hover:bg-[#C8FF4D] hover:text-[#0B0D12] transition-colors"
                        >
                          Pay Now
                        </button>
                      )}
                      <button
                        onClick={() => onDelete(c.id)}
                        className="p-2 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-[#A5ADBE] hover:text-[#FF5C5C] transition-colors"
                        aria-label={`Delete ${c.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
