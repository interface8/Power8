"use client";

import { X, Shield } from "lucide-react";
import { Role } from "@/types/admin-role";

interface RoleBadgeProps {
  role: Role;
  onRemove?: (roleId: string) => void;
  canRemove?: boolean;
}

export function RoleBadge({ role, onRemove, canRemove = true }: RoleBadgeProps) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1.5 text-sm font-medium text-orange-700">
      <Shield className="h-3.5 w-3.5" />
      <span>{role.name}</span>
      {canRemove && onRemove && (
        <button onClick={() => onRemove(role.id)} className="ml-1 rounded-full p-0.5 hover:bg-orange-200 transition-colors" aria-label={`Remove ${role.name} role`}>
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}