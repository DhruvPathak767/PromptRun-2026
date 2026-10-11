import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Receipt,
  CalendarDays,
  Target,
  Repeat,
  FlaskConical,
  Sparkles,
  Settings,
  ChevronRight,
  TrendingUp,
  UserCheck,
} from 'lucide-react'
import { useFinance } from '../../state/useFinance'

interface NavItem {
  name: string
  to: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  badgeColor?: string
}

export const Sidebar: React.FC = () => {
  const { state, metrics, insights } = useFinance()

  const navItems: NavItem[] = [
    { name: 'Dashboard', to: '/', icon: LayoutDashboard },
    {
      name: 'What-If Lab',
      to: '/simulator',
      icon: FlaskConical,
      badge: state.activeSimulation ? 'ACTIVE' : 'SIM',
      badgeColor: state.activeSimulation ? 'bg-[#FF5C5C] text-white animate-pulse' : 'bg-[#C8FF4D]/20 text-[#C8FF4D]',
    },
    { name: 'Transactions', to: '/transactions', icon: Receipt, badge: `${state.transactions.length}` },
    { name: 'Budget Planner', to: '/budget', icon: CalendarDays },
    { name: 'Savings Goals', to: '/goals', icon: Target, badge: `${state.goals.length}` },
    {
      name: 'Subscriptions',
      to: '/subscriptions',
      icon: Repeat,
      badge: `${state.subscriptions.filter((s) => s.active).length}`,
    },
    {
      name: 'Financial Insights',
      to: '/insights',
      icon: Sparkles,
      badge: `${insights.length}`,
      badgeColor: 'bg-[#9875FF]/20 text-[#9875FF]',
    },
    { name: 'Settings & Demo', to: '/settings', icon: Settings },
  ]

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-[#0E121B] border-r border-[#1C2433] z-40 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#1C2433]">
        <NavLink to="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#C8FF4D] rounded-xl p-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1C2433] to-[#141822] border border-[#C8FF4D]/40 flex items-center justify-center shadow-lg group-hover:border-[#C8FF4D] transition-colors">
            <span className="text-xl font-black text-[#C8FF4D] font-display">₹</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-extrabold text-base tracking-tight text-[#F5F7FA]">
                Rupee<span className="text-[#C8FF4D]">Flow</span>
              </span>
              <span className="text-xs uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#1B2130] text-[#A5ADBE] border border-[#263045]">
                Gen Z
              </span>
            </div>
            <p className="text-xs text-[#A5ADBE]">Make every rupee count.</p>
          </div>
        </NavLink>

        {/* 30-Day Cycle Widget */}
        <div className="mt-4 p-3 rounded-xl bg-[#141822] border border-[#1C2433]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#A5ADBE] flex items-center gap-1.5 font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-[#C8FF4D]" /> Cycle Position
            </span>
            <span className="text-xs font-bold text-[#F5F7FA] font-mono">
              Day {state.currentDay} <span className="text-[#A5ADBE] font-normal">/ 30</span>
            </span>
          </div>
          <div className="w-full bg-[#1B2130] h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#C8FF4D] via-[#63E5F4] to-[#9875FF] h-full rounded-full transition-all duration-500"
              style={{ width: `${(state.currentDay / 30) * 100}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-2 text-xs text-[#A5ADBE]">
            <span>{metrics.daysRemaining} days left</span>
            <span className="text-[#C8FF4D] font-mono font-medium">₹10,000 Cap</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Main Navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-[#1B2130] to-[#141822] text-[#F5F7FA] border border-[#263045] shadow-sm'
                  : 'text-[#A5ADBE] hover:text-[#F5F7FA] hover:bg-[#141822]/70'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <item.icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-[#C8FF4D]' : 'text-[#A5ADBE] group-hover:text-[#F5F7FA]'
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        item.badgeColor || 'bg-[#1C2433] text-[#A5ADBE]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#C8FF4D]" />}
                </div>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Demo User Info Card */}
      <div className="p-3 border-t border-[#1C2433] bg-[#0E121B]">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-[#141822] border border-[#1C2433]">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#9875FF] to-[#63E5F4] flex items-center justify-center font-bold text-xs text-[#0B0D12]">
            AS
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-[#F5F7FA] truncate">Aarav Sharma</span>
              <UserCheck className="w-3 h-3 text-[#C8FF4D]" />
            </div>
            <p className="text-xs text-[#A5ADBE] truncate">Client-Side Demo Session</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
