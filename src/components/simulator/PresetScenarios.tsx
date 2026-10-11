import React from 'react'
import { PRESET_SCENARIOS } from '../../finance/scenarioEngine'
import { type SimulatedScenario } from '../../finance/financeTypes'

interface PresetScenariosProps {
  onSelectPreset: (preset: SimulatedScenario) => void
}

export const PresetScenarios: React.FC<PresetScenariosProps> = ({ onSelectPreset }) => {
  return (
    <div>
      <span className="text-xs font-mono uppercase tracking-wider text-[#A5ADBE] font-bold block mb-2.5">
        Quick Preset Scenarios
      </span>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {PRESET_SCENARIOS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onSelectPreset(preset)}
            className="p-3 rounded-xl bg-[#141822] border border-[#263045] hover:border-[#63E5F4] hover:bg-[#1B2130] text-left transition-all group"
          >
            <span className="text-xs font-bold text-[#F5F7FA] block group-hover:text-[#63E5F4] transition-colors line-clamp-1">
              {preset.title}
            </span>
            <span className="text-xs font-mono text-[#A5ADBE] block mt-1">
              ₹{preset.amount} • {preset.type.replace('_', ' ')}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
