import { Component, ErrorInfo, ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
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

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled error caught by ErrorBoundary:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
    window.location.reload()
  }

  handleHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#0B1224] dark:bg-[#060A16] px-4 py-10">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B1224] p-8 shadow-2xl shadow-slate-900/10">
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-white mb-4">Something went wrong.</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              We hit an unexpected error while loading the page. You can try again or return home to keep browsing.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={this.handleRetry}
                className="w-full sm:w-auto rounded-3xl bg-[#327CFA] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#327CFA]"
              >
                Retry
              </button>
              <button
                type="button"
                onClick={this.handleHome}
                className="w-full sm:w-auto rounded-3xl border border-slate-300 bg-[#0B1224] text-sm font-semibold text-slate-900 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-[#0B1224] dark:text-slate-100 dark:hover:bg-slate-700"
              >
                Return Home
              </button>
            </div>
            {this.state.error && (
              <div className="mt-6 rounded-3xl bg-slate-100 dark:bg-[#0B1224] p-4 text-sm text-slate-600 dark:text-slate-300">
                <strong className="block mb-2">Error details:</strong>
                <pre className="whitespace-pre-wrap break-words">{this.state.error.message}</pre>
              </div>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
