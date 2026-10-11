import React from 'react'
import { Flame } from 'lucide-react'
import { triggerConfetti } from '../../utils/confetti'
import { useFinance } from '../../state/useFinance'

export const SurvivalStreakBadge: React.FC = () => {
  const { state, metrics, addToast } = useFinance()

  // Survival probability computed deterministically
  const survivalProb = Math.min(
    99,
    Math.max(15, Math.round(metrics.healthScore * 0.8 + (metrics.projectedMonthEndCash > 0 ? 20 : 0)))
  )

  const handleBadgeClick = (badgeName: string, perk: string) => {
    triggerConfetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#C8FF4D', '#63E5F4', '#9875FF'],
    })

    addToast({
      type: 'success',
      title: `Badge Unlocked: ${badgeName}! 🏆`,
      message: perk,
    })
  }

  const badges = [
    {
      id: 'swiggy',
      name: 'Discretionary Discipline',
      icon: '🛡️',
      earned: metrics.spendingPace.status !== 'over_budget',
      perk: 'Keeping spending within daily safe allowances.',
    },
    {
      id: 'buffer',
      name: 'Zen Cash Buffer',
      icon: '🧘',
      earned: metrics.availableDiscretionaryFunds > 0,
      perk: 'Unpaid bills and subscriptions are 100% reserved in cash.',
    },
    {
      id: 'sub',
      name: 'Subscription Auditor',
      icon: '⚡',
      earned: state.subscriptions.length > 0,
      perk: 'Active monthly recurring drain is tracked & monitored.',
    },
    {
      id: 'vault',
      name: 'Vault Builder',
      icon: '🎯',
      earned: metrics.savingsBalance > 0,
      perk: 'Cash reserves saved into dedicated goal vaults.',
    },
  ]

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#141822] via-[#1B2130] to-[#141822] border border-[#263045] shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3.5 border-b border-[#263045]/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#C8FF4D]/15 text-[#C8FF4D] border border-[#C8FF4D]/30 flex items-center justify-center font-bold">
            <Flame className="w-5 h-5 text-[#C8FF4D]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold font-display text-[#F5F7FA]">
                Survive the Month Challenge
              </h3>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#C8FF4D]/20 text-[#C8FF4D] font-bold">
                Day {state.currentDay} of 30
              </span>
            </div>
            <p className="text-xs text-[#A5ADBE] mt-0.5">
              Current Streak: <strong className="text-[#F5F7FA] font-mono">{state.currentDay} Days</strong> without budget exhaustion 🔥
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="text-right">
            <span className="text-xs text-[#A5ADBE] block uppercase font-bold">
              Survival Probability
            </span>
            <span
              className={`text-lg font-mono font-black ${
                survivalProb >= 80
                  ? 'text-[#34D399]'
                  : survivalProb >= 50
                  ? 'text-[#FFB340]'
                  : 'text-[#FF5C5C]'
              }`}
            >
              {survivalProb}%
            </span>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3.5">
        {badges.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => handleBadgeClick(b.name, b.perk)}
            className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
              b.earned
                ? 'bg-[#1B2130]/80 border-[#C8FF4D]/30 hover:border-[#C8FF4D] hover:scale-[1.02]'
                : 'bg-[#141822]/40 border-[#263045]/40 opacity-60'
            }`}
            title={b.perk}
          >
            <span className="text-xl shrink-0">{b.icon}</span>
            <div className="min-w-0">
              <span className="text-xs font-semibold text-[#F5F7FA] block truncate">
                {b.name}
              </span>
              <span className="text-xs text-[#A5ADBE] block truncate">
                {b.earned ? 'Unlocked ✨' : 'In Progress'}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
