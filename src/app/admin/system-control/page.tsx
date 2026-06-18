"use client";

import { useState, useMemo } from "react";
import { System, ControlAction } from "@/types/admin-system";
import { SystemFilters } from "@/components/admin/system-control/SystemFilter";
import { SystemCard } from "@/components/admin/system-control/SystemCard";
import { ActionModal } from "@/components/admin/system-control/ActionModals";
import { dummySystems, dummyControlLogs } from "@/data/system-data";
import { filterSystems,} from "@/components/admin/system-control/systemUtils";
import { toast } from "sonner";
import { Settings } from "lucide-react";

export default function SystemControlPage() {
  const [systems] = useState<System[]>(dummySystems);
  const [logs] = useState(dummyControlLogs);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<System["status"] | "ALL">("ALL");
  const [selectedSystem, setSelectedSystem] = useState<System | null>(null);
  const [selectedAction, setSelectedAction] = useState<ControlAction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const filteredSystems = useMemo(() => {
    return filterSystems(systems, search, status);
  }, [systems, search, status]);

  const totalSystems = filteredSystems.length;

  const handleAction = (system: System, action: ControlAction) => {
    setSelectedSystem(system);
    setSelectedAction(action);
    setIsModalOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedSystem || !selectedAction) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success(
      `System ${selectedAction.toLowerCase()}d successfully for ${selectedSystem.customerName}`
    );

    setIsLoading(false);
    setIsModalOpen(false);
    setSelectedSystem(null);
    setSelectedAction(null);
  };

  return (
    <div className="space-y-6 px-4 sm:px-6 pb-6 pt-0 max-w-400 mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Control</h1>
        <p className="text-sm text-gray-500 mt-1">Manage and monitor customer solar systems</p>
      </div>

      {/* Filters */}
      <SystemFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        totalSystems={totalSystems}
      />

      {/* Systems Grid - Responsive: 1 column on mobile, 2 columns on lg, 3 columns on xl */}
      {filteredSystems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-xl border border-gray-200">
          <Settings className="h-12 w-12 text-gray-400 mb-3" />
          <p className="text-gray-500">No systems found</p>
          <p className="text-sm text-gray-400 mt-1">
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4">
          {filteredSystems.map((system) => (
            <SystemCard
              key={system.id}
              system={system}
              logs={logs}
              onAction={handleAction}
            />
          ))}
        </div>
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
        isLoading={isLoading}
      />
    </div>
  );
}