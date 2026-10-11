import React from 'react'
import { Modal } from '../common/Modal'

interface KeyboardShortcutsModalProps {
  isOpen: boolean
  onClose: () => void
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const shortcuts = [
    { key: 'Alt + N', desc: 'Open Add Expense Modal' },
    { key: 'Alt + I', desc: 'Open Impulse Buy Reality Checker' },
    { key: 'Alt + B', desc: 'Open Broke Mode Emergency Triage' },
    { key: 'Alt + V', desc: 'Open 30-Day Money Vibe Card' },
    { key: 'Alt + S', desc: 'Jump to What-If Decision Lab' },
    { key: 'Alt + D', desc: 'Jump to Main Dashboard' },
    { key: '?', desc: 'Toggle Keyboard Shortcuts Guide' },
    { key: 'Esc', desc: 'Close any active modal or dialog' },
  ]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="⌨️ Keyboard Navigation Shortcuts"
      description="Power-user keyboard bindings for fast, accessible personal finance management."
      maxWidth="md"
    >
      <div className="space-y-4">
        <div className="divide-y divide-[#263045]/60 rounded-xl bg-[#141822] border border-[#263045] overflow-hidden">
          {shortcuts.map((s, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 text-xs">
              <span className="text-[#A5ADBE]">{s.desc}</span>
              <kbd className="px-2.5 py-1 rounded-lg bg-[#1B2130] border border-[#263045] text-[#C8FF4D] font-mono font-bold shadow-sm">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="text-center text-xs text-[#A5ADBE]">
          Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-[#1B2130] font-mono text-[#F5F7FA]">?</kbd> anytime to toggle this modal.
        </div>
      </div>
    </Modal>
  )
}
