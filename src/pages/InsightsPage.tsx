import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Sparkles,
  Activity,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'
import { useFinance } from '../state/useFinance'
import { type SimulatedScenario } from '../finance/financeTypes'

export const InsightsPage: React.FC = () => {
  const { metrics, insights, setActiveSimulation } = useFinance()
  const navigate = useNavigate()

  const handleLaunchScenario = (preset?: Partial<SimulatedScenario>, route = '/simulator') => {
    if (preset && preset.type) {
      setActiveSimulation({
        id: preset.id || 'sim-launch-active',
        type: preset.type,
        title: preset.title || 'Recommended Decision',
        description: 'Auto-configured from Financial Insight engine',
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
    <div className="space-y-6">
      {/* Financial Health Score Hero Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#141822] border border-[#263045] shadow-xl relative overflow-hidden">
        {/* Ambient Glow */}
        <div
          className="absolute -top-12 -right-12 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{ backgroundColor: metrics.healthColor }}
        />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#C8FF4D]" />
              <h2 className="text-xl font-bold font-display text-[#F5F7FA]">
                Financial Health & Resilience Engine
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#A5ADBE] mt-1 max-w-xl">
              A transparent, deterministic 0–100 health index based on your discretionary cushion,
              pacing velocity, upcoming commitment obligations, and savings targets.
            </p>
            <span className="inline-block mt-2 text-[11px] text-[#6B778C]">
              Notice: This is a scenario-based simulator indicator, not a credit rating or formal financial advice.
            </span>
          </div>

          {/* Big Score Gauge Badge */}
          <div className="flex items-center gap-4 bg-[#1B2130]/80 p-4 rounded-2xl border border-[#263045] self-start lg:self-auto shrink-0">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center font-black font-mono text-2xl shadow-lg"
              style={{
                backgroundColor: `${metrics.healthColor}20`,
                color: metrics.healthColor,
                border: `2px solid ${metrics.healthColor}50`,
              }}
            >
              {metrics.healthScore}
            </div>

            <div>
              <span
                className="text-xs font-bold font-mono uppercase tracking-wider block"
                style={{ color: metrics.healthColor }}
              >
                {metrics.healthBand}
              </span>
              <span className="text-[11px] text-[#A5ADBE] block mt-0.5">
                {metrics.healthScore >= 80
                  ? 'Strong cash cushion & safe burn pace'
                  : metrics.healthScore >= 55
                  ? 'Moderate liquidity; mindful pacing advised'
                  : 'High risk of cash shortfall or deficit'}
              </span>
            </div>
          </div>
        </div>

        {/* 4 Contributing Deterministic Factors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#263045]/60">
          {metrics.healthFactors.map((factor) => (
            <div
              key={factor.name}
              className="p-3.5 rounded-xl bg-[#1B2130]/60 border border-[#263045] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-[#F5F7FA]">
                  <span>{factor.name}</span>
                  <span className="font-mono text-[11px] text-[#A5ADBE]">
                    {factor.score}/{factor.maxScore} pts
                  </span>
                </div>

                <div className="w-full h-1.5 rounded-full bg-[#141822] mt-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      factor.status === 'good'
                        ? 'bg-[#C8FF4D]'
                        : factor.status === 'warning'
                        ? 'bg-[#FFB340]'
                        : 'bg-[#FF5C5C]'
                    }`}
                    style={{ width: `${(factor.score / factor.maxScore) * 100}%` }}
                  />
                </div>

                <p className="text-[11px] text-[#A5ADBE] mt-2 leading-relaxed">
                  {factor.explanation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Rule-Based Insights Section */}
      <div className="p-6 rounded-2xl bg-[#141822] border border-[#263045] shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-[#263045]/60">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C8FF4D]" />
            <h3 className="text-base font-bold font-display text-[#F5F7FA]">
              Actionable Recommendations & Risk Alerts ({insights.length})
            </h3>
          </div>
          <span className="text-xs text-[#A5ADBE]">
            Derived directly from active calculations
          </span>
        </div>

        {insights.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#A5ADBE]">
            <CheckCircle2 className="w-8 h-8 text-[#C8FF4D] mx-auto mb-2" />
            No active risks detected. Your 30-day budget is performing optimally!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                  insight.severity === 'high'
                    ? 'bg-[#FF5C5C]/10 border-[#FF5C5C]/35'
                    : insight.severity === 'medium'
                    ? 'bg-[#FFB340]/10 border-[#FFB340]/35'
                    : 'bg-[#1B2130]/70 border-[#263045]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-[#F5F7FA] flex items-center gap-2">
                      {insight.severity === 'high' && (
                        <AlertTriangle className="w-4 h-4 text-[#FF5C5C] shrink-0" />
                      )}
                      {insight.severity === 'medium' && (
                        <AlertTriangle className="w-4 h-4 text-[#FFB340] shrink-0" />
                      )}
                      {insight.severity === 'low' && (
                        <TrendingUp className="w-4 h-4 text-[#C8FF4D] shrink-0" />
                      )}
                      <span>{insight.title}</span>
                    </h4>
                    <span
                      className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        insight.severity === 'high'
                          ? 'bg-[#FF5C5C] text-white'
                          : insight.severity === 'medium'
                          ? 'bg-[#FFB340] text-[#0B0D12]'
                          : 'bg-[#C8FF4D]/20 text-[#C8FF4D]'
                      }`}
                    >
                      {insight.severity}
                    </span>
                  </div>

                  <p className="text-xs text-[#A5ADBE] mt-2 leading-relaxed">
                    {insight.explanation}
                  </p>

                  {insight.financialImpact && (
                    <div className="mt-3 p-2 rounded-lg bg-[#141822]/80 border border-white/5 text-[11px] font-mono text-[#63E5F4]">
                      Financial Impact: {insight.financialImpact}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-end">
                  <button
                    onClick={() =>
                      handleLaunchScenario(insight.scenarioPreset, insight.actionRoute)
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#C8FF4D] text-[#0B0D12] hover:bg-[#B5F530] transition-colors"
                  >
                    <span>{insight.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
