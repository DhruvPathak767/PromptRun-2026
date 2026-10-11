import React, { useState } from 'react'
import {
  Repeat,
  Lock,
  Plus,
  Trash2,
  Calendar,
} from 'lucide-react'
import { useFinance } from '../state/useFinance'
import { formatRupees } from '../finance/financeEngine'
import {
  EXPENSE_CATEGORIES,
  type ExpenseCategory,
} from '../finance/financeTypes'
import { Modal } from '../components/common/Modal'
import { ConfirmDialog } from '../components/common/ConfirmDialog'

export const SubscriptionsPage: React.FC = () => {
  const {
    state,
    metrics,
    addSubscription,
    toggleSubscription,
    deleteSubscription,
    addCommitment,
    markCommitmentPaid,
    deleteCommitment,
  } = useFinance()

  const [activeTab, setActiveTab] = useState<'subscriptions' | 'commitments'>('subscriptions')

  // Subscription modal state
  const [isSubModalOpen, setIsSubModalOpen] = useState(false)
  const [subName, setSubName] = useState('')
  const [subPrice, setSubPrice] = useState('199')
  const [subDay, setSubDay] = useState(15)
  const [subCategory, setSubCategory] = useState<ExpenseCategory>('Tech & Subscriptions')
  const [subTier, setSubTier] = useState('Monthly Plan')

  // Commitment modal state
  const [isCommitModalOpen, setIsCommitModalOpen] = useState(false)
  const [commitName, setCommitName] = useState('')
  const [commitAmount, setCommitAmount] = useState('500')
  const [commitDueDay, setCommitDueDay] = useState(state.currentDay + 5)
  const [commitCategory, setCommitCategory] = useState<ExpenseCategory>('Tech & Subscriptions')

  // Delete targets
  const [deleteSubId, setDeleteSubId] = useState<string | null>(null)
  const [deleteCommitId, setDeleteCommitId] = useState<string | null>(null)

  const handleCreateSub = (e: React.FormEvent) => {
    e.preventDefault()
    const price = parseFloat(subPrice)
    if (!subName.trim() || isNaN(price) || price <= 0) return

    addSubscription({
      name: subName.trim(),
      price,
      billingDay: Math.min(30, Math.max(1, subDay)),
      category: subCategory,
      active: true,
      tier: subTier.trim() || undefined,
    })

    setSubName('')
    setSubPrice('199')
    setIsSubModalOpen(false)
  }

  const handleCreateCommitment = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(commitAmount)
    if (!commitName.trim() || isNaN(amount) || amount <= 0) return

    addCommitment({
      name: commitName.trim(),
      amount,
      dueDay: Math.min(30, Math.max(1, commitDueDay)),
      category: commitCategory,
      isPaid: false,
    })

    setCommitName('')
    setCommitAmount('500')
    setIsCommitModalOpen(false)
  }

  // Active subscriptions total cost
  const activeSubs = state.subscriptions.filter((s) => s.active)
  const totalMonthlySubCost = activeSubs.reduce((sum, s) => sum + s.price, 0)

  return (
    <div className="space-y-6">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#141822] border border-[#263045]">
          <span className="text-xs text-[#A5ADBE] font-medium">Active Subscriptions</span>
          <span className="text-2xl font-black font-mono text-[#F5F7FA] block mt-1">
            {activeSubs.length} services
          </span>
          <p className="text-[11px] text-[#A5ADBE] mt-1">
            Total monthly drain: {formatRupees(totalMonthlySubCost)}/mo
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#141822] border border-[#263045]">
          <span className="text-xs text-[#A5ADBE] font-medium">Pending Unpaid Obligations</span>
          <span className="text-2xl font-black font-mono text-[#9875FF] block mt-1">
            {metrics.upcomingCommitmentsCount} due
          </span>
          <p className="text-[11px] text-[#A5ADBE] mt-1">
            Reserved cash: {formatRupees(metrics.upcomingCommitmentsTotal)}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#141822] border border-[#263045]">
          <span className="text-xs text-[#A5ADBE] font-medium">Discretionary Buffer Impact</span>
          <span className="text-2xl font-black font-mono text-[#63E5F4] block mt-1">
            ~{formatRupees(Math.round(totalMonthlySubCost / metrics.inclusiveDaysRemaining))}/d
          </span>
          <p className="text-[11px] text-[#A5ADBE] mt-1">
            Daily allowance cost absorbed by recurring services.
          </p>
        </div>
      </div>

      {/* Tabs & Action Row */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#141822] border border-[#263045] shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex rounded-xl bg-[#1B2130] p-1 border border-[#263045] self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'subscriptions'
                ? 'bg-[#141822] text-[#F5F7FA] shadow-sm'
                : 'text-[#A5ADBE] hover:text-[#F5F7FA]'
            }`}
          >
            <Repeat className="w-3.5 h-3.5 text-[#C8FF4D]" />
            <span>Subscriptions ({state.subscriptions.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('commitments')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'commitments'
                ? 'bg-[#141822] text-[#F5F7FA] shadow-sm'
                : 'text-[#A5ADBE] hover:text-[#F5F7FA]'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-[#9875FF]" />
            <span>Scheduled Bills ({state.commitments.length})</span>
          </button>
        </div>

        <button
          onClick={() =>
            activeTab === 'subscriptions' ? setIsSubModalOpen(true) : setIsCommitModalOpen(true)
          }
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#C8FF4D] hover:bg-[#B5F530] text-[#0B0D12] transition-all shadow-md shadow-[#C8FF4D]/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{activeTab === 'subscriptions' ? 'Add Subscription' : 'Add Bill Obligation'}</span>
        </button>
      </div>

      {/* Content for Subscriptions */}
      {activeTab === 'subscriptions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.subscriptions.map((sub) => {
            const willChargeThisCycle = sub.active && sub.billingDay >= state.currentDay

            return (
              <div
                key={sub.id}
                className={`p-5 sm:p-6 rounded-2xl border shadow-xl flex flex-col justify-between transition-all ${
                  sub.active
                    ? 'bg-[#141822] border-[#263045] hover:border-[#3B4A6B]'
                    : 'bg-[#141822]/50 border-[#263045]/40 opacity-70'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold font-display text-[#F5F7FA]">
                        {sub.name}
                      </h3>
                      <span className="text-[11px] text-[#A5ADBE] block mt-0.5">
                        {sub.tier || 'Monthly Subscription'} • {sub.category}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        sub.active
                          ? 'bg-[#C8FF4D]/15 text-[#C8FF4D]'
                          : 'bg-[#FF5C5C]/15 text-[#FF5C5C]'
                      }`}
                    >
                      {sub.active ? 'ACTIVE' : 'CANCELLED'}
                    </span>
                  </div>

                  {/* Price & Billing Day */}
                  <div className="mt-4 flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-black font-mono text-[#F5F7FA]">
                        {formatRupees(sub.price)}
                      </span>
                      <span className="text-xs text-[#A5ADBE] font-mono"> / month</span>
                    </div>
                    <span className="text-xs text-[#A5ADBE] flex items-center gap-1 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-[#C8FF4D]" /> Day {sub.billingDay}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#A5ADBE] mt-3">
                    {willChargeThisCycle
                      ? `Scheduled to charge on Day ${sub.billingDay} (reserves ₹${sub.price} from cash).`
                      : sub.active
                      ? `Already billed earlier this cycle on Day ${sub.billingDay}.`
                      : 'Subscription is paused/cancelled. No future charges scheduled.'}
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-5 pt-3 border-t border-[#263045]/60 flex items-center justify-between">
                  <button
                    onClick={() => toggleSubscription(sub.id)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                      sub.active
                        ? 'border-[#FF5C5C]/30 text-[#FF5C5C] hover:bg-[#FF5C5C]/10'
                        : 'border-[#C8FF4D]/30 text-[#C8FF4D] hover:bg-[#C8FF4D]/10'
                    }`}
                  >
                    {sub.active ? 'Cancel Future Charges' : 'Reactivate Service'}
                  </button>

                  <button
                    onClick={() => setDeleteSubId(sub.id)}
                    className="p-1.5 rounded-lg text-[#A5ADBE] hover:text-[#FF5C5C] hover:bg-[#FF5C5C]/10 transition-colors"
                    title="Delete subscription"
                    aria-label={`Delete ${sub.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Content for Commitments */}
      {activeTab === 'commitments' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-[#141822] border border-[#263045] shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left" role="table">
              <thead>
                <tr className="border-b border-[#263045] text-[#A5ADBE]">
                  <th className="py-2.5 pr-2 font-medium">Obligation Name</th>
                  <th className="py-2.5 px-2 font-medium">Due Day</th>
                  <th className="py-2.5 px-2 font-medium">Category</th>
                  <th className="py-2.5 px-2 font-medium">Amount</th>
                  <th className="py-2.5 px-2 font-medium">Status</th>
                  <th className="py-2.5 pl-2 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#263045]/50">
                {state.commitments.map((c) => {
                  const daysAway = c.dueDay - state.currentDay
                  return (
                    <tr key={c.id} className="hover:bg-[#1B2130]/30 transition-colors">
                      <td className="py-3 pr-2 font-semibold text-[#F5F7FA]">{c.name}</td>
                      <td className="py-3 px-2 font-mono text-[#A5ADBE]">
                        Day {c.dueDay}{' '}
                        {!c.isPaid && (
                          <span
                            className={`text-[10px] ml-1 ${
                              daysAway <= 3 ? 'text-[#FF5C5C] font-bold' : 'text-[#6B778C]'
                            }`}
                          >
                            ({daysAway === 0 ? 'Today' : daysAway > 0 ? `in ${daysAway}d` : 'Past due'})
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-2 text-[#A5ADBE]">{c.category}</td>
                      <td className="py-3 px-2 font-mono font-bold text-[#F5F7FA]">
                        {formatRupees(c.amount)}
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            c.isPaid
                              ? 'bg-[#34D399]/15 text-[#34D399]'
                              : 'bg-[#FFB340]/15 text-[#FFB340]'
                          }`}
                        >
                          {c.isPaid ? 'PAID' : 'PENDING'}
                        </span>
                      </td>
                      <td className="py-3 pl-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!c.isPaid && (
                            <button
                              onClick={() => markCommitmentPaid(c.id)}
                              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#C8FF4D]/15 text-[#C8FF4D] hover:bg-[#C8FF4D] hover:text-[#0B0D12] transition-colors"
                            >
                              Pay Now
                            </button>
                          )}
                          <button
                            onClick={() => setDeleteCommitId(c.id)}
                            className="p-1 rounded-lg text-[#A5ADBE] hover:text-[#FF5C5C] transition-colors"
                            aria-label={`Delete ${c.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Subscription Confirm */}
      <ConfirmDialog
        isOpen={deleteSubId !== null}
        onClose={() => setDeleteSubId(null)}
        onConfirm={() => {
          if (deleteSubId) {
            deleteSubscription(deleteSubId)
            setDeleteSubId(null)
          }
        }}
        title="Delete Subscription"
        message="Are you sure you want to remove this subscription from tracking?"
        confirmText="Delete"
        isDestructive={true}
      />

      {/* Delete Commitment Confirm */}
      <ConfirmDialog
        isOpen={deleteCommitId !== null}
        onClose={() => setDeleteCommitId(null)}
        onConfirm={() => {
          if (deleteCommitId) {
            deleteCommitment(deleteCommitId)
            setDeleteCommitId(null)
          }
        }}
        title="Delete Obligation"
        message="Are you sure you want to delete this scheduled bill obligation?"
        confirmText="Delete"
        isDestructive={true}
      />

      {/* Create Subscription Modal */}
      <Modal
        isOpen={isSubModalOpen}
        onClose={() => setIsSubModalOpen(false)}
        title="Add Recurring Subscription"
        description="Track monthly services that charge your budget on a recurring day."
      >
        <form onSubmit={handleCreateSub} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#A5ADBE] mb-1">
              Service Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Netflix Mobile, Disney+ Hotstar, GitHub Copilot"
              value={subName}
              onChange={(e) => setSubName(e.target.value)}
              className="w-full px-3 py-2 bg-[#1B2130] border border-[#263045] rounded-xl text-xs text-[#F5F7FA] focus:outline-none focus:border-[#C8FF4D]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#A5ADBE] mb-1">
                Monthly Price (₹)
              </label>
              <input
                type="number"
                min="1"
                required
                value={subPrice}
                onChange={(e) => setSubPrice(e.target.value)}
                className="w-full px-3 py-2 bg-[#1B2130] border border-[#263045] rounded-xl text-xs font-mono text-[#F5F7FA] focus:outline-none focus:border-[#C8FF4D]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#A5ADBE] mb-1">
                Billing Cycle Day (1-30)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                required
                value={subDay}
                onChange={(e) => setSubDay(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#1B2130] border border-[#263045] rounded-xl text-xs font-mono text-[#F5F7FA] focus:outline-none focus:border-[#C8FF4D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A5ADBE] mb-1">Category</label>
            <select
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value as ExpenseCategory)}
              className="w-full px-3 py-2 bg-[#1B2130] border border-[#263045] rounded-xl text-xs text-[#F5F7FA] focus:outline-none focus:border-[#C8FF4D]"
            >
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A5ADBE] mb-1">
              Plan Tier / Notes
            </label>
            <input
              type="text"
              placeholder="e.g. Student Discount, Standard HD"
              value={subTier}
              onChange={(e) => setSubTier(e.target.value)}
              className="w-full px-3 py-2 bg-[#1B2130] border border-[#263045] rounded-xl text-xs text-[#F5F7FA] focus:outline-none focus:border-[#C8FF4D]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#263045]">
            <button
              type="button"
              onClick={() => setIsSubModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-[#A5ADBE] bg-[#1B2130] rounded-xl hover:bg-[#263045]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold bg-[#C8FF4D] text-[#0B0D12] rounded-xl hover:bg-[#B5F530]"
            >
              Save Subscription
            </button>
          </div>
        </form>
      </Modal>

      {/* Create Commitment Modal */}
      <Modal
        isOpen={isCommitModalOpen}
        onClose={() => setIsCommitModalOpen(false)}
        title="Add Scheduled Bill Obligation"
        description="Schedule a known bill that must be paid during this cycle."
      >
        <form onSubmit={handleCreateCommitment} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#A5ADBE] mb-1">
              Obligation Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Wi-Fi Share, Electric Bill, Laundry Service"
              value={commitName}
              onChange={(e) => setCommitName(e.target.value)}
              className="w-full px-3 py-2 bg-[#1B2130] border border-[#263045] rounded-xl text-xs text-[#F5F7FA] focus:outline-none focus:border-[#C8FF4D]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#A5ADBE] mb-1">Amount (₹)</label>
              <input
                type="number"
                min="1"
                required
                value={commitAmount}
                onChange={(e) => setCommitAmount(e.target.value)}
                className="w-full px-3 py-2 bg-[#1B2130] border border-[#263045] rounded-xl text-xs font-mono text-[#F5F7FA] focus:outline-none focus:border-[#C8FF4D]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#A5ADBE] mb-1">
                Due Cycle Day (1-30)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                required
                value={commitDueDay}
                onChange={(e) => setCommitDueDay(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#1B2130] border border-[#263045] rounded-xl text-xs font-mono text-[#F5F7FA] focus:outline-none focus:border-[#C8FF4D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A5ADBE] mb-1">Category</label>
            <select
              value={commitCategory}
              onChange={(e) => setCommitCategory(e.target.value as ExpenseCategory)}
              className="w-full px-3 py-2 bg-[#1B2130] border border-[#263045] rounded-xl text-xs text-[#F5F7FA] focus:outline-none focus:border-[#C8FF4D]"
            >
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#263045]">
            <button
              type="button"
              onClick={() => setIsCommitModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-[#A5ADBE] bg-[#1B2130] rounded-xl hover:bg-[#263045]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold bg-[#C8FF4D] text-[#0B0D12] rounded-xl hover:bg-[#B5F530]"
            >
              Save Obligation
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
