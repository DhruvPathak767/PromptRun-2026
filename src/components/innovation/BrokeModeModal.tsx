import React, { useState } from 'react'
import { AlertOctagon, CheckCircle2, Zap } from 'lucide-react'
import { triggerConfetti } from '../../utils/confetti'
import { Modal } from '../common/Modal'
import { useFinance } from '../../state/useFinance'
import { formatRupees } from '../../finance/financeEngine'
import {
  selectActiveSubscriptions,
  selectEmergencyBailoutMetrics,
} from '../../finance/selectors'
import { playFanfareSound } from '../../lib/soundEffects'

interface BrokeModeModalProps {
  isOpen: boolean
  onClose: () => void
}

export const BrokeModeModal: React.FC<BrokeModeModalProps> = ({ isOpen, onClose }) => {
  const { state, metrics, toggleSubscription, addToast } = useFinance()
  const [executed, setExecuted] = useState(false)

  // Identify active non-essential subscriptions and compute emergency triage metrics
  const activeSubs = selectActiveSubscriptions(state.subscriptions)
  const emergencyGoal = state.goals.find((g) => g.currentAmount > 0)
  const {
    potentialSubSavings,
    emergencyTargetDaily,
    dailyCut,
    totalAllowanceSavings,
    emergencyGoalLiquidity,
    totalBufferRecoverable,
  } = selectEmergencyBailoutMetrics(
    state.subscriptions,
    metrics.safeDailyAllowance,
    metrics.inclusiveDaysRemaining,
    state.goals
  )

  const handleExecuteBailout = () => {
    // 1. Pause active subscriptions
    activeSubs.forEach((sub) => {
      toggleSubscription(sub.id)
    })

    // 2. Play celebratory fanfare sound
    playFanfareSound()

    triggerConfetti({
      particleCount: 60,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#C8FF4D', '#63E5F4', '#FFB340'],
    })

    setExecuted(true)

    addToast({
      type: 'success',
      title: '🚨 Emergency Bailout Activated!',
      message: `Frozen ${activeSubs.length} recurring subscriptions. Recovered up to ${formatRupees(totalBufferRecoverable)} in monthly safety buffer!`,
    })

    setTimeout(() => {
      setExecuted(false)
      onClose()
    }, 2200)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🚨 Broke Mode Auto-Triage & 1-Click Bailout"
      description="Instant algorithmic financial rescue when your budget runs dangerously thin before Day 30."
      maxWidth="lg"
    >
      <div className="space-y-5">
        {/* Risk Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FF5C5C]/20 via-[#1B2130] to-[#FFB340]/20 border border-[#FF5C5C]/40 flex items-start gap-3">
          <AlertOctagon className="w-5 h-5 text-[#FF5C5C] shrink-0 mt-0.5 animate-pulse" />
          <div className="min-w-0">
            <h4 className="text-xs font-bold font-display text-[#F5F7FA]">
              Emergency Liquidity Diagnostic
            </h4>
            <p className="text-xs text-[#A5ADBE] mt-0.5 leading-relaxed">
              Current Liquid Cash: <strong className="font-mono text-[#F5F7FA]">{formatRupees(metrics.cashBalance)}</strong> •
              Discretionary Buffer: <strong className={`font-mono ${metrics.availableDiscretionaryFunds >= 0 ? 'text-[#34D399]' : 'text-[#FF5C5C]'}`}>
                {formatRupees(metrics.availableDiscretionaryFunds)}
              </strong> • Cycle Day: <span className="font-mono">{state.currentDay} of 30</span>.
            </p>
          </div>
        </div>

        {/* 3-Step Prioritized Triage Matrix */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#A5ADBE] block">
            Algorithmic 3-Step Rescue Plan
          </span>

          {/* Action 1: Freeze Subscriptions */}
          <div className="p-3.5 rounded-xl bg-[#141822] border border-[#263045] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FF5C5C]/20 text-[#FF5C5C] flex items-center justify-center font-bold text-xs">
                1
              </div>
              <div>
                <span className="text-xs font-semibold text-[#F5F7FA] block">
                  Freeze {activeSubs.length} Active Subscriptions
                </span>
                <span className="text-xs text-[#A5ADBE]">
                  {activeSubs.map((s) => s.name).join(', ') || 'No active subscriptions'}
                </span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-[#C8FF4D] shrink-0">
              +{formatRupees(potentialSubSavings)}
            </span>
          </div>

          {/* Action 2: Emergency Daily Allowance Cut */}
          <div className="p-3.5 rounded-xl bg-[#141822] border border-[#263045] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FFB340]/20 text-[#FFB340] flex items-center justify-center font-bold text-xs">
                2
              </div>
              <div>
                <span className="text-xs font-semibold text-[#F5F7FA] block">
                  Ration Daily Spending to {formatRupees(emergencyTargetDaily)}/day
                </span>
                <span className="text-xs text-[#A5ADBE]">
                  Save {formatRupees(dailyCut)}/day over the remaining {metrics.inclusiveDaysRemaining} days of the cycle
                </span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-[#63E5F4] shrink-0">
              +{formatRupees(totalAllowanceSavings)}
            </span>
          </div>

          {/* Action 3: Goal Vault Micro-Liquidity Unlock */}
          <div className="p-3.5 rounded-xl bg-[#141822] border border-[#263045] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#9875FF]/20 text-[#9875FF] flex items-center justify-center font-bold text-xs">
                3
              </div>
              <div>
                <span className="text-xs font-semibold text-[#F5F7FA] block">
                  Goal Vault Emergency Micro-Shield
                </span>
                <span className="text-xs text-[#A5ADBE]">
                  {emergencyGoalLiquidity > 0
                    ? `Safely re-allocate ₹${emergencyGoalLiquidity} from ${emergencyGoal?.name || 'vault'} to avoid default`
                    : 'Goal vaults are currently zero'}
                </span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-[#9875FF] shrink-0">
              +{formatRupees(emergencyGoalLiquidity)}
            </span>
          </div>
        </div>

        {/* Total Recoverable Buffer Summary */}
        <div className="p-4 rounded-xl bg-[#1B2130] border border-[#263045] flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold text-[#A5ADBE] block">
              Total Buffer Recoverable
            </span>
            <span className="text-xs text-[#A5ADBE]">
              Prevents budget depletion and keeps Day 30 positive
            </span>
          </div>
          <span className="text-xl font-black font-mono text-[#C8FF4D]">
            {formatRupees(totalBufferRecoverable)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={executed}
            className="px-4 py-2 text-xs font-semibold text-[#A5ADBE] hover:text-[#F5F7FA] transition-colors"
          >
            Dismiss
          </button>

          <button
            type="button"
            onClick={handleExecuteBailout}
            disabled={executed || activeSubs.length === 0}
            className="px-5 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#FF5C5C] to-[#FFB340] hover:brightness-110 text-white flex items-center gap-2 transition-all shadow-lg shadow-[#FF5C5C]/20 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {executed ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Bailout Executed!</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Execute 1-Tap Emergency Bailout</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}
