import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, ArrowRight, AlertTriangle, TrendingUp, ShieldCheck } from 'lucide-react'
import { useFinance } from '../../state/useFinance'
import { type SimulatedScenario } from '../../finance/financeTypes'

export const InsightsPreview: React.FC = () => {
  const { insights, setActiveSimulation } = useFinance()
  const navigate = useNavigate()

  const topInsights = insights.slice(0, 3)

  const handleAction = (route: string, preset?: Partial<SimulatedScenario>) => {
    if (preset && preset.type) {
      setActiveSimulation({
        id: preset.id || 'sim-insight-active',
        type: preset.type,
        title: preset.title || 'Insight Simulation',
        description: 'Derived from active financial recommendation',
        amount: preset.amount || 500,
        category: preset.category,
        targetGoalId: preset.targetGoalId,
        targetSubscriptionId: preset.targetSubscriptionId,
      })
      navigate('/simulator')
    } else {
      navigate(route)
    }
  }

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[#141822] border border-[#263045] shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[#263045]/60">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C8FF4D]" />
            <h2 className="text-base font-bold font-display text-[#F5F7FA]">
              Contextual Financial Insights
            </h2>
          </div>
          <Link
            to="/insights"
            className="text-xs text-[#C8FF4D] hover:underline flex items-center gap-1 font-medium"
          >
            <span>View All ({insights.length})</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <p className="text-xs text-[#A5ADBE] mt-2">
          Calculated dynamically from your actual spending velocity and commitments.
        </p>

        {topInsights.length === 0 ? (
          <div className="py-8 text-center text-[#A5ADBE] text-xs">
            <ShieldCheck className="w-8 h-8 text-[#C8FF4D] mx-auto mb-2" />
            Finances are perfectly aligned with budget! No risk alerts detected.
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {topInsights.map((insight) => (
              <div
                key={insight.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  insight.severity === 'high'
                    ? 'bg-[#FF5C5C]/10 border-[#FF5C5C]/30'
                    : insight.severity === 'medium'
                    ? 'bg-[#FFB340]/10 border-[#FFB340]/30'
                    : 'bg-[#1B2130]/80 border-[#263045]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-[#F5F7FA] flex items-center gap-1.5">
                    {insight.severity === 'high' && (
                      <AlertTriangle className="w-3.5 h-3.5 text-[#FF5C5C] shrink-0" />
                    )}
                    {insight.severity === 'medium' && (
                      <AlertTriangle className="w-3.5 h-3.5 text-[#FFB340] shrink-0" />
                    )}
                    {insight.severity === 'low' && (
                      <TrendingUp className="w-3.5 h-3.5 text-[#C8FF4D] shrink-0" />
                    )}
                    <span>{insight.title}</span>
                  </h4>
                </div>

                <p className="text-xs text-[#A5ADBE] mt-1 leading-relaxed">
                  {insight.explanation}
                </p>

                {insight.financialImpact && (
                  <p className="text-xs font-mono text-[#63E5F4] mt-1.5 font-medium">
                    Impact: {insight.financialImpact}
                  </p>
                )}

                <div className="mt-2.5 pt-2 border-t border-white/5 flex justify-end">
                  <button
                    onClick={() => handleAction(insight.actionRoute, insight.scenarioPreset)}
                    className="text-xs font-bold text-[#C8FF4D] hover:underline flex items-center gap-1 focus:outline-none"
                  >
                    <span>{insight.actionLabel}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-[#263045]/60 text-right">
        <Link
          to="/simulator"
          className="text-xs font-bold text-[#63E5F4] hover:underline inline-flex items-center gap-1"
        >
          <span>Open What-If Decision Lab →</span>
        </Link>
      </div>
    </div>
  )
}
