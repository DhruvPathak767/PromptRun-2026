import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { MobileNavigation } from './MobileNavigation'
import { PageHeader } from './PageHeader'
import { ToastContainer } from '../common/ToastContainer'
import { TransactionFormModal } from '../finance/TransactionFormModal'
import { Modal } from '../common/Modal'
import { FlaskConical, PlusCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const AppShell: React.FC = () => {
  const [isAddTxOpen, setIsAddTxOpen] = useState(false)
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Dynamic page title based on path
  const getHeaderInfo = () => {
    switch (location.pathname) {
      case '/':
        return {
          title: 'RupeeFlow Command Center',
          subtitle: 'Your ₹10,000 30-day financial command center in motion.',
        }
      case '/transactions':
        return {
          title: 'Transaction Ledger',
          subtitle: 'Search, filter, and review all 30-day expenses and cash inflows.',
        }
      case '/budget':
        return {
          title: '30-Day Budget Planner',
          subtitle: 'Daily burn timeline, fixed vs variable obligations, and daily allowance pacing.',
        }
      case '/goals':
        return {
          title: 'Savings Goals',
          subtitle: 'Build financial cushions and milestones without shrinking real savings.',
        }
      case '/subscriptions':
        return {
          title: 'Subscriptions & Commitments',
          subtitle: 'Manage monthly recurring services and upcoming cycle obligations.',
        }
      case '/simulator':
        return {
          title: 'What-If Lab',
          subtitle: 'Simulate financial decisions safely before committing them to your real budget.',
        }
      case '/insights':
        return {
          title: 'Financial Health & Insights',
          subtitle: 'Explainable health scoring, spending risk alerts, and actionable recommendations.',
        }
      case '/settings':
        return {
          title: 'Settings & Demo Controls',
          subtitle: 'Simulation day adjuster, local persistence info, and demo data reset.',
        }
      default:
        return {
          title: 'RupeeFlow',
          subtitle: 'Make every rupee count.',
        }
    }
  }

  const { title, subtitle } = getHeaderInfo()

  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#F5F7FA] flex flex-col lg:flex-row font-sans">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
        <PageHeader
          title={title}
          subtitle={subtitle}
          onOpenAddExpense={() => setIsAddTxOpen(true)}
        />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNavigation onOpenQuickAction={() => setIsQuickActionOpen(true)} />

      {/* Toasts */}
      <ToastContainer />

      {/* Add Transaction Modal */}
      <TransactionFormModal
        isOpen={isAddTxOpen}
        onClose={() => setIsAddTxOpen(false)}
      />

      {/* Mobile Quick Action Modal */}
      <Modal
        isOpen={isQuickActionOpen}
        onClose={() => setIsQuickActionOpen(false)}
        title="Quick Action"
        description="Choose an action for your 30-day budget."
        maxWidth="sm"
      >
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => {
              setIsQuickActionOpen(false)
              setIsAddTxOpen(true)
            }}
            className="flex flex-col items-center gap-2.5 p-4 rounded-xl bg-[#1B2130] hover:bg-[#263045] border border-[#263045] text-center transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#C8FF4D]/20 text-[#C8FF4D] flex items-center justify-center group-hover:scale-110 transition-transform">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#F5F7FA] block">Add Expense</span>
              <span className="text-[10px] text-[#A5ADBE]">Record new spend</span>
            </div>
          </button>

          <button
            onClick={() => {
              setIsQuickActionOpen(false)
              navigate('/simulator')
            }}
            className="flex flex-col items-center gap-2.5 p-4 rounded-xl bg-[#1B2130] hover:bg-[#263045] border border-[#263045] text-center transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#63E5F4]/20 text-[#63E5F4] flex items-center justify-center group-hover:scale-110 transition-transform">
              <FlaskConical className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#F5F7FA] block">What-If Lab</span>
              <span className="text-[10px] text-[#A5ADBE]">Simulate decision</span>
            </div>
          </button>
        </div>
      </Modal>
    </div>
  )
}
