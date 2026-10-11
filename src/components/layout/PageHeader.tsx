import React from 'react'
import { Link } from 'react-router-dom'
import {
  Plus,
  FlaskConical,
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
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  onOpenAddExpense,
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
    <header className="border-b border-[#1C2433] bg-[#0E121B]/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title & Context */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold font-display text-[#F5F7FA] tracking-tight">
              {title}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#1C2433] text-[#A5ADBE] border border-[#263045]">
              Demo Session
            </span>
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-[#A5ADBE] mt-0.5">{subtitle}</p>
          )}
        </div>

        {/* Controls & Actions */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Day Stepper */}
          <div className="flex items-center bg-[#141822] border border-[#263045] rounded-xl p-1 shadow-sm">
            <button
              onClick={handlePrevDay}
              disabled={state.currentDay <= 1}
              className="p-1 rounded-lg text-[#A5ADBE] hover:text-[#F5F7FA] hover:bg-[#1B2130] disabled:opacity-30 disabled:pointer-events-none transition-colors"
              aria-label="Previous cycle day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-2.5 flex items-center gap-1.5 text-xs font-mono font-semibold text-[#F5F7FA]">
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
            className="relative p-2 rounded-xl bg-[#141822] border border-[#263045] text-[#A5ADBE] hover:text-[#F5F7FA] hover:bg-[#1B2130] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C8FF4D]"
            aria-label={`View ${insights.length} Financial Insights`}
          >
            <Sparkles className="w-4 h-4 text-[#9875FF]" />
            {insights.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#9875FF] text-[10px] font-bold text-white flex items-center justify-center">
                {insights.length}
              </span>
            )}
          </Link>

          {/* What-If Simulator Trigger */}
          <Link
            to="/simulator"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all focus:outline-none focus:ring-2 focus:ring-[#C8FF4D] ${
              state.activeSimulation
                ? 'bg-[#FF5C5C]/20 border-[#FF5C5C] text-[#FF5C5C] shadow-lg shadow-[#FF5C5C]/10 animate-pulse'
                : 'bg-[#141822] border-[#263045] text-[#F5F7FA] hover:border-[#63E5F4] hover:bg-[#1B2130]'
            }`}
          >
            {state.activeSimulation ? (
              <ShieldAlert className="w-4 h-4 text-[#FF5C5C]" />
            ) : (
              <FlaskConical className="w-4 h-4 text-[#63E5F4]" />
            )}
            <span className="hidden sm:inline">
              {state.activeSimulation ? 'Sim Active' : 'What-If Lab'}
            </span>
          </Link>

          {/* Add Expense Primary Action */}
          <button
            onClick={onOpenAddExpense}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#C8FF4D] hover:bg-[#B5F530] text-[#0B0D12] shadow-md shadow-[#C8FF4D]/20 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#C8FF4D]"
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
