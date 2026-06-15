interface DashboardErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export default function DashboardErrorState({
  message,
  onRetry,
}: DashboardErrorStateProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
      <h3 className="text-red-700 font-semibold">Failed to load dashboard</h3>

      <p className="text-red-500 text-sm mt-2">{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition"
        >
          Retry
        </button>
      )}
    </div>
  );
}
