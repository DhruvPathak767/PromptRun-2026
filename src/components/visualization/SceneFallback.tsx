import React from 'react'
import { Sparkles, ShieldCheck } from 'lucide-react'

interface SceneFallbackProps {
  cashBalance: number
  safeDailyAllowance: number
}

export const SceneFallback: React.FC<SceneFallbackProps> = ({
  cashBalance,
  safeDailyAllowance,
}) => {
  return (
    <div className="relative w-full h-[320px] sm:h-[380px] rounded-2xl overflow-hidden bg-gradient-to-br from-[#141822] via-[#0E121B] to-[#141822] border border-[#263045] flex items-center justify-center p-6 select-none shadow-2xl">
      {/* Ambient gradient glow */}
      <div className="absolute w-72 h-72 rounded-full bg-[#C8FF4D]/10 blur-3xl pointer-events-none -top-10 -left-10" />
      <div className="absolute w-72 h-72 rounded-full bg-[#9875FF]/15 blur-3xl pointer-events-none -bottom-10 -right-10" />

      {/* Orbit Rings (CSS representation) */}
      <div className="absolute w-64 h-64 rounded-full border border-dashed border-[#C8FF4D]/30 animate-[spin_60s_linear_infinite]" />
      <div className="absolute w-80 h-80 rounded-full border border-[#63E5F4]/20 animate-[spin_40s_linear_infinite_reverse]" />
      <div className="absolute w-96 h-96 rounded-full border border-[#9875FF]/20 animate-[spin_80s_linear_infinite]" />

      {/* Centerpiece 2.5D Rupee Coin */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="relative group">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-[#9875FF] via-[#63E5F4] to-[#C8FF4D] p-1 shadow-[0_0_50px_rgba(200,255,77,0.3)] animate-pulse">
            <div className="w-full h-full rounded-full bg-[#0B0D12] flex items-center justify-center border-2 border-[#C8FF4D]/60 relative overflow-hidden">
              {/* Metallic Sheen */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
              <span className="text-5xl sm:text-6xl font-black font-display text-transparent bg-clip-text bg-gradient-to-b from-white via-[#C8FF4D] to-[#9875FF]">
                ₹
              </span>
            </div>
          </div>

          {/* Floating Pill Badges */}
          <div className="absolute -top-3 -right-6 px-3 py-1 rounded-full bg-[#141822]/90 border border-[#C8FF4D]/40 backdrop-blur-md shadow-lg flex items-center gap-1.5 text-xs font-mono font-bold text-[#C8FF4D]">
            <Sparkles className="w-3 h-3" />
            <span>₹{Math.round(cashBalance).toLocaleString('en-IN')} Liquid</span>
          </div>

          <div className="absolute -bottom-3 -left-6 px-3 py-1 rounded-full bg-[#141822]/90 border border-[#63E5F4]/40 backdrop-blur-md shadow-lg flex items-center gap-1.5 text-xs font-mono font-bold text-[#63E5F4]">
            <ShieldCheck className="w-3 h-3" />
            <span>₹{Math.round(safeDailyAllowance)}/day Safe</span>
          </div>
        </div>

        <p className="mt-6 text-xs text-[#A5ADBE] font-medium tracking-wide uppercase">
          RupeeFlow 30-Day Budget Cycle Engine
        </p>
      </div>
    </div>
  )
}
