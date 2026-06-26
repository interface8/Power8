"use client";

import { useState } from "react";
import { System, ControlAction } from "@/types/admin-solar-system";
import { SystemFilters } from "@/components/admin/system-control/SystemFilter";
import { SystemCard } from "@/components/admin/system-control/SystemCard";
import { ActionModal } from "@/components/admin/system-control/ActionModals";
import {
  useSolarSystems,
  useEnableSolarSystem,
  useDisableSolarSystem,
  useLimitSolarSystem,
} from "@/hooks/use-admin-solar-system";
import { toast } from "sonner";
import { EmptyState, ErrorState } from "@/components/ui/states";
import { NoResultsState } from "@/components/ui/states/no-results-state";

export default function SystemControlPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<System["status"] | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const [selectedSystem, setSelectedSystem] = useState<System | null>(null);
  const [selectedAction, setSelectedAction] = useState<ControlAction | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch systems from API
  const { data, isLoading, error, refetch } = useSolarSystems({
    search: search || undefined,
    status: status === "ALL" ? undefined : status,
    page,
    limit: 20,
  });

  const systems: System[] = Array.isArray(data?.data?.data)
    ? data.data.data
    : [];

  const pagination = data?.data?.pagination;

  // Mutations
  const enableMutation = useEnableSolarSystem();
  const disableMutation = useDisableSolarSystem();
  const limitMutation = useLimitSolarSystem();

  const handleAction = (system: System, action: ControlAction) => {
    setSelectedSystem(system);
    setSelectedAction(action);
    setIsModalOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedSystem || !selectedAction) return;

    try {
      switch (selectedAction) {
        case "ENABLE":
          await enableMutation.mutateAsync(selectedSystem.id);
          break;
        case "DISABLE":
          await disableMutation.mutateAsync(selectedSystem.id);
          break;
        case "LIMIT":
          await limitMutation.mutateAsync(selectedSystem.id);
          break;
      }

      // Refresh the list
      await refetch();

      toast.success(
        `System ${selectedAction.toLowerCase()}d successfully for ${selectedSystem.customerName}`,
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : `Failed to ${selectedAction.toLowerCase()} system`;
      toast.error(message);
    } finally {
      setIsModalOpen(false);
      setSelectedSystem(null);
      setSelectedAction(null);
    }
  };

  const totalSystems = systems.length;

  // Loading State
  if (isLoading) {
    return (
      <div className="space-y-4 pb-6 pt-1 max-w-400 mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Control</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and monitor customer solar systems
          </p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 bg-white p-5 animate-pulse"
            >
              <div className="flex justify-between">
                <div className="space-y-2">
                  <div className="h-5 w-32 bg-gray-200 rounded" />
                  <div className="h-4 w-48 bg-gray-200 rounded" />
                  <div className="h-3 w-24 bg-gray-200 rounded" />
                </div>
                <div className="h-6 w-16 bg-gray-200 rounded" />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-10 bg-gray-200 rounded-lg" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="space-y-6 px-4 sm:px-6 pb-6 pt-1 max-w-400 mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Control</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and monitor customer solar systems
          </p>
        </div>

        <ErrorState
          error={
            error instanceof Error ? error.message : "Failed to load systems"
          }
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 sm:px-6 pb-6 pt-1 max-w-400 mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Control</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage and monitor customer solar systems
        </p>
      </div>

      {systems.length > 0 && (
        <div className="flex items-center gap-4 text-sm flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
            <span className="text-gray-600">
              Enabled:{" "}
              {
                systems.filter(
                  (s: System) =>
                    s.status === "ENABLED" || s.status === "ACTIVE",
                ).length
              }
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
            <span className="text-gray-600">
              Limited:{" "}
              {systems.filter((s: System) => s.status === "LIMITED").length}
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <span className="text-gray-600">
              Disabled:{" "}
              {systems.filter((s: System) => s.status === "DISABLED").length}
            </span>
          </span>
        </div>
      )}

      {/* Filters */}
      <SystemFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        totalSystems={totalSystems}
      />

      {/* Empty State */}
      {systems.length === 0 ? (
        search || status !== "ALL" ? (
          <NoResultsState
            title="No Matching Systems"
            message="No systems match your current search or filter criteria."
          />
        ) : (
          <EmptyState
            title="No Systems Available"
            message="There are currently no solar systems to display."
          />
        )
      ) : (
        <>
          {/* Systems Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {systems.map((system: System) => (
              <SystemCard
                key={system.id}
                system={system}
                logs={system.recentLogs || []}
                onAction={handleAction}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between gap-4 pt-4 mt-4 border-t border-gray-200">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-500">
                Page {page} of {pagination.totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((p) => Math.min(pagination.totalPages, p + 1))
                }
                disabled={page === pagination.totalPages}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Action Modal */}
      <ActionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSystem(null);
          setSelectedAction(null);
        }}
        onConfirm={handleConfirmAction}
        system={selectedSystem}
        action={selectedAction}
        isLoading={
          enableMutation.isPending ||
          disableMutation.isPending ||
          limitMutation.isPending
        }
      />
    </div>
  );
}
