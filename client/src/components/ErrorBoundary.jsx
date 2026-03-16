import { Component } from 'react';
import { Button, Result } from 'antd';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught:', error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <Result
            status="error"
            title="Something went wrong"
            subTitle={
              import.meta.env.DEV
                ? this.state.error?.message
                : 'An unexpected error occurred. Please refresh the page.'
            }
            extra={[
              <Button
                key="reload"
                type="primary"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </Button>,
              <Button
                key="home"
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.href = '/';
                }}
              >
                Go Home
              </Button>,
            ]}
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
