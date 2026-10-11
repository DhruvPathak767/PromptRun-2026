import React, { useState, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { MobileNavigation } from './MobileNavigation'
import { PageHeader } from './PageHeader'
import { ToastContainer } from '../common/ToastContainer'
import { TransactionFormModal } from '../finance/TransactionFormModal'
import { Modal } from '../common/Modal'
import { FlaskConical, PlusCircle, Zap, Sparkles } from 'lucide-react'
import { getRouteMetadata } from '../../routes/routeMeta'
import { ImpulseBusterModal } from '../innovation/ImpulseBusterModal'
import { MoneyVibeCardModal } from '../innovation/MoneyVibeCardModal'

export const AppShell: React.FC = () => {
  const [isAddTxOpen, setIsAddTxOpen] = useState(false)
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false)
  const [isImpulseOpen, setIsImpulseOpen] = useState(false)
  const [isVibeOpen, setIsVibeOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const meta = getRouteMetadata(location.pathname)

  // Accessible route changes: update document title and shift focus
  useEffect(() => {
    document.title = meta.documentTitle

    const mainElement = document.getElementById('main-content')
    if (mainElement) {
      mainElement.focus({ preventScroll: true })
    }
  }, [location.pathname, meta.documentTitle])

  return (
    <div className="min-h-screen bg-[#0B0D12] text-[#F5F7FA] flex flex-col lg:flex-row font-sans">
      {/* Route Change Announcement for Screen Readers */}
      <div aria-live="polite" className="sr-only">
        Navigated to {meta.title}
      </div>

      {/* WCAG 2.2 AA Skip Link for Keyboard Navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-[#C8FF4D] focus:text-[#0B0D12] focus:font-extrabold focus:text-xs focus:rounded-xl focus:shadow-2xl focus:outline-none focus:ring-4 focus:ring-[#C8FF4D]/40"
      >
        Skip to main content
      </a>

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
        <PageHeader
          title={meta.title}
          subtitle={meta.subtitle}
          onOpenAddExpense={() => setIsAddTxOpen(true)}
          onOpenImpulseBuster={() => setIsImpulseOpen(true)}
          onOpenVibeCard={() => setIsVibeOpen(true)}
        />

        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full focus:outline-none"
        >
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

      {/* Impulse Buster Reality Checker Modal */}
      <ImpulseBusterModal
        isOpen={isImpulseOpen}
        onClose={() => setIsImpulseOpen(false)}
      />

      {/* Money Vibe Card Modal */}
      <MoneyVibeCardModal
        isOpen={isVibeOpen}
        onClose={() => setIsVibeOpen(false)}
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

          <button
            onClick={() => {
              setIsQuickActionOpen(false)
              setIsImpulseOpen(true)
            }}
            className="flex flex-col items-center gap-2.5 p-4 rounded-xl bg-[#1B2130] hover:bg-[#263045] border border-[#263045] text-center transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FFB340]/20 text-[#FFB340] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#F5F7FA] block">Impulse Buster</span>
              <span className="text-[10px] text-[#A5ADBE]">Reality check</span>
            </div>
          </button>

          <button
            onClick={() => {
              setIsQuickActionOpen(false)
              setIsVibeOpen(true)
            }}
            className="flex flex-col items-center gap-2.5 p-4 rounded-xl bg-[#1B2130] hover:bg-[#263045] border border-[#263045] text-center transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#9875FF]/20 text-[#9875FF] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#F5F7FA] block">My Vibe</span>
              <span className="text-[10px] text-[#A5ADBE]">Share card</span>
            </div>
          </button>
        </div>
      </Modal>
    </div>
  )
}
