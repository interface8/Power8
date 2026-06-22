"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description: string;
}

interface PermissionGroupType {
  resource: string;
  label: string;
  icon: React.ElementType;
  permissions: Permission[];
}

interface PermissionGroupProps {
  group: PermissionGroupType;
  selectedPermissions: string[];
  onTogglePermission: (permissionId: string) => void;
  onSelectAll: (permissionIds: string[]) => void;
}

export function PermissionGroup({
  group,
  selectedPermissions,
  onTogglePermission,
  onSelectAll,
}: PermissionGroupProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const groupPermissionIds = group.permissions.map((p) => p.id);
  const allSelected =
    groupPermissionIds.length > 0 &&
    groupPermissionIds.every((id) => selectedPermissions.includes(id));
  const Icon = group.icon;

  const handleGrantAll = () => {
    onSelectAll(groupPermissionIds);
  };

  const handleRevokeAll = () => {
    onSelectAll(groupPermissionIds);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden transition-all hover:shadow-md">
      {/* Group Header */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100">
            <Icon className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{group.label}</h3>
            <p className="text-xs text-gray-400">
              {group.permissions.length} permissions
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Grant All / Revoke All Button */}
          {allSelected ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRevokeAll();
              }}
              className="border border-orange-200 p-2 rounded-md text-xs text-orange-600  hover:text-red-500 hover:border-red-200 font-medium whitespace-nowrap"
            >
              ✓ All granted — click to revoke all
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleGrantAll();
              }}
              className="border border-orange-200 p-2 rounded-md text-xs text-orange-600 hover:text-orange-700 font-medium whitespace-nowrap"
            >
              Grant all
            </button>
          )}
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </div>

      {/* Permissions List */}
      {isExpanded && (
        <div className="border-t border-gray-100 bg-gray-50/30 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
            {group.permissions.map((permission) => (
              <label
                key={permission.id}
                className="flex items-start gap-3 p-2.5 rounded-lg cursor-pointer transition-all hover:bg-white hover:shadow-sm"
              >
                <Checkbox
                  checked={selectedPermissions.includes(permission.id)}
                  onCheckedChange={() => onTogglePermission(permission.id)}
                  className="
                    mt-0.5
                    border-gray-300
                    data-[state=checked]:bg-orange-500
                    data-[state=checked]:border-orange-500
                    data-[state=checked]:text-white
                  "
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">
                    {permission.name}
                  </p>
                  {permission.description && (
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                      {permission.description}
                    </p>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
