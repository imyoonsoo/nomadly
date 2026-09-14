"use client";

import { Component } from "react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import type {
  ErrorBoundaryClassProps,
  ErrorBoundaryProps,
  ErrorBoundaryState,
} from "./type";

class ErrorBoundaryClass extends Component<
  ErrorBoundaryClassProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  reset = () => {
    this.props.onReset();
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;
    const { fallback, children } = this.props;

    if (error) {
      return typeof fallback === "function"
        ? fallback({ error, reset: this.reset })
        : fallback;
    }

    return children;
  }
}

// reset해도 캐시에 남은 에러가 그대로 다시 던져지니 QueryErrorResetBoundary로 에러 상태도 같이 리셋
export const ErrorBoundary = ({ fallback, children }: ErrorBoundaryProps) => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundaryClass fallback={fallback} onReset={reset}>
          {children}
        </ErrorBoundaryClass>
      )}
    </QueryErrorResetBoundary>
  );
};
