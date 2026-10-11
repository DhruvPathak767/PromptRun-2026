import React, { useState } from 'react'
import { Repeat, Lock, Plus } from 'lucide-react'
import { useFinance } from '../state/useFinance'
import { formatRupees } from '../finance/financeEngine'
import { ConfirmDialog } from '../components/common/ConfirmDialog'
import { SubscriptionCardsList } from '../components/finance/SubscriptionCardsList'
import { CommitmentTable } from '../components/finance/CommitmentTable'
import { AddSubscriptionModal, AddCommitmentModal } from '../components/finance/SubscriptionModals'

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

  // Modals state
  const [isSubModalOpen, setIsSubModalOpen] = useState(false)
  const [isCommitModalOpen, setIsCommitModalOpen] = useState(false)

  // Delete targets
  const [deleteSubId, setDeleteSubId] = useState<string | null>(null)
  const [deleteCommitId, setDeleteCommitId] = useState<string | null>(null)

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
        <div className="flex rounded-xl bg-[#1B2130] p-1 border border-[#263045] self-start sm:self-auto" role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === 'subscriptions'}
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
            role="tab"
            aria-selected={activeTab === 'commitments'}
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
        <SubscriptionCardsList
          subscriptions={state.subscriptions}
          currentDay={state.currentDay}
          onToggle={toggleSubscription}
          onDelete={(id) => setDeleteSubId(id)}
        />
      )}

      {/* Content for Commitments */}
      {activeTab === 'commitments' && (
        <CommitmentTable
          commitments={state.commitments}
          currentDay={state.currentDay}
          onMarkPaid={markCommitmentPaid}
          onDelete={(id) => setDeleteCommitId(id)}
        />
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
      <AddSubscriptionModal
        isOpen={isSubModalOpen}
        onClose={() => setIsSubModalOpen(false)}
        onSubmit={(sub) => addSubscription({ ...sub, active: true })}
      />

      {/* Create Commitment Modal */}
      <AddCommitmentModal
        isOpen={isCommitModalOpen}
        currentDay={state.currentDay}
        onClose={() => setIsCommitModalOpen(false)}
        onSubmit={(commit) => addCommitment({ ...commit, isPaid: false })}
      />
    </div>
  )
}
