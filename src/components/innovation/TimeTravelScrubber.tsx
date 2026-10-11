import React, { useState, useEffect } from 'react'
import { Play, Pause, RotateCcw, FastForward, AlertTriangle, ShieldCheck } from 'lucide-react'
import { useFinance } from '../../state/useFinance'
import { formatRupees } from '../../finance/financeEngine'
import { selectDeficitCrashDay } from '../../finance/selectors'

export const TimeTravelScrubber: React.FC = () => {
  const { state, metrics, setCurrentDay } = useFinance()
  const [isPlaying, setIsPlaying] = useState(false)

  // Predict exact Zero-Cash Day if spending continues at user's current velocity
  const dailySpendVelocity = state.currentDay > 1
    ? (10000 - metrics.cashBalance) / (state.currentDay - 1)
    : 250

  const zeroCashDay = selectDeficitCrashDay(state.currentDay, metrics.cashBalance, dailySpendVelocity) ?? 30
  const willDepleteEarly = zeroCashDay < 30 && metrics.projectedMonthEndCash < 0

  // Auto-play cycle simulator animation
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null
    if (isPlaying) {
      interval = setInterval(() => {
        if (state.currentDay < 30) {
          setCurrentDay(state.currentDay + 1)
        } else {
          setIsPlaying(false)
        }
      }, 700)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPlaying, state.currentDay, setCurrentDay])

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#141822] border border-[#263045] shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#63E5F4]/20 text-[#63E5F4] flex items-center justify-center font-bold">
            <FastForward className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-display text-[#F5F7FA] flex items-center gap-2">
              <span>30-Day Time-Travel Engine</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#1B2130] text-[#A5ADBE] border border-[#263045]">
                Fast-Forward Lab
              </span>
            </h3>
            <p className="text-xs text-[#A5ADBE] mt-0.5">
              Scrub days to preview how your ₹10,000 cash pool & commitments evolve over time.
            </p>
          </div>
        </div>

        {/* Play / Reset Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              isPlaying
                ? 'bg-[#FFB340] text-[#0B0D12]'
                : 'bg-[#1B2130] hover:bg-[#263045] text-[#F5F7FA] border border-[#263045]'
            }`}
            aria-label={isPlaying ? "Pause timeline playback" : "Play timeline simulation"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-[#C8FF4D]" />}
            <span>{isPlaying ? 'Pause' : 'Auto-Play Cycle'}</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentDay(1)}
            disabled={state.currentDay === 1}
            className="p-2 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-xl bg-[#1B2130] hover:bg-[#263045] text-[#A5ADBE] hover:text-[#F5F7FA] border border-[#263045] disabled:opacity-40 transition-colors"
            title="Reset to Day 1"
            aria-label="Reset to Day 1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive Range Slider */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-[#A5ADBE]">Day 1 (Start)</span>
          <span className="text-[#C8FF4D] font-bold">Simulating Day {state.currentDay} of 30</span>
          <span className="text-[#A5ADBE]">Day 30 (Finish)</span>
        </div>

        <input
          type="range"
          min="1"
          max="30"
          value={state.currentDay}
          onChange={(e) => setCurrentDay(parseInt(e.target.value, 10))}
          className="w-full accent-[#C8FF4D] bg-[#1B2130] h-2 rounded-lg cursor-pointer"
          aria-label="Cycle Simulation Day Slider"
        />
      </div>

      {/* Zero-Cash Deficit Forecast Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
        <div className="p-3 rounded-xl bg-[#1B2130]/80 border border-[#263045]">
          <span className="text-xs text-[#A5ADBE] block uppercase font-bold">Days Remaining</span>
          <span className="text-base font-mono font-bold text-[#F5F7FA]">
            {metrics.inclusiveDaysRemaining} Days
          </span>
        </div>

        <div className="p-3 rounded-xl bg-[#1B2130]/80 border border-[#263045]">
          <span className="text-xs text-[#A5ADBE] block uppercase font-bold">Daily Burn Velocity</span>
          <span className="text-base font-mono font-bold text-[#63E5F4]">
            ~{formatRupees(dailySpendVelocity)}/day
          </span>
        </div>

        <div className="p-3 rounded-xl bg-[#1B2130]/80 border border-[#263045]">
          <span className="text-xs text-[#A5ADBE] block uppercase font-bold">Zero-Cash Crash Date</span>
          <div className="flex items-center gap-1.5">
            {willDepleteEarly ? (
              <span className="text-base font-mono font-bold text-[#FF5C5C] flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-[#FF5C5C]" />
                Day {zeroCashDay}
              </span>
            ) : (
              <span className="text-base font-mono font-bold text-[#34D399] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#34D399]" />
                Solvent (Day 30+)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
