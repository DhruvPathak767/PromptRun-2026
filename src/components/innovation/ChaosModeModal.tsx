import React, { useState } from 'react'
import { Modal } from '../common/Modal'
import { useFinance } from '../../state/useFinance'
import { formatRupees } from '../../finance/financeEngine'
import {
  Zap,
  ShieldAlert,
  Flame,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
} from 'lucide-react'
import { playWarningSound, playFanfareSound } from '../../lib/soundEffects'
import { triggerConfetti } from '../../utils/confetti'

interface ShockScenario {
  id: string
  title: string
  amount: number
  description: string
  severity: 'moderate' | 'high' | 'catastrophic'
}

const PRESET_SHOCKS: ShockScenario[] = [
  {
    id: 'laptop-spill',
    title: 'Laptop Liquid Spill Keyboard Repair',
    amount: 1450,
    description: 'Accidental chai spill across keyboard requires emergency membrane servicing.',
    severity: 'high',
  },
  {
    id: 'bike-puncture',
    title: 'Commuter Bike Puncture & Tyre Replacement',
    amount: 520,
    description: 'Road hazard punctured back tyre; required urgent tube replacement and towing.',
    severity: 'moderate',
  },
  {
    id: 'dental-clinic',
    title: 'Emergency Tooth Ache & Dental Filling',
    amount: 980,
    description: 'Severe tooth inflammation needed immediate diagnosis and composite filling.',
    severity: 'moderate',
  },
  {
    id: 'phone-screen',
    title: 'Cracked Display Screen Replacement',
    amount: 1950,
    description: 'Phone slipped on pavement; screen glass shattered completely.',
    severity: 'catastrophic',
  },
  {
    id: 'hostel-fine',
    title: 'Unexpected Hostel Maintenance Surcharge',
    amount: 750,
    description: 'Semester utility adjustment billed by campus administration without warning.',
    severity: 'moderate',
  },
]

interface ChaosModeModalProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * Chaos Mode: Financial Shock Simulator & Resilience Engine.
 * Tests financial endurance by injecting unexpected real-world Gen Z expenses
 * and calculating real-time financial resilience scores (0-100).
 */
export const ChaosModeModal: React.FC<ChaosModeModalProps> = ({ isOpen, onClose }) => {
  const { state, metrics, addTransaction, addToast } = useFinance()
  const [selectedShock, setSelectedShock] = useState<ShockScenario>(PRESET_SHOCKS[0])
  const [absorbed, setAbsorbed] = useState(false)

  // Compute Current Resilience Score (0 - 100)
  const computeResilience = (balance: number, discretionary: number, dailyAllowance: number): number => {
    const liquidScore = Math.min(40, Math.max(0, (balance / 10000) * 40))
    const discretionaryScore = discretionary > 0 ? Math.min(30, (discretionary / 3000) * 30) : 0
    const pacingScore = dailyAllowance >= 150 ? 30 : Math.max(0, (dailyAllowance / 150) * 30)
    return Math.round(liquidScore + discretionaryScore + pacingScore)
  }

  const currentResilience = computeResilience(
    metrics.cashBalance,
    metrics.availableDiscretionaryFunds,
    metrics.safeDailyAllowance
  )

  // Projected metrics if shock is absorbed
  const projectedBalance = metrics.cashBalance - selectedShock.amount
  const projectedDiscretionary = metrics.availableDiscretionaryFunds - selectedShock.amount
  const safeDays = Math.max(1, metrics.inclusiveDaysRemaining)
  const projectedDailyAllowance = Math.max(0, Math.round(projectedDiscretionary / safeDays))
  const projectedResilience = computeResilience(
    projectedBalance,
    projectedDiscretionary,
    projectedDailyAllowance
  )

  const resilienceDelta = projectedResilience - currentResilience

  const getResilienceRating = (score: number) => {
    if (score >= 80) return { label: 'Antifragile', color: 'text-[#C8FF4D]', bg: 'bg-[#C8FF4D]/15' }
    if (score >= 60) return { label: 'Resilient', color: 'text-[#63E5F4]', bg: 'bg-[#63E5F4]/15' }
    if (score >= 40) return { label: 'Vulnerable', color: 'text-[#FFB340]', bg: 'bg-[#FFB340]/15' }
    return { label: 'Deficit Risk', color: 'text-[#FF5C5C]', bg: 'bg-[#FF5C5C]/15' }
  }

  const currentRating = getResilienceRating(currentResilience)
  const projectedRating = getResilienceRating(projectedResilience)

  const handleRandomize = () => {
    const remaining = PRESET_SHOCKS.filter((s) => s.id !== selectedShock.id)
    const random = remaining[Math.floor(Math.random() * remaining.length)]
    setSelectedShock(random)
    setAbsorbed(false)
  }

  const handleAbsorbShock = () => {
    playWarningSound()
    addTransaction({
      description: `💥 ${selectedShock.title}`,
      amount: selectedShock.amount,
      category: 'Unexpected & Emergency',
      type: 'expense',
      cycleDay: state.currentDay,
      date: `Day ${state.currentDay} • Chaos Shock`,
      isFixed: false,
      note: 'Injected via Chaos Mode shock stress test',
    })

    setAbsorbed(true)
    addToast({
      title: 'Shock Absorbed',
      message: `Absorbed ${formatRupees(selectedShock.amount)} unexpected shock into 30-day ledger!`,
      type: 'warning',
    })

    if (projectedBalance > 0) {
      setTimeout(() => {
        playFanfareSound()
        triggerConfetti()
      }, 500)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chaos Mode — Financial Shock Generator"
      description="Stress-test your ₹10,000 budget against real-world Gen Z financial emergencies."
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Shock Selection Chips */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#A5ADBE] uppercase tracking-wider">
              Select Shock Scenario
            </span>
            <button
              type="button"
              onClick={handleRandomize}
              className="flex items-center gap-1 text-xs text-[#C8FF4D] hover:underline p-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Randomize Shock</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {PRESET_SHOCKS.map((shock) => {
              const isSelected = shock.id === selectedShock.id
              return (
                <button
                  key={shock.id}
                  type="button"
                  onClick={() => {
                    setSelectedShock(shock)
                    setAbsorbed(false)
                  }}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#1C2433] border-[#FF5C5C] shadow-lg ring-1 ring-[#FF5C5C]/50'
                      : 'bg-[#141822] border-[#263045] hover:border-[#3B4A6B]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-[#F5F7FA] font-display line-clamp-1">
                      {shock.title}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#FF5C5C] shrink-0">
                      ₹{shock.amount}
                    </span>
                  </div>
                  <span className="text-xs text-[#A5ADBE] mt-1 line-clamp-1">
                    {shock.description}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Selected Shock Spotlight Card */}
        <div className="p-4 rounded-2xl bg-[#FF5C5C]/10 border border-[#FF5C5C]/30 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FF5C5C]/20 text-[#FF5C5C] flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-sm font-bold text-[#F5F7FA] font-display">
                {selectedShock.title}
              </h4>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold font-mono bg-[#FF5C5C]/20 text-[#FF5C5C]">
                -₹{selectedShock.amount}
              </span>
            </div>
            <p className="text-xs text-[#A5ADBE] mt-1">
              {selectedShock.description}
            </p>
          </div>
        </div>

        {/* Resilience Score Comparison Matrix */}
        <div className="p-4 rounded-2xl bg-[#141822] border border-[#263045] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#C8FF4D]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5F7FA]">
                Financial Resilience Engine
              </h4>
            </div>
            <span className="text-xs text-[#A5ADBE]">
              Cycle Day {state.currentDay} of 30
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Before Shock */}
            <div className="p-3 rounded-xl bg-[#1B2130] border border-[#263045]">
              <span className="text-xs text-[#A5ADBE] block">Current Resilience</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black font-mono text-[#F5F7FA]">
                  {currentResilience}
                </span>
                <span className="text-xs text-[#A5ADBE]">/ 100</span>
              </div>
              <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-bold ${currentRating.bg} ${currentRating.color}`}>
                {currentRating.label}
              </span>
            </div>

            {/* After Shock */}
            <div className="p-3 rounded-xl bg-[#1B2130] border border-[#263045]">
              <span className="text-xs text-[#A5ADBE] block">Post-Shock Resilience</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black font-mono text-[#FF5C5C]">
                  {projectedResilience}
                </span>
                <span className="text-xs text-[#FF5C5C] font-mono font-bold">
                  ({resilienceDelta} pts)
                </span>
              </div>
              <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-bold ${projectedRating.bg} ${projectedRating.color}`}>
                {projectedRating.label}
              </span>
            </div>
          </div>

          {/* Interconnected Consequence Indicators */}
          <div className="p-3 rounded-xl bg-[#0B0D12] border border-[#263045] space-y-2 text-xs">
            <span className="font-semibold text-[#A5ADBE] block uppercase tracking-wider">
              Cross-Screen Consequences:
            </span>
            <div className="flex items-center justify-between text-[#A5ADBE]">
              <span>Liquid Cash Balance:</span>
              <span className="font-mono text-[#F5F7FA]">
                {formatRupees(metrics.cashBalance)} <ArrowRight className="inline w-3 h-3 text-[#A5ADBE]" /> {formatRupees(projectedBalance)}
              </span>
            </div>
            <div className="flex items-center justify-between text-[#A5ADBE]">
              <span>Safe Daily Allowance:</span>
              <span className="font-mono text-[#63E5F4]">
                {formatRupees(metrics.safeDailyAllowance)}/d <ArrowRight className="inline w-3 h-3 text-[#A5ADBE]" /> {formatRupees(projectedDailyAllowance)}/d
              </span>
            </div>
            <div className="flex items-center justify-between text-[#A5ADBE]">
              <span>Buffer Status:</span>
              <span className={`font-semibold ${projectedDiscretionary >= 0 ? 'text-[#C8FF4D]' : 'text-[#FF5C5C]'}`}>
                {projectedDiscretionary >= 0 ? 'Survives within buffer' : 'Triggers Deficit Risk'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-[#A5ADBE] bg-[#141822] hover:bg-[#1B2130] border border-[#263045] transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleAbsorbShock}
            disabled={absorbed}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
              absorbed
                ? 'bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/40 cursor-default'
                : 'bg-[#FF5C5C] hover:bg-[#FF4545] text-[#0B0D12] shadow-lg shadow-[#FF5C5C]/20'
            }`}
          >
            {absorbed ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
                <span>Shock Recorded to Ledger!</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-4 h-4" />
                <span>Absorb Shock ({formatRupees(selectedShock.amount)})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}
