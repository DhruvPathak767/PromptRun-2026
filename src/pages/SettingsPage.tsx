import React, { useState } from 'react'
import {
  RotateCcw,
  ShieldCheck,
  Calendar,
  HardDrive,
} from 'lucide-react'
import { useFinance } from '../state/useFinance'
import { ConfirmDialog } from '../components/common/ConfirmDialog'

export const SettingsPage: React.FC = () => {
  const { state, setCurrentDay, resetDemoData } = useFinance()
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false)
  const [inputDay, setInputDay] = useState(state.currentDay.toString())

  const handleApplyDay = (e: React.FormEvent) => {
    e.preventDefault()
    const d = parseInt(inputDay, 10)
    if (!isNaN(d) && d >= 1 && d <= 30) {
      setCurrentDay(d)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Simulation Day Controller */}
      <div className="p-6 rounded-2xl bg-[#141822] border border-[#263045] shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#263045]/60">
          <Calendar className="w-5 h-5 text-[#C8FF4D]" />
          <div>
            <h3 className="text-base font-bold font-display text-[#F5F7FA]">
              30-Day Cycle Simulation Day
            </h3>
            <p className="text-xs text-[#A5ADBE]">
              Adjust the current cycle day to inspect how budget pacing, daily allowances, and forecasts evolve.
            </p>
          </div>
        </div>

        <form onSubmit={handleApplyDay} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1">
            <label htmlFor="setting-day" className="block text-xs font-medium text-[#A5ADBE] mb-1">
              Current Simulation Day (1 to 30)
            </label>
            <input
              id="setting-day"
              type="number"
              min="1"
              max="30"
              value={inputDay}
              onChange={(e) => setInputDay(e.target.value)}
              className="w-full px-3 py-2 bg-[#1B2130] border border-[#263045] rounded-xl text-xs font-mono text-[#F5F7FA] focus:outline-none focus:border-[#C8FF4D]"
            />
          </div>

          <div className="flex gap-2 self-end sm:self-auto pt-5">
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold bg-[#C8FF4D] text-[#0B0D12] rounded-xl hover:bg-[#B5F530] transition-colors"
            >
              Set Day
            </button>
          </div>
        </form>

        {/* Quick Day Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs text-[#A5ADBE]">Quick Jump:</span>
          {[1, 5, 12, 18, 25, 30].map((d) => (
            <button
              key={d}
              onClick={() => {
                setCurrentDay(d)
                setInputDay(d.toString())
              }}
              className={`px-3 py-1 text-xs font-mono font-bold rounded-lg border transition-all ${
                state.currentDay === d
                  ? 'bg-[#C8FF4D] text-[#0B0D12] border-[#C8FF4D]'
                  : 'bg-[#1B2130] text-[#A5ADBE] border-[#263045] hover:text-[#F5F7FA]'
              }`}
            >
              Day {d}
            </button>
          ))}
        </div>
      </div>

      {/* Local Persistence & Storage Status */}
      <div className="p-6 rounded-2xl bg-[#141822] border border-[#263045] shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#263045]/60">
          <HardDrive className="w-5 h-5 text-[#63E5F4]" />
          <div>
            <h3 className="text-base font-bold font-display text-[#F5F7FA]">
              Client-Side Persistence & Schema
            </h3>
            <p className="text-xs text-[#A5ADBE]">
              All data is stored purely in your browser localStorage under schema version 1.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#1B2130]/60 border border-[#263045]">
            <span className="text-[#A5ADBE] block">Total Transactions</span>
            <span className="font-mono font-bold text-sm text-[#F5F7FA] mt-1 block">
              {state.transactions.length} records
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#1B2130]/60 border border-[#263045]">
            <span className="text-[#A5ADBE] block">Active Subscriptions</span>
            <span className="font-mono font-bold text-sm text-[#F5F7FA] mt-1 block">
              {state.subscriptions.filter((s) => s.active).length} services
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#1B2130]/60 border border-[#263045]">
            <span className="text-[#A5ADBE] block">Savings Goals</span>
            <span className="font-mono font-bold text-sm text-[#F5F7FA] mt-1 block">
              {state.goals.length} vaults
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3">
          <span className="text-xs text-[#A5ADBE]">
            Last saved: {new Date(state.lastUpdated).toLocaleTimeString()}
          </span>

          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#FF5C5C] hover:text-white bg-[#FF5C5C]/10 hover:bg-[#FF5C5C] rounded-xl border border-[#FF5C5C]/30 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Demo Data</span>
          </button>
        </div>
      </div>

      {/* Mandatory Demo Disclosure Notice */}
      <div className="p-6 rounded-2xl bg-[#1B2130]/40 border border-[#263045] space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[#F5F7FA]">
          <ShieldCheck className="w-4 h-4 text-[#C8FF4D]" />
          <span>Privacy & Demo Disclosure</span>
        </div>
        <p className="text-xs text-[#A5ADBE] leading-relaxed">
          RupeeFlow is a client-side prototype designed for the hackathon simulation challenge.
          No bank accounts, API keys, credentials, or real money transactions are requested, stored,
          or transmitted. All decisions, forecasts, and calculations run locally and deterministically
          in your web browser.
        </p>
      </div>

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={resetDemoData}
        title="Reset Demo Data"
        message="This will restore the original Day 12 demo dataset with ₹10,000 opening budget. All custom transactions and simulations will be cleared."
        confirmText="Reset Demo"
        isDestructive={true}
      />
    </div>
  )
}
