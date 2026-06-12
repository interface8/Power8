"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  Save,
  Shield,
  LayoutDashboard,
  ShoppingCart,
  CreditCard,
  Package,
  Layers3,
  Boxes,
  Users,
  Sun,
  Image,
  MessageSquareQuote,
  BookOpen,
  FolderTree,
  KeyRound,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { useRole } from "@/hooks/use-admin-roles";
import {
  usePermissionsGrouped,
  useRolePermissions,
  useUpdateRolePermissions,
} from "@/hooks/use-admin-permissions";
import { PermissionGroup } from "@/components/admin/roles/permissions/PermissionGroup";
import { Permission } from "@/types/admin-role";

// Map resource names to display labels and icons
const resourceConfig: Record<
  string,
  { label: string; icon: React.ElementType }
> = {
  dashboard: { label: "Dashboard", icon: LayoutDashboard },
  orders: { label: "Orders", icon: ShoppingCart },
  credit_accounts: { label: "Credit Accounts", icon: CreditCard },
  products: { label: "Products", icon: Package },
  categories: { label: "Categories", icon: Layers3 },
  bundles: { label: "Bundles", icon: Boxes },
  users: { label: "Users", icon: Users },
  solar_systems: { label: "Solar Systems", icon: Sun },
  carousel: { label: "Carousel", icon: Image },
  testimonials: { label: "Testimonials", icon: MessageSquareQuote },
  blogs: { label: "Blog", icon: BookOpen },
  blog_categories: { label: "Blog Categories", icon: FolderTree },
  roles: { label: "Roles", icon: Shield },
  permissions: { label: "Permissions", icon: KeyRound },
  audit_logs: { label: "Audit Logs", icon: Clock },
};

// Format permission groups for the PermissionGroup component
const formatPermissionGroups = (
  groups: { resource: string; permissions: Permission[] }[],
) => {
  return groups.map((group) => ({
    resource: group.resource,
    label:
      resourceConfig[group.resource]?.label ||
      group.resource
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()),
    icon: resourceConfig[group.resource]?.icon || Shield,
    permissions: group.permissions.map((p) => ({
      id: p.id,
      name: p.action
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      resource: p.resource,
      action: p.action,
      description: p.description || "",
    })),
  }));
};

export default function RolePermissionsPage() {
  const params = useParams();
  const roleId = params.id as string;

  const { data: roleData, isLoading: roleLoading } = useRole(roleId);
  const { data: permissionsData, isLoading: permissionsLoading } =
    usePermissionsGrouped();
  const { data: rolePermissionsData, isLoading: rolePermissionsLoading } =
    useRolePermissions(roleId);
  const updateRolePermissions = useUpdateRolePermissions();

  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // Memoize rolePermissions to prevent unnecessary re-renders
  const rolePermissions = useMemo(() => {
    return rolePermissionsData?.data || [];
  }, [rolePermissionsData?.data]);

  // Memoize permission groups
  const permissionGroups = useMemo(() => {
    return permissionsData?.data || [];
  }, [permissionsData?.data]);

  // Initialize selected permissions from API
  useEffect(() => {
    if (rolePermissions.length > 0) {
      setSelectedPermissions(rolePermissions.map((p: Permission) => p.id));
    }
  }, [rolePermissions]);

  const handleTogglePermission = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId],
    );
  };

  const handleSelectAll = (permissionIds: string[]) => {
    const allSelected = permissionIds.every((id) =>
      selectedPermissions.includes(id),
    );
    if (allSelected) {
      setSelectedPermissions((prev) =>
        prev.filter((id) => !permissionIds.includes(id)),
      );
    } else {
      setSelectedPermissions((prev) => {
        const newPermissions = [...prev];
        permissionIds.forEach((id) => {
          if (!newPermissions.includes(id)) {
            newPermissions.push(id);
          }
        });
        return newPermissions;
      });
    }
  };

  const handleSave = async () => {
    await updateRolePermissions.mutateAsync({
      roleId,
      permissionIds: selectedPermissions,
    });
  };

  const isLoading = roleLoading || permissionsLoading || rolePermissionsLoading;
  const role = roleData?.data;

  // Memoize formatted groups to prevent unnecessary re-renders
  const formattedGroups = useMemo(() => {
    if (!permissionGroups.length) return [];
    return formatPermissionGroups(permissionGroups);
  }, [permissionGroups]);

  // Memoize the empty state check
  const isEmpty = useMemo(() => {
    return formattedGroups.length === 0 && !isLoading;
  }, [formattedGroups.length, isLoading]);

  if (isLoading) {
    return (
      <div className="space-y-6 p-6 max-w-400 mx-auto">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-gray-200 rounded-lg animate-pulse" />
          <div>
            <div className="h-7 w-48 bg-gray-200 rounded animate-pulse mb-1" />
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="h-16 bg-gray-200 rounded-lg animate-pulse" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 bg-white p-4 animate-pulse"
            >
              <div className="flex justify-between items-center">
                <div className="h-6 w-32 bg-gray-200 rounded" />
                <div className="h-5 w-20 bg-gray-200 rounded" />
              </div>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="h-10 bg-gray-100 rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Shield className="h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-500">Role not found</p>
        <Link
          href="/admin/roles"
          className="mt-4 text-orange-500 hover:text-orange-600"
        >
          Back to Roles
        </Link>
      </div>
    );
  }

  const totalPermissions = selectedPermissions.length;

  return (
    <div className="space-y-6 px-6 pb-6 pt-1 max-w-400 mx-auto">
      {/* Back Button */}
      <Link
        href="/admin/roles"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-orange-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Roles
      </Link>

      {/* Role Header - Matching Figma Design */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                <Shield className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h1 className="text-base md:text-lg sm:text-xl font-semibold text-gray-900">
                  {role.name}
                </h1>
                {role.description && (
                  <p className="text-sm text-gray-500 mt-0.5">
                    {role.description}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={updateRolePermissions.isPending}
              className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-orange-600 hover:shadow-md disabled:opacity-50"
            >
              {updateRolePermissions.isPending ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Permissions
                </>
              )}
            </button>
          </div>
        </div>
        <hr />
        <div className="px-5 py-3 bg-gray-50/30">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-100">
              <Shield className="h-3 w-3 text-orange-600" />
            </div>
            <span className="text-sm text-gray-600">
              {totalPermissions} of {totalPermissions} permissions granted
            </span>
          </div>
        </div>
      </div>

      {/* Permission Groups */}
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-xl border border-gray-200">
          <Shield className="h-12 w-12 text-gray-400 mb-3" />
          <p className="text-gray-500">No permissions available</p>
        </div>
      ) : (
        <div className="space-y-4">
          {formattedGroups.map((group) => (
            <PermissionGroup
              key={group.resource}
              group={group}
              selectedPermissions={selectedPermissions}
              onTogglePermission={handleTogglePermission}
              onSelectAll={handleSelectAll}
            />
          ))}
        </div>
      )}

      {/* Sticky Save Button */}
      {!isEmpty && (
        <div className="sticky bottom-0 mx-0 bg-white border-t border-gray-200 p-4 mt-6 rounded-lg shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">
                  {totalPermissions}
                </span>{" "}
                permissions granted to{" "}
                <span className="font-semibold text-orange-600">
                  {role.name}
                </span>
              </span>
            </div>
            <button
              onClick={handleSave}
              disabled={updateRolePermissions.isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-orange-600 hover:shadow-md disabled:opacity-50"
            >
              {updateRolePermissions.isPending ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Saving Permissions...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Permissions
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
