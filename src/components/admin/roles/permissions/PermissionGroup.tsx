"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { PermissionGroup as PermissionGroupType } from "@/data/permissions-data";
import { useState } from "react";

interface PermissionGroupProps {
  group: PermissionGroupType;
  selectedPermissions: string[];
  onTogglePermission: (permissionId: string) => void;
  onSelectAll: (permissionIds: string[]) => void;
}

export function PermissionGroup({ group, selectedPermissions, onTogglePermission, onSelectAll }: PermissionGroupProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const groupPermissionIds = group.permissions.map(p => p.id);
  const allSelected = groupPermissionIds.length > 0 && groupPermissionIds.every(id => selectedPermissions.includes(id));
  const someSelected = groupPermissionIds.some(id => selectedPermissions.includes(id)) && !allSelected;
  const Icon = group.icon;

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100"><Icon className="h-4 w-4 text-orange-600" /></div>
          <div><h3 className="font-semibold text-gray-900">{group.label}</h3><p className="text-xs text-gray-500">{group.permissions.length} permissions</p></div>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer" onClick={(e) => e.stopPropagation()}>
            <input type="checkbox" checked={allSelected} ref={(input) => { if (input) input.indeterminate = someSelected; }} onChange={(e) => { e.stopPropagation(); onSelectAll(groupPermissionIds); }} className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
            <span className="hidden sm:inline">Select all</span>
          </label>
          {isExpanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
        </div>
      </div>
      {isExpanded && (
        <div className="border-t border-gray-100 bg-gray-50/30 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {group.permissions.map((permission) => (
              <label key={permission.id} className="flex items-start gap-3 p-2 rounded-lg cursor-pointer hover:bg-white transition-colors">
                <input type="checkbox" checked={selectedPermissions.includes(permission.id)} onChange={() => onTogglePermission(permission.id)} className="mt-0.5 h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                <div className="flex-1"><p className="text-sm font-medium text-gray-700">{permission.name}</p><p className="text-xs text-gray-400">{permission.description}</p></div>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}