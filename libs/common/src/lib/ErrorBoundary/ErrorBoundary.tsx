import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button, Result } from 'antd';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error to monitoring service in production
    if (import.meta.env.PROD) {
      // Example: Sentry, LogRocket, etc.
      // Sentry.captureException(error, { contexts: { errorInfo } });
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
          <div className="w-full max-w-md">
            <Result
              icon={<AlertTriangle className="text-red-500" size={64} />}
              title="Oops! Có lỗi xảy ra"
              subTitle="Ứng dụng gặp lỗi không mong muốn. Vui lòng thử lại hoặc liên hệ hỗ trợ."
              extra={[
                <Button
                  key="retry"
                  type="primary"
                  icon={<RefreshCw size={16} className="cursor-pointer" />}
                  onClick={this.handleRetry}
                >
                  Thử lại
                </Button>,
                <Button
                  key="home"
                  icon={<Home size={16} className="cursor-pointer" />}
                  onClick={this.handleGoHome}
                >
                  Về trang chủ
                </Button>,
              ]}
            />

            {/* Error details for development */}
            {this.props.showDetails && this.state.error && (
              <details className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
                <summary className="mb-2 cursor-pointer font-medium text-red-800">
                  Chi tiết lỗi (Development)
                </summary>
                <div className="text-sm">
                  <div className="mb-2">
                    <strong>Error:</strong>
                    <pre className="mt-1 overflow-auto rounded bg-red-100 p-2 text-xs">
                      {this.state.error.toString()}
                    </pre>
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="mt-1 overflow-auto rounded bg-red-100 p-2 text-xs">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC for wrapping components with error boundary
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>,
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
};

// Hook for error reporting
export const useErrorHandler = () => {
  const reportError = React.useCallback(
    (error: Error, errorInfo?: ErrorInfo) => {
      console.error('Manual error report:', error, errorInfo);

      // Report to monitoring service
      if (import.meta.env.PROD) {
        // Example: Sentry.captureException(error, { contexts: { errorInfo } });
      }
    },
    [],
  );

  return { reportError };
};
