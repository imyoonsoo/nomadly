import { ReactNode } from "react";

export interface FallbackProps {
  error: Error;
  reset: () => void;
}

export interface ErrorBoundaryProps {
  fallback: ReactNode | ((props: FallbackProps) => ReactNode);
  children: ReactNode;
}

export interface ErrorBoundaryClassProps extends ErrorBoundaryProps {
  onReset: () => void;
}

export interface ErrorBoundaryState {
  error: Error | null;
}
