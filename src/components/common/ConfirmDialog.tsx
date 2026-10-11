import React from 'react'
import { AlertTriangle } from 'lucide-react'
import { Modal } from './Modal'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isDestructive?: boolean
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = true,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <div className="space-y-4 pt-2">
        <div className="flex items-start gap-3 p-3 rounded-xl bg-[#1B2130]/60 border border-[#263045]">
          <AlertTriangle
            className={`w-5 h-5 shrink-0 mt-0.5 ${
              isDestructive ? 'text-[#FF5C5C]' : 'text-[#FFB340]'
            }`}
          />
          <p className="text-xs text-[#A5ADBE] leading-relaxed">{message}</p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#A5ADBE] hover:text-[#F5F7FA] bg-[#1B2130] hover:bg-[#263045] rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-[#C8FF4D]"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all focus:outline-none focus:ring-2 ${
              isDestructive
                ? 'bg-[#FF5C5C] hover:bg-[#FF4040] text-white focus:ring-[#FF5C5C]'
                : 'bg-[#C8FF4D] hover:bg-[#B5F530] text-[#0B0D12] focus:ring-[#C8FF4D]'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  )
}
