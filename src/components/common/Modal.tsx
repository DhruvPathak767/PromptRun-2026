import React, { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
}) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      previousFocus.current = document.activeElement as HTMLElement
      document.body.style.overflow = 'hidden'

      // Focus first focusable element inside the modal container after mount
      const focusableSelector =
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(focusableSelector)

      if (focusableElements && focusableElements.length > 0) {
        focusableElements[0].focus()
      } else {
        modalRef.current?.focus()
      }
    } else {
      document.body.style.overflow = 'unset'
      previousFocus.current?.focus()
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Focus trap & Escape key listener
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      if (e.key === 'Tab') {
        const focusableSelector =
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        const focusable = modalRef.current?.querySelectorAll<HTMLElement>(focusableSelector)

        if (!focusable || focusable.length === 0) {
          e.preventDefault()
          return
        }

        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === first || document.activeElement === modalRef.current) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const maxWidthClass =
    maxWidth === 'sm'
      ? 'max-w-sm'
      : maxWidth === 'lg'
      ? 'max-w-2xl'
      : maxWidth === 'xl'
      ? 'max-w-3xl'
      : 'max-w-md'

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`w-full ${maxWidthClass} bg-[#141822] border border-[#263045] rounded-t-2xl sm:rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col focus:outline-none animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#263045]/60">
          <div>
            <h2 id="modal-title" className="text-lg font-bold text-[#F5F7FA] font-display">
              {title}
            </h2>
            {description && (
              <p className="text-xs text-[#A5ADBE] mt-0.5">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-[#A5ADBE] hover:text-[#F5F7FA] p-1.5 rounded-lg hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#C8FF4D]"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto py-4 flex-1 pr-1 -mr-1">
          {children}
        </div>
      </div>
    </div>
  )
}
