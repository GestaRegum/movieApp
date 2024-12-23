import { Alert } from 'antd';
import React from 'react';
import { Props, State } from './type';

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
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
          <Alert message={error?.message} type={'error'} />
        </>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };
