"use client";

import { ReactNode } from "react";
import { 
  Loader2, 
  SearchX, 
  AlertTriangle, 
  WifiOff,
  RefreshCw,
  FolderOpen,
  FileQuestion,
  ShieldAlert,
  ServerCrash
} from "lucide-react";

// Types
export type StateType = 
  | "loading" 
  | "empty" 
  | "notFound" 
  | "error" 
  | "noResults" 
  | "unauthorized" 
  | "offline" 
  | "serverError"
  | "custom";

export interface StateHandlerProps {
  type?: StateType;
  isLoading?: boolean;
  isEmpty?: boolean;
  isNotFound?: boolean;
  isError?: boolean;
  isNoResults?: boolean;
  isUnauthorized?: boolean;
  isOffline?: boolean;
  isServerError?: boolean;
  data?: unknown[];
  dataLength?: number;
  loading?: boolean;
  error?: string | null;
  
  // Custom messages and icons
  title?: string;
  message?: string;
  icon?: ReactNode;
  action?: ReactNode;
  
  // Custom renderers
  children?: ReactNode;
  fallback?: ReactNode;
  loadingComponent?: ReactNode;
  emptyComponent?: ReactNode;
  errorComponent?: ReactNode;
  
  // Skeleton options
  skeleton?: boolean;
  skeletonRows?: number;
  skeletonColumns?: number;
  
  // Callbacks
  onRetry?: () => void;
}

// Default configurations
const defaultConfig = {
  loading: {
    title: "Loading...",
    message: "Please wait while we load your content.",
  },
  empty: {
    title: "No items found",
    message: "There are no items to display at the moment.",
  },
  notFound: {
    title: "Page not found",
    message: "The resource you're looking for doesn't exist.",
  },
  error: {
    title: "Something went wrong",
    message: "An unexpected error occurred. Please try again.",
  },
  noResults: {
    title: "No results found",
    message: "Try adjusting your search or filter criteria.",
  },
  unauthorized: {
    title: "Access Denied",
    message: "You don't have permission to view this content.",
  },
  offline: {
    title: "You're offline",
    message: "Please check your internet connection and try again.",
  },
  serverError: {
    title: "Server Error",
    message: "Our servers are having issues. Please try again later.",
  },
};

// Table Skeleton Component
export function TableSkeleton({ rows = 5, columns = 6 }: { rows?: number; columns?: number }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="px-4 py-3">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="animate-pulse">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="px-4 py-4">
                  <div className="h-4 w-full bg-gray-200 rounded" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>  {/* ✅ This closing tag was missing */}
    </div>
  );
}
// Card Skeleton Component
export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-gray-200 bg-white p-5 animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 bg-gray-200 rounded-lg" />
            <div className="flex-1">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-3 w-16 bg-gray-200 rounded mt-1" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 w-full bg-gray-200 rounded" />
            <div className="h-3 w-3/4 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Stats Card Skeleton
export function StatsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-gray-200 bg-white p-5 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 w-20 bg-gray-200 rounded" />
              <div className="h-8 w-16 bg-gray-200 rounded" />
            </div>
            <div className="h-10 w-10 bg-gray-200 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

// List Skeleton Component
export function ListSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="h-10 w-10 bg-gray-200 rounded-full" />
          <div className="flex-1">
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-3 w-24 bg-gray-200 rounded mt-1" />
          </div>
          <div className="h-8 w-16 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );
}

// Icon mapping helper
function getIconComponent(state: StateType | null): ReactNode {
  switch (state) {
    case "loading":
      return <Loader2 className="h-12 w-12 text-orange-500 animate-spin" />;
    case "empty":
      return <FolderOpen className="h-12 w-12 text-gray-400" />;
    case "notFound":
      return <FileQuestion className="h-12 w-12 text-gray-400" />;
    case "noResults":
      return <SearchX className="h-12 w-12 text-gray-400" />;
    case "unauthorized":
      return <ShieldAlert className="h-12 w-12 text-red-400" />;
    case "offline":
      return <WifiOff className="h-12 w-12 text-gray-400" />;
    case "serverError":
      return <ServerCrash className="h-12 w-12 text-red-400" />;
    default:
      return <AlertTriangle className="h-12 w-12 text-yellow-500" />;
  }
}

// Main StateHandler Component
export function StateHandler({
  isLoading,
  isEmpty,
  isNotFound,
  isError,
  isNoResults,
  isUnauthorized,
  isOffline,
  isServerError,
  data,
  dataLength,
  loading,
  error,
  title,
  message,
  icon,
  action,
  children,
  fallback,
  loadingComponent,
  emptyComponent,
  errorComponent,
  skeleton = false,
  skeletonRows = 5,
  skeletonColumns = 4,
  onRetry,
}: Omit<StateHandlerProps, 'type'>) {  // ✅ Removed 'type' from props destructuring
  // Determine the active state
  let activeState: StateType | null = null;
  
  if (loading || isLoading) activeState = "loading";
  else if (error || isError) activeState = "error";
  else if (isUnauthorized) activeState = "unauthorized";
  else if (isOffline) activeState = "offline";
  else if (isServerError) activeState = "serverError";
  else if (isNotFound) activeState = "notFound";
  else if (isNoResults) activeState = "noResults";
  else {
    const hasNoData = (data && data.length === 0) || dataLength === 0 || isEmpty;
    if (hasNoData) activeState = "empty";
  }

  // If there's data and no active state, render children
  if (!activeState && children) {
    return <>{children}</>;
  }

  // Custom fallback
  if (fallback && activeState) {
    return <>{fallback}</>;
  }

  // Custom loading component
  if (activeState === "loading" && loadingComponent) {
    return <>{loadingComponent}</>;
  }

  // Skeleton loading
  if (activeState === "loading" && skeleton) {
    return <TableSkeleton rows={skeletonRows} columns={skeletonColumns} />;
  }

  // Custom empty component
  if (activeState === "empty" && emptyComponent) {
    return <>{emptyComponent}</>;
  }

  // Custom error component
  if (activeState === "error" && errorComponent) {
    return <>{errorComponent}</>;
  }

  // Get configuration for the active state
  const config = defaultConfig[activeState as keyof typeof defaultConfig] || defaultConfig.error;
  const displayTitle = title || config.title;
  const displayMessage = message || config.message;

  // Get icon component
  const IconComponent = icon || getIconComponent(activeState);

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="mb-4">
        {IconComponent}
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {displayTitle}
      </h3>
      
      {error && activeState === "error" ? (
        <p className="text-sm text-red-500 mb-4 max-w-md">{error}</p>
      ) : (
        <p className="text-sm text-gray-500 mb-6 max-w-md">
          {displayMessage}
        </p>
      )}
      
      {(onRetry || action) && (
        <div className="flex gap-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          )}
          {action}
        </div>
      )}
    </div>
  );
}

// Convenience wrapper components
export function LoadingState(props: Partial<StateHandlerProps>) {
  return <StateHandler {...props} isLoading={true} />;
}

export function EmptyState(props: Partial<StateHandlerProps>) {
  return <StateHandler {...props} isEmpty={true} />;
}

export function NotFoundState(props: Partial<StateHandlerProps>) {
  return <StateHandler {...props} isNotFound={true} />;
}

export function ErrorState(props: Partial<StateHandlerProps>) {
  return <StateHandler {...props} isError={true} error={props.error || "An error occurred"} />;
}

export function NoResultsState(props: Partial<StateHandlerProps>) {
  return <StateHandler {...props} isNoResults={true} />;
}

export function UnauthorizedState(props: Partial<StateHandlerProps>) {
  return <StateHandler {...props} isUnauthorized={true} />;
}

export function OfflineState(props: Partial<StateHandlerProps>) {
  return <StateHandler {...props} isOffline={true} />;
}

export function ServerErrorState(props: Partial<StateHandlerProps>) {
  return <StateHandler {...props} isServerError={true} />;
}