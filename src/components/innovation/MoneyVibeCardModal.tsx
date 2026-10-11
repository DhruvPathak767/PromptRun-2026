import React from 'react'
import { Share2, Check } from 'lucide-react'
import confetti from 'canvas-confetti'
import { Modal } from '../common/Modal'
import { useFinance } from '../../state/useFinance'
import { formatRupees } from '../../finance/financeEngine'

interface MoneyVibeCardModalProps {
  isOpen: boolean
  onClose: () => void
}

export const MoneyVibeCardModal: React.FC<MoneyVibeCardModalProps> = ({ isOpen, onClose }) => {
  const { metrics, state, addToast } = useFinance()
  const [copied, setCopied] = React.useState(false)

  // Determine Gen Z Financial Archetype
  const archetype =
    metrics.safeDailyAllowance >= 350 && metrics.availableDiscretionaryFunds > 3000
      ? {
          title: 'The Chai-Powered Strategist ☕',
          tagline: 'Cool, calculated, and comfortably on track for Day 30.',
          color: '#C8FF4D',
          emoji: '🧘',
        }
      : metrics.savingsBalance >= 1000
      ? {
          title: 'The Vault Builder 🎯',
          tagline: 'Allocating real cash into long-term goals while staying liquid.',
          color: '#63E5F4',
          emoji: '🚀',
        }
      : metrics.spendingPace.status === 'over_budget'
      ? {
          title: 'The High-Octane Explorer ⚡',
          tagline: 'Living fast on discretionary days, but checking the dashboard.',
          color: '#FFB340',
          emoji: '🏎️',
        }
      : {
          title: 'The Tactical Pragmatist 🛡️',
          tagline: 'Reserving every rupee for upcoming bills without defaulting.',
          color: '#9875FF',
          emoji: '🛡️',
        }

  const handleCopy = () => {
    const text = `🌌 RupeeFlow — My 30-Day Money Vibe:\n\n✨ Archetype: ${archetype.title}\n📊 Survival Streak: Day ${state.currentDay} of 30\n🛡️ Safe Daily Allowance: ${formatRupees(metrics.safeDailyAllowance)}/day\n💰 Total Saved Reserves: ${formatRupees(metrics.savingsBalance)}\n🎯 Day 30 Forecast: ${formatRupees(metrics.projectedMonthEndCash)}\n\nMake every rupee count at https://rupee-flow-124.netlify.app`

    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true)
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.7 },
        })
      } catch {
        // Ignore
      }
      addToast({
        type: 'success',
        title: 'Copied to Clipboard! 📋',
        message: 'Share your 30-Day Money Vibe card with friends.',
      })
      setTimeout(() => setCopied(false), 3000)
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="✨ My 30-Day Financial Vibe Card"
      description="Your personalized Gen Z money snapshot for this 30-day budget cycle."
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* The Viral Card */}
        <div
          className="p-6 rounded-2xl border relative overflow-hidden shadow-2xl space-y-4"
          style={{
            background: 'linear-gradient(145deg, #141822 0%, #1B2130 50%, #0B0D12 100%)',
            borderColor: `${archetype.color}40`,
          }}
        >
          {/* Subtle Glow */}
          <div
            className="absolute top-0 right-0 w-36 h-36 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ backgroundColor: archetype.color }}
          />

          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#A5ADBE] block">
                RupeeFlow 30-Day Vibe • Cycle Day {state.currentDay}
              </span>
              <h3 className="text-xl font-bold font-display text-[#F5F7FA] mt-1">
                {archetype.title}
              </h3>
            </div>
            <span className="text-3xl">{archetype.emoji}</span>
          </div>

          <p className="text-xs text-[#A5ADBE] leading-relaxed italic">
            "{archetype.tagline}"
          </p>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-[#0B0D12]/70 border border-[#263045]/60">
              <span className="text-[10px] text-[#A5ADBE] block">Safe Daily Allowance</span>
              <span className="text-lg font-black font-mono text-[#C8FF4D]">
                {formatRupees(metrics.safeDailyAllowance)}/d
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#0B0D12]/70 border border-[#263045]/60">
              <span className="text-[10px] text-[#A5ADBE] block">Health Score</span>
              <span className="text-lg font-black font-mono text-[#63E5F4]">
                {metrics.healthScore}/100
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#0B0D12]/70 border border-[#263045]/60">
              <span className="text-[10px] text-[#A5ADBE] block">Saved Reserves</span>
              <span className="text-lg font-black font-mono text-[#34D399]">
                {formatRupees(metrics.savingsBalance)}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#0B0D12]/70 border border-[#263045]/60">
              <span className="text-[10px] text-[#A5ADBE] block">Day 30 Estimated Cash</span>
              <span className="text-lg font-black font-mono text-[#F5F7FA]">
                {formatRupees(metrics.projectedMonthEndCash)}
              </span>
            </div>
          </div>

          <div className="pt-2 text-center text-[10px] font-mono text-[#6B778C]">
            rupeeflow • ₹10,000 monthly challenge • survive the month
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#A5ADBE] hover:text-[#F5F7FA] transition-colors"
          >
            Close
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="px-5 py-2 text-xs font-bold rounded-xl bg-[#C8FF4D] hover:bg-[#B5F530] text-[#0B0D12] flex items-center gap-2 transition-all shadow-md shadow-[#C8FF4D]/20 active:scale-95"
          >
            {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Copied Vibe Card!' : 'Copy Shareable Vibe'}</span>
          </button>
        </div>
      </div>
    </Modal>
  )
}
