import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Receipt,
  CalendarDays,
  Target,
  FlaskConical,
} from 'lucide-react'
import { useFinance } from '../../state/useFinance'

interface MobileNavProps {
  onOpenQuickAction: () => void
}

export const MobileNavigation: React.FC<MobileNavProps> = ({ onOpenQuickAction }) => {
  const { state } = useFinance()

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0E121B]/95 backdrop-blur-xl border-t border-[#1C2433] px-2 py-2"
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-around">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-medium transition-colors ${
              isActive ? 'text-[#C8FF4D]' : 'text-[#A5ADBE] hover:text-[#F5F7FA]'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/budget"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-medium transition-colors ${
              isActive ? 'text-[#C8FF4D]' : 'text-[#A5ADBE] hover:text-[#F5F7FA]'
            }`
          }
        >
          <CalendarDays className="w-5 h-5" />
          <span>Budget</span>
        </NavLink>

        {/* Center Quick Action Trigger */}
        <button
          onClick={onOpenQuickAction}
          className="flex items-center justify-center -mt-6 w-12 h-12 rounded-full bg-gradient-to-tr from-[#C8FF4D] to-[#63E5F4] text-[#0B0D12] shadow-lg shadow-[#C8FF4D]/25 focus:outline-none focus:ring-2 focus:ring-[#C8FF4D] active:scale-95 transition-transform"
          aria-label="Quick Action: Add Expense or Simulate"
        >
          <span className="text-2xl font-black leading-none">+</span>
        </button>

        <NavLink
          to="/simulator"
          className={({ isActive }) =>
            `relative flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-medium transition-colors ${
              isActive ? 'text-[#C8FF4D]' : 'text-[#A5ADBE] hover:text-[#F5F7FA]'
            }`
          }
        >
          <FlaskConical className="w-5 h-5" />
          <span>What-If</span>
          {state.activeSimulation && (
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-[#FF5C5C] animate-ping" />
          )}
        </NavLink>

        <NavLink
          to="/transactions"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-medium transition-colors ${
              isActive ? 'text-[#C8FF4D]' : 'text-[#A5ADBE] hover:text-[#F5F7FA]'
            }`
          }
        >
          <Receipt className="w-5 h-5" />
          <span>Ledger</span>
        </NavLink>

        <NavLink
          to="/goals"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-medium transition-colors ${
              isActive ? 'text-[#C8FF4D]' : 'text-[#A5ADBE] hover:text-[#F5F7FA]'
            }`
          }
        >
          <Target className="w-5 h-5" />
          <span>Goals</span>
        </NavLink>
      </div>
    </nav>
  )
}
