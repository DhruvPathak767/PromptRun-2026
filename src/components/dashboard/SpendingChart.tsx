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
import { AlertTriangle, CheckCircle2, Table as TableIcon, LineChart as ChartIcon } from 'lucide-react'

export const SpendingChart: React.FC = () => {
  const { metrics, state } = useFinance()
  const [viewMode, setViewMode] = useState<'cumulative' | 'daily'>('cumulative')
  const [showTable, setShowTable] = useState(false)

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

  const chartAriaLabel = `30-Day spending trajectory chart. Cumulative spend is currently ${formatRupees(
    metrics.totalExpenses
  )} on Day ${state.currentDay} of 30 relative to the ₹10,000 budget cap. Pace status: ${
    paceStatus.replace('_', ' ')
  }.`

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

        {/* View Toggle & Accessible Table Switch */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <div className="flex rounded-xl bg-[#1B2130] p-1 border border-[#263045]">
            <button
              onClick={() => setViewMode('cumulative')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                viewMode === 'cumulative'
                  ? 'bg-[#141822] text-[#F5F7FA] shadow-sm'
                  : 'text-[#A5ADBE] hover:text-[#F5F7FA]'
              }`}
              aria-pressed={viewMode === 'cumulative'}
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
              aria-pressed={viewMode === 'daily'}
            >
              Daily Burn
            </button>
          </div>

          <button
            onClick={() => setShowTable(!showTable)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-[#A5ADBE] hover:text-[#F5F7FA] bg-[#1B2130] border border-[#263045] hover:bg-[#263045] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C8FF4D]"
            aria-label={showTable ? 'Switch to interactive chart view' : 'Switch to accessible data table view'}
          >
            {showTable ? (
              <>
                <ChartIcon className="w-3.5 h-3.5 text-[#C8FF4D]" />
                <span>Chart View</span>
              </>
            ) : (
              <>
                <TableIcon className="w-3.5 h-3.5 text-[#63E5F4]" />
                <span>View as Table</span>
              </>
            )}
          </button>
        </div>
      </div>

      {showTable ? (
        /* Accessible HTML Table Alternative */
        <div className="mt-4 max-h-72 overflow-y-auto rounded-xl border border-[#263045] bg-[#1B2130]/40">
          <table className="w-full text-left text-xs text-[#A5ADBE]">
            <caption className="sr-only">
              30-Day Spending Trajectory Ledger and Forecast Table
            </caption>
            <thead className="bg-[#141822] text-[11px] uppercase font-bold text-[#F5F7FA] sticky top-0 border-b border-[#263045]">
              <tr>
                <th scope="col" className="px-4 py-2.5">Cycle Day</th>
                <th scope="col" className="px-4 py-2.5">Actual Spend</th>
                <th scope="col" className="px-4 py-2.5">Projected Burn</th>
                <th scope="col" className="px-4 py-2.5">Cumulative Total</th>
                <th scope="col" className="px-4 py-2.5">Phase</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#263045]/60 font-mono">
              {metrics.dailyTimeline.map((item) => (
                <tr
                  key={item.day}
                  className={`hover:bg-[#1B2130]/80 transition-colors ${
                    item.isToday ? 'bg-[#C8FF4D]/10 font-bold text-[#C8FF4D]' : ''
                  }`}
                >
                  <td className="px-4 py-2">
                    Day {item.day} {item.isToday ? '(Today)' : ''}
                  </td>
                  <td className="px-4 py-2 text-[#F5F7FA]">
                    {item.actualSpend > 0 ? formatRupees(item.actualSpend) : '—'}
                  </td>
                  <td className="px-4 py-2 text-[#9875FF]">
                    {item.projectedSpend > 0 ? formatRupees(item.projectedSpend) : '—'}
                  </td>
                  <td className="px-4 py-2 text-[#C8FF4D]">
                    {formatRupees(item.cumulativeSpend)}
                  </td>
                  <td className="px-4 py-2 font-sans text-[11px]">
                    {item.isToday ? 'Active Day' : item.isPast ? 'Elapsed' : 'Forecast'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Chart Canvas */
        <div
          className="h-64 sm:h-72 w-full mt-4"
          role="img"
          aria-label={chartAriaLabel}
        >
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
                                Projected Burn:{' '}
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

              {viewMode === 'cumulative' ? (
                <>
                  <ReferenceLine
                    y={10000}
                    stroke="#FF5C5C"
                    strokeDasharray="4 4"
                    label={{
                      value: '₹10k Budget Cap',
                      fill: '#FF5C5C',
                      fontSize: 10,
                      position: 'top',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="cumulativeSpend"
                    stroke="#C8FF4D"
                    strokeWidth={2.5}
                    fill="url(#actualGradient)"
                  />
                </>
              ) : (
                <>
                  <Area
                    type="monotone"
                    dataKey="actualSpend"
                    stroke="#C8FF4D"
                    strokeWidth={2}
                    fill="url(#actualGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="projectedSpend"
                    stroke="#9875FF"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                    fill="url(#projectedGradient)"
                  />
                </>
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Chart Footer Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 mt-2 border-t border-[#263045]/60 text-xs">
        <div>
          <span className="text-[#A5ADBE] text-[11px] block">Current Spend (Actual)</span>
          <span className="font-bold font-mono text-[#F5F7FA]">
            {formatRupees(metrics.totalExpenses)}
          </span>
        </div>
        <div>
          <span className="text-[#A5ADBE] text-[11px] block">Burn Pace / Elapsed Day</span>
          <span className="font-bold font-mono text-[#F5F7FA]">
            {formatRupees(metrics.spendingPace.actualDailyAverage)}/d
          </span>
        </div>
        <div>
          <span className="text-[#A5ADBE] text-[11px] block">Target Max Pace</span>
          <span className="font-bold font-mono text-[#C8FF4D]">
            {formatRupees(metrics.spendingPace.targetDailyPace)}/d
          </span>
        </div>
        <div>
          <span className="text-[#A5ADBE] text-[11px] block">Day 30 Estimated Cash</span>
          <span
            className={`font-bold font-mono ${
              metrics.projectedMonthEndCash >= 0 ? 'text-[#34D399]' : 'text-[#FF5C5C]'
            }`}
          >
            {formatRupees(metrics.projectedMonthEndCash)}
          </span>
        </div>
      </div>
    </div>
  )
}
