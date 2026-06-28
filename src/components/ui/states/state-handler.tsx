"use client";

import {
  Loader2,
  AlertTriangle,
  FolderOpen,
  SearchX,
  WifiOff,
  ShieldAlert,
  FileQuestion,
  ServerCrash,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { StateCard } from "./state-card";
import { SkeletonState } from "./skeleton-state";
import { StateHandlerProps } from "./types";

const CONFIG = {
  loading: {
    title: "Loading data",
    message: "Fetching the latest information...",
    icon: Loader2,
    className: "text-orange-500 animate-spin",
  },

  empty: {
    title: "Nothing here yet",
    message: "Records will appear here when available.",
    icon: FolderOpen,
    className: "text-slate-400",
  },

  noResults: {
    title: "No matching results",
    message: "Try adjusting your search or filters.",
    icon: SearchX,
    className: "text-slate-400",
  },

  error: {
    title: "Unable to load data",
    message: "Something unexpected happened.",
    icon: AlertTriangle,
    className: "text-red-500",
  },

  notFound: {
    title: "Page not found",
    message: "The requested resource does not exist.",
    icon: FileQuestion,
    className: "text-slate-400",
  },

  unauthorized: {
    title: "Access restricted",
    message: "You don't have permission to view this page.",
    icon: ShieldAlert,
    className: "text-red-500",
  },

  offline: {
    title: "No internet connection",
    message: "Check your connection and try again.",
    icon: WifiOff,
    className: "text-slate-400",
  },

  serverError: {
    title: "Server unavailable",
    message: "Please try again later.",
    icon: ServerCrash,
    className: "text-red-500",
  },
} as const;

export function StateHandler({
  state,
  title,
  message,
  error,
  action,
  onRetry,
  children,
  skeletonVariant,
}: StateHandlerProps) {
  if (!state) return <>{children}</>;

  if (state === "loading") {
    return (
      <SkeletonState
        variant={skeletonVariant}
      />
    );
  }

  const config = CONFIG[state];

  const Icon = config.icon;

  const retryButton =
    onRetry && (
      <Button
        onClick={onRetry}
        className="bg-orange-500 hover:bg-orange-600"
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Retry
      </Button>
    );

  return (
    <StateCard
      icon={
        <Icon
          className={`h-8 w-8 ${config.className}`}
        />
      }
      title={title ?? config.title}
      description={
        error ||
        message ||
        config.message
      }
      action={action ?? retryButton}
    />
  );
}