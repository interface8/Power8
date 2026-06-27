import { ReactNode } from "react";

export type StateType =
  | "loading"
  | "empty"
  | "error"
  | "notFound"
  | "offline"
  | "unauthorized"
  | "serverError"
  | "noResults";

export type SkeletonVariant =
  | "table"
  | "cards"
  | "stats"
  | "list";

export interface StateHandlerProps {
  state?: StateType;

  title?: string;
  message?: string;
  error?: string;

  action?: ReactNode;

  onRetry?: () => void;

  children?: ReactNode;

  skeletonVariant?: SkeletonVariant;
}