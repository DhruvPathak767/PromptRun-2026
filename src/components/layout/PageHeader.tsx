import React from 'react'
import { Link } from 'react-router-dom'
import {
  Plus,
  Sparkles,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react'
import { useFinance } from '../../state/useFinance'

interface PageHeaderProps {
  title: string
  subtitle?: string
  onOpenAddExpense: () => void
  onOpenImpulseBuster?: () => void
  onOpenVibeCard?: () => void
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  onOpenAddExpense,
  onOpenImpulseBuster,
  onOpenVibeCard,
}) => {
  const { state, insights, setCurrentDay } = useFinance()

  const handlePrevDay = () => {
    if (state.currentDay > 1) {
      setCurrentDay(state.currentDay - 1)
    }
  }

  const handleNextDay = () => {
    if (state.currentDay < 30) {
      setCurrentDay(state.currentDay + 1)
    }
  }

  return (
    <header className="border-b border-[#1C2433] bg-[#0E121B]/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 py-3.5 sm:py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
        {/* Title & Context */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold font-display text-[#F5F7FA] tracking-tight truncate">
              {title}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#1C2433] text-[#A5ADBE] border border-[#263045] shrink-0">
              Demo Session
            </span>
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-[#A5ADBE] mt-0.5 truncate">{subtitle}</p>
          )}
        </div>

        {/* Controls & Actions - Always single inline row, never wraps */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Day Stepper */}
          <div className="flex items-center bg-[#141822] border border-[#263045] rounded-xl p-1 shadow-sm shrink-0">
            <button
              onClick={handlePrevDay}
              disabled={state.currentDay <= 1}
              className="p-1 rounded-lg text-[#A5ADBE] hover:text-[#F5F7FA] hover:bg-[#1B2130] disabled:opacity-30 disabled:pointer-events-none transition-colors"
              aria-label="Previous cycle day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-2 sm:px-2.5 flex items-center gap-1.5 text-xs font-mono font-semibold text-[#F5F7FA]">
              <Calendar className="w-3.5 h-3.5 text-[#C8FF4D]" />
              <span>Day {state.currentDay}</span>
              <span className="text-[#6B778C]">/30</span>
            </div>
            <button
              onClick={handleNextDay}
              disabled={state.currentDay >= 30}
              className="p-1 rounded-lg text-[#A5ADBE] hover:text-[#F5F7FA] hover:bg-[#1B2130] disabled:opacity-30 disabled:pointer-events-none transition-colors"
              aria-label="Advance cycle day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Insights Bell */}
          <Link
            to="/insights"
            className="relative p-2 rounded-xl bg-[#141822] border border-[#263045] text-[#A5ADBE] hover:text-[#F5F7FA] hover:bg-[#1B2130] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C8FF4D] shrink-0"
            aria-label={`View ${insights.length} Financial Insights`}
          >
            <Sparkles className="w-4 h-4 text-[#9875FF]" />
            {insights.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#9875FF] text-[10px] font-bold text-white flex items-center justify-center">
                {insights.length}
              </span>
            )}
          </Link>

          {/* Active Simulation Chip (Only displays when hypothetical scenario is running) */}
          {state.activeSimulation && (
            <Link
              to="/simulator"
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold bg-[#FF5C5C]/20 border border-[#FF5C5C] text-[#FF5C5C] animate-pulse shrink-0"
              title="Hypothetical simulation active"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-[#FF5C5C]" />
              <span className="hidden sm:inline">Sim Active</span>
            </Link>
          )}

          {/* Impulse Buster Trigger */}
          {onOpenImpulseBuster && (
            <button
              onClick={onOpenImpulseBuster}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold bg-[#141822] border border-[#FFB340]/40 text-[#FFB340] hover:bg-[#FFB340]/10 transition-all focus:outline-none focus:ring-2 focus:ring-[#FFB340] shrink-0"
              title="Test an impulse purchase before buying"
              aria-label="Impulse Buy Reality Checker"
            >
              <span className="text-xs">⚡</span>
              <span className="hidden xl:inline">Impulse Buster</span>
            </button>
          )}

          {/* Money Vibe Trigger */}
          {onOpenVibeCard && (
            <button
              onClick={onOpenVibeCard}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold bg-[#141822] border border-[#63E5F4]/40 text-[#63E5F4] hover:bg-[#63E5F4]/10 transition-all focus:outline-none focus:ring-2 focus:ring-[#63E5F4] shrink-0"
              title="View your 30-day money vibe card"
              aria-label="30-Day Money Vibe Card"
            >
              <span className="text-xs">✨</span>
              <span className="hidden xl:inline">My Vibe</span>
            </button>
          )}

          {/* Add Expense Primary Action */}
          <button
            onClick={onOpenAddExpense}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold bg-[#C8FF4D] hover:bg-[#B5F530] text-[#0B0D12] shadow-md shadow-[#C8FF4D]/20 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#C8FF4D] shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Active Simulation Notice Banner if simulation is active */}
      {state.activeSimulation && (
        <div className="mt-3 p-2.5 rounded-xl bg-gradient-to-r from-[#FF5C5C]/20 to-[#9875FF]/20 border border-[#FF5C5C]/40 flex items-center justify-between text-xs text-[#F5F7FA]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF5C5C] animate-ping" />
            <span className="font-semibold text-[#FF5C5C]">Hypothetical Scenario Active:</span>
            <span className="text-[#F5F7FA] truncate">{state.activeSimulation.title}</span>
          </div>
          <Link
            to="/simulator"
            className="text-xs font-bold text-[#C8FF4D] hover:underline shrink-0"
          >
            Review & Apply →
          </Link>
        </div>
      )}
    </header>
  )
}
