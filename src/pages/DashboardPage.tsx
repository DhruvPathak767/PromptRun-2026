import React from 'react'
import { Link } from 'react-router-dom'
import { BalanceHero } from '../components/dashboard/BalanceHero'
import { FinancialMetricsGrid } from '../components/dashboard/FinancialMetric'
import { SpendingChart } from '../components/dashboard/SpendingChart'
import { CommitmentsPreview } from '../components/dashboard/CommitmentsPreview'
import { InsightsPreview } from '../components/dashboard/InsightsPreview'
import { useFinance } from '../state/useFinance'
import { formatRupees } from '../finance/financeEngine'
import { ArrowRight, Receipt } from 'lucide-react'

export const DashboardPage: React.FC = () => {
  const { state } = useFinance()

  // Recent 5 transactions
  const recentTransactions = state.transactions.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* 1. Main Hero: 3D Visualization + Balance Distinction */}
      <BalanceHero />

      {/* 2. Responsive Key Financial Metrics Grid */}
      <FinancialMetricsGrid />

      {/* 3. Spending Trajectory Chart */}
      <SpendingChart />

      {/* 4. Commitments and Contextual Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CommitmentsPreview />
        <InsightsPreview />
      </div>

      {/* 5. Recent Transactions Quick Ledger */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#141822] border border-[#263045] shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-[#263045]/60">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-[#C8FF4D]" />
            <h3 className="text-base font-bold font-display text-[#F5F7FA]">
              Recent Activity
            </h3>
          </div>
          <Link
            to="/transactions"
            className="text-xs text-[#C8FF4D] hover:underline flex items-center gap-1 font-medium"
          >
            <span>View All Transactions ({state.transactions.length})</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#A5ADBE]">
            No transactions recorded yet in this cycle.
          </div>
        ) : (
          <div className="mt-4 divide-y divide-[#263045]/40">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                      tx.type === 'income'
                        ? 'bg-[#C8FF4D]/15 text-[#C8FF4D]'
                        : tx.type === 'savings_transfer'
                        ? 'bg-[#63E5F4]/15 text-[#63E5F4]'
                        : 'bg-[#1C2433] text-[#A5ADBE]'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : tx.type === 'savings_transfer' ? '★' : '−'}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-[#F5F7FA] block truncate">
                      {tx.description}
                    </span>
                    <span className="text-[11px] text-[#A5ADBE]">
                      {tx.date} • {tx.category} {tx.isFixed ? '(Fixed)' : ''}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-xs font-bold font-mono block ${
                      tx.type === 'income'
                        ? 'text-[#C8FF4D]'
                        : tx.type === 'savings_transfer'
                        ? 'text-[#63E5F4]'
                        : 'text-[#F5F7FA]'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : tx.type === 'savings_transfer' ? '' : '−'}
                    {formatRupees(tx.amount)}
                  </span>
                  <span className="text-[10px] text-[#6B778C] capitalize">
                    {tx.type.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
