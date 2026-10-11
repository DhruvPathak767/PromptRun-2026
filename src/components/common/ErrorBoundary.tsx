import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(_error: Error, _errorInfo: ErrorInfo) {
    // Isolated error recording without exposing secrets
    if (import.meta.env?.DEV) {
      // In development only
    }
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('rupeeflow_state_v1')
      window.location.href = '/'
    } catch {
      window.location.reload()
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B0D12] text-[#F5F7FA] flex items-center justify-center p-6">
          <div className="max-w-md w-full p-6 rounded-2xl bg-[#141822] border border-[#263045] shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FF5C5C]/15 text-[#FF5C5C] flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-[#F5F7FA]">
                Application Experience Encountered an Issue
              </h2>
              <p className="text-xs text-[#A5ADBE] mt-1 leading-relaxed">
                RupeeFlow protected your stored session. You can reload safely or restore pristine demo data.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 py-2 px-3 rounded-xl bg-[#1B2130] hover:bg-[#263045] text-xs font-semibold text-[#F5F7FA] border border-[#263045] transition-colors"
              >
                Reload Page
              </button>
              <button
                onClick={this.handleReset}
                className="flex-1 py-2 px-3 rounded-xl bg-[#C8FF4D] hover:bg-[#B5F530] text-xs font-bold text-[#0B0D12] shadow-md shadow-[#C8FF4D]/20 transition-all flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset to Clean Demo</span>
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
