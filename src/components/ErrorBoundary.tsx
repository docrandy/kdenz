/**
 * Error Boundary Component
 * Catches React errors and displays fallback UI
 */

import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="bg-background-surface border border-background-elevated rounded-lg p-8 max-w-md w-full text-center">
            {/* Icon */}
            <div className="w-16 h-16 bg-status-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-status-error"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            {/* Title */}
            <h2 className="text-xl font-semibold text-text mb-2">
              Something went wrong
            </h2>

            {/* Description */}
            <p className="text-sm text-text-muted mb-6">
              An unexpected error occurred. Please try refreshing the page.
            </p>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-2 px-4 bg-accent text-text-inverse rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Refresh Page
              </button>

              <button
                onClick={this.handleReset}
                className="w-full py-2 px-4 bg-background-elevated text-text rounded-lg font-medium hover:bg-background-subtle transition-colors"
              >
                Try Again
              </button>
            </div>

            {/* Error details (collapsed) */}
            {this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-xs text-text-muted cursor-pointer hover:text-text">
                  Technical details
                </summary>
                <pre className="mt-2 p-3 bg-background-elevated rounded text-xs text-status-error overflow-auto max-h-32">
                  {this.state.error.message}
                  {"\n\n"}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
