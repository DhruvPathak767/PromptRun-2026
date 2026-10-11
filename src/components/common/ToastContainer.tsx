import React from 'react'
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react'
import { useFinance, type ToastMessage } from '../../state/useFinance'

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useFinance()

  if (toasts.length === 0) return null

  return (
    <section
      className="fixed bottom-20 md:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      aria-label="Notifications"
    >
      {toasts.map((toast: ToastMessage) => (
        <output
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border backdrop-blur-xl shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${
            toast.type === 'success'
              ? 'bg-[#141822]/95 border-[#C8FF4D]/30 text-[#F5F7FA]'
              : toast.type === 'warning'
              ? 'bg-[#141822]/95 border-[#FFB340]/30 text-[#F5F7FA]'
              : toast.type === 'error'
              ? 'bg-[#141822]/95 border-[#FF5C5C]/30 text-[#F5F7FA]'
              : 'bg-[#141822]/95 border-[#63E5F4]/30 text-[#F5F7FA]'
          }`}
          aria-live="polite"
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#C8FF4D]" />}
            {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-[#FFB340]" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-[#FF5C5C]" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-[#63E5F4]" />}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold text-[#F5F7FA]">{toast.title}</h4>
            <p className="text-xs text-[#A5ADBE] mt-0.5 leading-relaxed">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="shrink-0 text-[#A5ADBE] hover:text-[#F5F7FA] p-1 rounded-lg hover:bg-white/5 transition-colors focus:outline-none focus:ring-1 focus:ring-[#C8FF4D]"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </output>
      ))}
    </section>
  )
}
