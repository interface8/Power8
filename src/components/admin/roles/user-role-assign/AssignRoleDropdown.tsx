"use client";

import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { Role } from "@/types/admin-role";

interface AssignRoleDropdownProps {
  availableRoles: Role[];
  onAssign: (roleId: string) => Promise<void>;
  isLoading: boolean;
}

export function AssignRoleDropdown({ availableRoles, onAssign, isLoading }: AssignRoleDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  const handleAssign = async () => {
    if (!selectedRoleId) return;
    setIsAssigning(true);
    await onAssign(selectedRoleId);
    setSelectedRoleId("");
    setIsOpen(false);
    setIsAssigning(false);
  };

  if (availableRoles.length === 0) {
    return <p className="text-sm text-gray-400">No available roles to assign</p>;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <Plus className="h-4 w-4" />
        Assign Role
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 top-full mt-2 z-50 w-64 rounded-xl border border-gray-200 bg-white shadow-lg">
            <div className="p-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Role</label>
              <select value={selectedRoleId} onChange={(e) => setSelectedRoleId(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100">
                <option value="">Choose a role...</option>
                {availableRoles.map((role) => (<option key={role.id} value={role.id}>{role.name}</option>))}
              </select>
              <button
                onClick={handleAssign}
                disabled={!selectedRoleId || isAssigning || isLoading}
                className="mt-3 w-full rounded-lg bg-orange-500 px-3 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50"
              >
                {isAssigning ? "Assigning..." : "Assign Role"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}