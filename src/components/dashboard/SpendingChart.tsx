import React, { useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { useFinance } from '../../state/useFinance'
import { formatRupees } from '../../finance/financeEngine'
import { TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react'

export const SpendingChart: React.FC = () => {
  const { metrics, state } = useFinance()
  const [viewMode, setViewMode] = useState<'cumulative' | 'daily'>('cumulative')

  const chartData = metrics.dailyTimeline.map((item) => ({
    day: `D${item.day}`,
    dayNum: item.day,
    actualSpend: item.actualSpend,
    projectedSpend: item.projectedSpend,
    cumulativeSpend: item.cumulativeSpend,
    isPastOrToday: item.isPast || item.isToday,
    isToday: item.isToday,
  }))

  const paceStatus = metrics.spendingPace.status

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[#141822] border border-[#263045] shadow-xl">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#263045]/60">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold font-display text-[#F5F7FA]">
              30-Day Spending Trajectory
            </h3>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                paceStatus === 'under_budget'
                  ? 'bg-[#C8FF4D]/15 text-[#C8FF4D]'
                  : paceStatus === 'on_track'
                  ? 'bg-[#63E5F4]/15 text-[#63E5F4]'
                  : 'bg-[#FF5C5C]/15 text-[#FF5C5C]'
              }`}
            >
              {paceStatus === 'under_budget' ? (
                <>
                  <CheckCircle2 className="w-3 h-3" /> Under Target Pace
                </>
              ) : paceStatus === 'on_track' ? (
                <>
                  <CheckCircle2 className="w-3 h-3" /> On Track Pace
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3 h-3" /> Exceeding Pace
                </>
              )}
            </span>
          </div>
          <p className="text-xs text-[#A5ADBE] mt-0.5">
            Solid line shows actual ledger history (Days 1–{state.currentDay}); dashed shows forecast through Day 30.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex rounded-xl bg-[#1B2130] p-1 border border-[#263045] self-start sm:self-auto">
          <button
            onClick={() => setViewMode('cumulative')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              viewMode === 'cumulative'
                ? 'bg-[#141822] text-[#F5F7FA] shadow-sm'
                : 'text-[#A5ADBE] hover:text-[#F5F7FA]'
            }`}
          >
            Cumulative Spend
          </button>
          <button
            onClick={() => setViewMode('daily')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              viewMode === 'daily'
                ? 'bg-[#141822] text-[#F5F7FA] shadow-sm'
                : 'text-[#A5ADBE] hover:text-[#F5F7FA]'
            }`}
          >
            Daily Burn
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-72 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C8FF4D" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#C8FF4D" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="projectedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9875FF" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#9875FF" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="day"
              stroke="#6B778C"
              fontSize={11}
              tickLine={false}
              interval={2}
            />
            <YAxis
              stroke="#6B778C"
              fontSize={11}
              tickLine={false}
              tickFormatter={(val) => `₹${val}`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload
                  return (
                    <div className="p-3 rounded-xl bg-[#0E121B]/95 border border-[#263045] shadow-xl text-xs backdrop-blur-md">
                      <span className="font-bold text-[#F5F7FA] block">
                        Day {data.dayNum} {data.isToday ? '(Today)' : ''}
                      </span>
                      {viewMode === 'cumulative' ? (
                        <div className="mt-1 space-y-1">
                          <div className="text-[#A5ADBE]">
                            Cumulative Spend:{' '}
                            <span className="font-bold font-mono text-[#C8FF4D]">
                              {formatRupees(data.cumulativeSpend)}
                            </span>
                          </div>
                          <div className="text-[11px] text-[#6B778C]">
                            Budget Limit: {formatRupees(metrics.openingBudget)}
                          </div>
                        </div>
                      ) : (
                        <div className="mt-1 space-y-1">
                          {data.isPastOrToday ? (
                            <div className="text-[#A5ADBE]">
                              Actual Spend:{' '}
                              <span className="font-bold font-mono text-[#C8FF4D]">
                                {formatRupees(data.actualSpend)}
                              </span>
                            </div>
                          ) : (
                            <div className="text-[#A5ADBE]">
                              Projected Spend:{' '}
                              <span className="font-bold font-mono text-[#9875FF]">
                                {formatRupees(data.projectedSpend)}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                }
                return null
              }}
            />

            {/* Current Day Reference Line */}
            <ReferenceLine
              x={`D${state.currentDay}`}
              stroke="#63E5F4"
              strokeDasharray="3 3"
              label={{
                value: `Today (D${state.currentDay})`,
                fill: '#63E5F4',
                fontSize: 10,
                position: 'top',
              }}
            />

            {/* Budget Cap Reference Line for Cumulative View */}
            {viewMode === 'cumulative' && (
              <ReferenceLine
                y={metrics.openingBudget}
                stroke="#FF5C5C"
                strokeDasharray="4 4"
                label={{
                  value: '₹10,000 Budget Cap',
                  fill: '#FF5C5C',
                  fontSize: 10,
                  position: 'insideTopRight',
                }}
              />
            )}

            {viewMode === 'cumulative' ? (
              <Area
                type="monotone"
                dataKey="cumulativeSpend"
                stroke="#C8FF4D"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#actualGradient)"
              />
            ) : (
              <>
                <Area
                  type="monotone"
                  dataKey="actualSpend"
                  stroke="#C8FF4D"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#actualGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="projectedSpend"
                  stroke="#9875FF"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#projectedGradient)"
                />
              </>
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Pacing Explanation Footer */}
      <div className="mt-4 pt-3 border-t border-[#263045]/60 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#A5ADBE] gap-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#C8FF4D]" />
          <span>
            Daily variable spend average:{' '}
            <strong className="text-[#F5F7FA] font-mono">
              {formatRupees(metrics.spendingPace.actualDailyAverage)}/day
            </strong>{' '}
            (Target benchmark: {formatRupees(metrics.spendingPace.targetDailyPace)}/day)
          </span>
        </div>
        <span className="font-mono text-[11px] text-[#63E5F4]">
          Day 30 Forecast: {formatRupees(metrics.projectedMonthEndCash)} cushion
        </span>
      </div>
    </div>
  )
}
