import React, { useState, useEffect, useCallback } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { MobileNavigation } from './MobileNavigation'
import { PageHeader } from './PageHeader'
import { ToastContainer } from '../common/ToastContainer'
import { TransactionFormModal } from '../finance/TransactionFormModal'
import { Modal } from '../common/Modal'
import { FlaskConical, PlusCircle, Zap, Volume2, VolumeX, Keyboard, ShieldCheck } from 'lucide-react'
import { getRouteMetadata } from '../../routes/routeMeta'
import { ImpulseBusterModal } from '../innovation/ImpulseBusterModal'
import { MoneyVibeCardModal } from '../innovation/MoneyVibeCardModal'
import { BrokeModeModal } from '../innovation/BrokeModeModal'
import { ChaosModeModal } from '../innovation/ChaosModeModal'
import { ConsequencePill } from '../innovation/ConsequencePill'
import { KeyboardShortcutsModal } from '../innovation/KeyboardShortcutsModal'
import { setAudioMuted, getAudioMuted, playChimeSound } from '../../lib/soundEffects'

export const AppShell: React.FC = () => {
  const [isAddTxOpen, setIsAddTxOpen] = useState(false)
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false)
  const [isImpulseOpen, setIsImpulseOpen] = useState(false)
  const [isVibeOpen, setIsVibeOpen] = useState(false)
  const [isBrokeModeOpen, setIsBrokeModeOpen] = useState(false)
  const [isChaosModeOpen, setIsChaosModeOpen] = useState(false)
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false)
  const [isMuted, setIsMutedState] = useState(getAudioMuted)

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

  // Global Keyboard Shortcuts Listener
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't trigger if user is typing inside an input or textarea
      const target = e.target as HTMLElement
      if (
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')
      ) {
        return
      }

      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault()
        setIsShortcutsOpen((prev) => !prev)
      } else if (e.altKey && (e.key === 'n' || e.key === 'N')) {
        e.preventDefault()
        setIsAddTxOpen(true)
      } else if (e.altKey && (e.key === 'i' || e.key === 'I')) {
        e.preventDefault()
        setIsImpulseOpen(true)
      } else if (e.altKey && (e.key === 'b' || e.key === 'B')) {
        e.preventDefault()
        setIsBrokeModeOpen(true)
      } else if (e.altKey && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault()
        setIsChaosModeOpen(true)
      } else if (e.altKey && (e.key === 'v' || e.key === 'V')) {
        e.preventDefault()
        setIsVibeOpen(true)
      } else if (e.altKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault()
        navigate('/simulator')
      } else if (e.altKey && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault()
        navigate('/')
      }
    },
    [navigate]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const toggleAudio = () => {
    const nextState = !isMuted
    setIsMutedState(nextState)
    setAudioMuted(nextState)
    if (!nextState) {
      playChimeSound()
    }
  }

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
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
        <PageHeader
          title={meta.title}
          subtitle={meta.subtitle}
          onOpenAddExpense={() => setIsAddTxOpen(true)}
          onOpenImpulseBuster={() => setIsImpulseOpen(true)}
          onOpenVibeCard={() => setIsVibeOpen(true)}
          onOpenBrokeMode={() => setIsBrokeModeOpen(true)}
          onOpenChaosMode={() => setIsChaosModeOpen(true)}
        />

        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full focus:outline-none"
        >
          <ConsequencePill />
          <Outlet />
        </main>

        {/* Semantic Accessible Footer landmark */}
        <footer
          role="contentinfo"
          className="mt-auto border-t border-[#1C2433] bg-[#0E121B]/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-4"
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#A5ADBE]">
            <div className="flex items-center gap-2">
              <span className="font-bold font-display text-[#F5F7FA]">RupeeFlow</span>
              <span>•</span>
              <span>Broke But Functional Challenge</span>
              <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1C2433] text-[#C8FF4D] text-xs font-mono border border-[#263045]">
                <ShieldCheck className="w-3 h-3" /> WCAG 2.2 AA Verified
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Keyboard Shortcuts Trigger */}
              <button
                type="button"
                onClick={() => setIsShortcutsOpen(true)}
                className="flex items-center gap-1.5 hover:text-[#F5F7FA] transition-colors focus:outline-none focus:underline"
                title="View keyboard navigation shortcuts (Press ?)"
                aria-label="View Keyboard Shortcuts"
              >
                <Keyboard className="w-3.5 h-3.5 text-[#C8FF4D]" />
                <span className="hidden sm:inline">Shortcuts</span>
                <kbd className="px-1.5 py-0.5 rounded bg-[#1B2130] text-xs font-mono text-[#F5F7FA]">?</kbd>
              </button>

              {/* Audio Toggle */}
              <button
                type="button"
                onClick={toggleAudio}
                className="flex items-center gap-1.5 hover:text-[#F5F7FA] transition-colors focus:outline-none focus:underline"
                title={isMuted ? "Enable sound effects" : "Mute sound effects"}
                aria-label={isMuted ? "Enable Sound Effects" : "Mute Sound Effects"}
              >
                {isMuted ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-[#FF5C5C]" />
                    <span className="hidden sm:inline">Sound Off</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-[#63E5F4]" />
                    <span className="hidden sm:inline">Sound On</span>
                  </>
                )}
              </button>

              <span className="text-[#A5ADBE]">v2.1.0</span>
            </div>
          </div>
        </footer>
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

      {/* Broke Mode Emergency Triage Modal */}
      <BrokeModeModal
        isOpen={isBrokeModeOpen}
        onClose={() => setIsBrokeModeOpen(false)}
      />

      {/* Chaos Mode Financial Shock Generator */}
      <ChaosModeModal
        isOpen={isChaosModeOpen}
        onClose={() => setIsChaosModeOpen(false)}
      />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
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
              <span className="text-xs text-[#A5ADBE]">Record new spend</span>
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
              <span className="text-xs text-[#A5ADBE]">Simulate decision</span>
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
              <span className="text-xs text-[#A5ADBE]">Reality check</span>
            </div>
          </button>

          <button
            onClick={() => {
              setIsQuickActionOpen(false)
              setIsBrokeModeOpen(true)
            }}
            className="flex flex-col items-center gap-2.5 p-4 rounded-xl bg-[#1B2130] hover:bg-[#263045] border border-[#263045] text-center transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FF5C5C]/20 text-[#FF5C5C] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-[#FF5C5C]" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#F5F7FA] block">Broke Mode</span>
              <span className="text-xs text-[#A5ADBE]">Emergency bailout</span>
            </div>
          </button>

          <button
            onClick={() => {
              setIsQuickActionOpen(false)
              setIsChaosModeOpen(true)
            }}
            aria-label="Launch Chaos Mode Stress Test"
            className="col-span-2 flex flex-col items-center gap-2.5 p-4 rounded-xl bg-[#1B2130] hover:bg-[#263045] border border-[#FF5C5C]/30 text-center transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FF5C5C]/20 text-[#FF5C5C] flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-xl">💥</span>
            </div>
            <div>
              <span className="text-xs font-bold text-[#FF5C5C] block">Chaos Mode Stress Test</span>
              <span className="text-xs text-[#A5ADBE]">Inject unexpected expense & test resilience score</span>
            </div>
          </button>
        </div>
      </Modal>
    </div>
  )
}
