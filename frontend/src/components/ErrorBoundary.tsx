import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  /** When this changes (e.g. the route pathname), the boundary resets. */
  resetKey?: string
}

interface ErrorBoundaryState {
  error: Error | null
}

/**
 * Catches render-time errors (e.g. a Plotly/MathJax exception or a bad API
 * response reaching render) so a bug in one playground shows a fallback
 * card instead of unmounting the whole app to a blank page.
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null })
    }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="glass-card p-6 space-y-3 text-center">
          <div className="text-3xl">⚠</div>
          <h2 className="text-lg font-semibold text-white">Something went wrong on this page</h2>
          <p className="text-sm text-slate-400">
            {this.state.error.message || 'An unexpected error occurred while rendering this section.'}
          </p>
          <button
            type="button"
            onClick={() => this.setState({ error: null })}
            className="btn-secondary px-4 py-2 text-sm"
          >
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
