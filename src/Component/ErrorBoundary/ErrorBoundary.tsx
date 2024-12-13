import { Alert } from 'antd';

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ hasError: true, error });
    console.log(errorInfo);
  }

  render() {
    const { error, hasError } = this.state;

    if (hasError) {
      return (
        <>
          <Alert message={error?.message} type="error" />
        </>
      );
    }

    return this.props.children;
  }
}
