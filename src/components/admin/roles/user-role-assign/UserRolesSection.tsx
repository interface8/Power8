"use client";

import { Role } from "@/types/admin-role";
import { RoleBadge } from "./RoleBadge";
import { AssignRoleDropdown } from "./AssignRoleDropdown";
import { AlertCircle } from "lucide-react";

interface UserRolesSectionProps {
  userRoles: Role[];
  availableRoles: Role[];
  onRemoveRole: (roleId: string) => Promise<void>;
  onAssignRole: (roleId: string) => Promise<void>;
  isLoading: boolean;
}

export function UserRolesSection({
  userRoles,
  availableRoles,
  onRemoveRole,
  onAssignRole,
  isLoading,
}: UserRolesSectionProps) {
  const hasNoRoles = userRoles.length === 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm mt-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Assigned Roles</h3>
        <p className="text-sm text-gray-500">
          Roles determine what this user can access in the admin panel
        </p>
      </div>

      {/* Current Roles */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Roles
        </label>
        {hasNoRoles ? (
          <div className="flex items-center gap-2 rounded-lg bg-yellow-50 border border-yellow-200 p-3">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <p className="text-sm text-yellow-700">
              No roles assigned — this user has no permissions in the admin panel.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {userRoles.map((role) => (
              <RoleBadge
                key={role.id}
                role={role}
                onRemove={() => onRemoveRole(role.id)}
                canRemove={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Assign New Role */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Assign New Role
        </label>
        <AssignRoleDropdown
          availableRoles={availableRoles}
          onAssign={onAssignRole}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}