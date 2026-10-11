import React, { useState } from 'react'
import {
  FlaskConical,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react'
import { useFinance } from '../state/useFinance'
import { simulateScenario } from '../finance/scenarioEngine'
import {
  type ExpenseCategory,
  type SimulatedScenarioType,
  type SimulatedScenario,
} from '../finance/financeTypes'
import { PresetScenarios } from '../components/simulator/PresetScenarios'
import { ScenarioBuilder } from '../components/simulator/ScenarioBuilder'
import { ScenarioComparisonMatrix } from '../components/simulator/ScenarioComparisonMatrix'

export const SimulatorPage: React.FC = () => {
  const {
    state,
    setActiveSimulation,
    clearActiveSimulation,
    applyActiveSimulation,
  } = useFinance()

  // Scenario builder state
  const [selectedType, setSelectedType] = useState<SimulatedScenarioType>(
    state.activeSimulation?.type || 'purchase'
  )
  const [title, setTitle] = useState(
    state.activeSimulation?.title || 'Buy Sneakers'
  )
  const [amount, setAmount] = useState<string>(
    state.activeSimulation?.amount?.toString() || '2499'
  )
  const [category, setCategory] = useState<ExpenseCategory>(
    state.activeSimulation?.category || 'Shopping & Apparel'
  )
  const [targetGoalId, setTargetGoalId] = useState<string>(
    state.activeSimulation?.targetGoalId || (state.goals[0]?.id ?? '')
  )
  const [targetSubscriptionId, setTargetSubscriptionId] = useState<string>(
    state.activeSimulation?.targetSubscriptionId || (state.subscriptions[0]?.id ?? '')
  )

  // Construct current working scenario in real-time
  const parsedAmount = Math.max(0, parseFloat(amount) || 0)

  const currentScenario: SimulatedScenario = {
    id: state.activeSimulation?.id || 'active-sim',
    type: selectedType,
    title: title.trim() || 'Custom Scenario',
    description: `Simulating ${selectedType.replace('_', ' ')} of ₹${parsedAmount}`,
    amount: parsedAmount,
    category,
    targetGoalId,
    targetSubscriptionId,
  }

  // Pure hypothetical comparison computed on the fly
  const comparison = simulateScenario(state, currentScenario)

  const handleSelectPreset = (preset: SimulatedScenario) => {
    setSelectedType(preset.type)
    setTitle(preset.title)
    setAmount(preset.amount.toString())
    if (preset.category) setCategory(preset.category)
    if (preset.targetGoalId) setTargetGoalId(preset.targetGoalId)
    if (preset.targetSubscriptionId) setTargetSubscriptionId(preset.targetSubscriptionId)
    setActiveSimulation(preset)
  }

  const handleApply = () => {
    setActiveSimulation(currentScenario)
    applyActiveSimulation()
  }

  const handleReset = () => {
    clearActiveSimulation()
    setTitle('Buy Sneakers')
    setAmount('2499')
    setSelectedType('purchase')
  }

  return (
    <div className="space-y-6">
      {/* Simulator Lab Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#141822] via-[#1B2130] to-[#141822] border border-[#263045] shadow-xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#63E5F4]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-[#63E5F4]" />
              <h2 className="text-xl font-bold font-display text-[#F5F7FA]">
                What-If Decision Lab
              </h2>
              <span className="text-xs font-bold uppercase px-2 py-0.5 rounded-full bg-[#63E5F4]/15 text-[#63E5F4] border border-[#63E5F4]/30">
                Non-Destructive Sandbox
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#A5ADBE] mt-1 max-w-2xl">
              Simulate purchases, new subscriptions, emergency expenses, savings deposits, or freelance income. Test the consequences across your entire 30-day budget before committing real rupees.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#A5ADBE] hover:text-[#F5F7FA] bg-[#141822] border border-[#263045] hover:bg-[#1B2130] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Sandbox</span>
            </button>
            <button
              onClick={handleApply}
              disabled={parsedAmount <= 0 && selectedType !== 'cancel_subscription'}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#C8FF4D] hover:bg-[#B5F530] text-[#0B0D12] shadow-lg shadow-[#C8FF4D]/20 transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Apply Decision</span>
            </button>
          </div>
        </div>
      </div>

      {/* Preset Quick Simulations Carousel */}
      <PresetScenarios onSelectPreset={handleSelectPreset} />

      {/* Two-Column Editor & Comparison Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <ScenarioBuilder
          state={state}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          title={title}
          setTitle={setTitle}
          amount={amount}
          setAmount={setAmount}
          category={category}
          setCategory={setCategory}
          targetGoalId={targetGoalId}
          setTargetGoalId={setTargetGoalId}
          targetSubscriptionId={targetSubscriptionId}
          setTargetSubscriptionId={setTargetSubscriptionId}
          parsedAmount={parsedAmount}
        />

        <ScenarioComparisonMatrix
          comparison={comparison}
          selectedType={selectedType}
          parsedAmount={parsedAmount}
          onApply={handleApply}
          onReset={handleReset}
        />
      </div>
    </div>
  )
}
