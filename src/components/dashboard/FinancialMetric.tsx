import React from 'react'
import { Link } from 'react-router-dom'
import {
  Wallet,
  ShieldCheck,
  Calendar,
  Lock,
  PiggyBank,
  TrendingUp,
  Activity,
  ArrowUpRight,
  TrendingDown,
} from 'lucide-react'
import { useFinance } from '../../state/useFinance'
import { formatRupees } from '../../finance/financeEngine'

export const FinancialMetricsGrid: React.FC = () => {
  const { metrics, state } = useFinance()

  const items = [
    {
      title: 'Cash Balance',
      value: formatRupees(metrics.cashBalance),
      subtext: `From ${formatRupees(metrics.openingBudget)} starting budget`,
      icon: Wallet,
      color: 'text-[#F5F7FA]',
      bgColor: 'bg-[#1C2433]',
      to: '/transactions',
      badge: `${metrics.inclusiveDaysRemaining}d active`,
    },
    {
      title: 'Safe to Spend',
      value: formatRupees(metrics.availableDiscretionaryFunds),
      subtext: 'After subtracting bills & savings targets',
      icon: ShieldCheck,
      color: metrics.availableDiscretionaryFunds < 0 ? 'text-[#FF5C5C]' : 'text-[#C8FF4D]',
      bgColor: 'bg-[#C8FF4D]/15',
      to: '/budget',
      badge: metrics.availableDiscretionaryFunds < 0 ? 'DEFICIT' : 'BUFFER',
    },
    {
      title: 'Daily Allowance',
      value: `${formatRupees(metrics.safeDailyAllowance)}/d`,
      subtext: `Pacing over remaining ${metrics.inclusiveDaysRemaining} days`,
      icon: Calendar,
      color: 'text-[#63E5F4]',
      bgColor: 'bg-[#63E5F4]/15',
      to: '/budget',
      badge: `Day ${state.currentDay}`,
    },
    {
      title: 'Upcoming Commitments',
      value: formatRupees(metrics.upcomingCommitmentsTotal),
      subtext: `${metrics.upcomingCommitmentsCount} unpaid obligations & subs`,
      icon: Lock,
      color: 'text-[#9875FF]',
      bgColor: 'bg-[#9875FF]/15',
      to: '/subscriptions',
      badge: `${metrics.upcomingCommitmentsCount} pending`,
    },
    {
      title: 'Savings Progress',
      value: formatRupees(metrics.savingsBalance),
      subtext: `${state.goals.length} target goals in flight`,
      icon: PiggyBank,
      color: 'text-[#34D399]',
      bgColor: 'bg-[#34D399]/15',
      to: '/goals',
      badge: `${state.goals.length} goals`,
    },
    {
      title: 'Month-End Forecast',
      value: formatRupees(metrics.projectedMonthEndCash),
      subtext: `Projected cash remaining on Day 30`,
      icon: metrics.projectedMonthEndCash >= 0 ? TrendingUp : TrendingDown,
      color: metrics.projectedMonthEndCash >= 500 ? 'text-[#C8FF4D]' : metrics.projectedMonthEndCash >= 0 ? 'text-[#FFB340]' : 'text-[#FF5C5C]',
      bgColor: 'bg-[#1C2433]',
      to: '/simulator',
      badge: metrics.projectedMonthEndCash >= 0 ? 'SURPLUS' : 'DEFICIT',
    },
    {
      title: 'Financial Health',
      value: `${metrics.healthScore}/100`,
      subtext: `${metrics.healthBand} condition`,
      icon: Activity,
      color: metrics.healthColor,
      bgColor: 'bg-[#1C2433]',
      to: '/insights',
      badge: metrics.healthBand,
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4">
      {items.map((item, idx) => (
        <Link
          key={item.title}
          to={item.to}
          className={`p-4 rounded-xl bg-[#141822] border border-[#263045] hover:border-[#3B4A6B] hover:bg-[#1A202E] transition-all duration-200 flex flex-col justify-between group shadow-sm ${
            idx === 1 ? 'border-[#C8FF4D]/30' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <div className={`p-2 rounded-lg ${item.bgColor}`}>
              <item.icon className={`w-4 h-4 ${item.color}`} />
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#6B778C] group-hover:text-[#F5F7FA] transition-colors" />
          </div>

          <div className="mt-3">
            <span className="text-[11px] font-medium text-[#A5ADBE] block truncate">
              {item.title}
            </span>
            <span
              className={`text-lg sm:text-xl font-bold font-mono tracking-tight block mt-0.5 truncate ${item.color}`}
            >
              {item.value}
            </span>
            <p className="text-[10px] text-[#6B778C] mt-1 leading-tight line-clamp-1">
              {item.subtext}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}
