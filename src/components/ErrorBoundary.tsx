/**
 * Error Boundary Component
 * Catches React errors and displays fallback UI
 */

import { Component, ErrorInfo, ReactNode } from 'react';

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
    console.error('ErrorBoundary caught an error:', error, errorInfo);
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
        <div className="min-h-screen bg-clinical-bg flex items-center justify-center p-4">
          <div className="bg-white border border-clinical-border rounded-lg p-8 max-w-md w-full text-center">
            {/* Icon */}
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
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
            <h2 className="text-xl font-semibold text-clinical-text mb-2">
              Something went wrong
            </h2>

            {/* Description */}
            <p className="text-sm text-clinical-muted mb-6">
              An unexpected error occurred. Please try refreshing the page.
            </p>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-2 px-4 bg-clinical-text text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Refresh Page
              </button>

              <button
                onClick={this.handleReset}
                className="w-full py-2 px-4 bg-gray-100 text-clinical-text rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Try Again
              </button>
            </div>

            {/* Error details (collapsed) */}
            {this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-xs text-clinical-muted cursor-pointer hover:text-clinical-text">
                  Technical details
                </summary>
                <pre className="mt-2 p-3 bg-gray-50 rounded text-xs text-red-600 overflow-auto max-h-32">
                  {this.state.error.message}
                  {'\n\n'}
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
