import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface ErrorBoundaryProps {
  children: ReactNode
  title?: string
  message?: string
  resetKey?: string
  reloadOnRetry?: boolean
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidUpdate(previousProps: ErrorBoundaryProps) {
    if (this.state.hasError && previousProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false, error: undefined })
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Unhandled render error', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
    if (this.props.reloadOnRetry) {
      window.location.reload()
    }
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children
    }

    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#080d1a] px-4 py-10">
        <div className="w-full max-w-2xl rounded-3xl border border-slate-700 bg-[#0B1224]/90 p-8 shadow-2xl shadow-slate-950/30">
          <h1 className="text-3xl font-semibold text-white mb-4">
            {this.props.title ?? 'Something went wrong.'}
          </h1>
          <p className="text-sm text-slate-400 mb-6">
            {this.props.message ?? 'We hit an unexpected error while loading this area. You can try again or return home.'}
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={this.handleRetry}
              className="w-full sm:w-auto rounded-3xl bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]"
            >
              Try again
            </button>
            <Link
              to="/"
              className="w-full sm:w-auto rounded-3xl border border-slate-700 bg-[#080d1a] px-6 py-3 text-center text-sm font-semibold text-slate-100 transition hover:bg-slate-800"
            >
              Return home
            </Link>
          </div>
          {this.state.error && (
            <div className="mt-6 rounded-3xl bg-[#080d1a] p-4 text-sm text-slate-300">
              <strong className="block mb-2">Error details:</strong>
              <pre className="whitespace-pre-wrap break-words">{this.state.error.message}</pre>
            </div>
          )}
        </div>
      </div>
    )
  }
}
