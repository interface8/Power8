"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft, Save, Shield } from "lucide-react";
import Link from "next/link";
import { PermissionGroup } from "@/components/admin/roles/permissions/PermissionGroup";
import { PermissionSkeleton } from "@/components/admin/roles/permissions/PermissionSkeleton";
import { permissionGroups, getDummyRolePermissions } from "@/data/permissions-data";
import { dummyRoles } from "@/data/roles-data";
import { toast } from "sonner";

export default function RolePermissionsPage() {
  const params = useParams();
  const roleId = params.id as string;
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const role = dummyRoles.find(r => r.id === roleId);

  useEffect(() => {
    const loadPermissions = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      const rolePermissions = getDummyRolePermissions(roleId);
      setSelectedPermissions(rolePermissions);
      setIsLoading(false);
    };
    loadPermissions();
  }, [roleId]);

  const handleTogglePermission = (permissionId: string) => {
    setSelectedPermissions(prev => prev.includes(permissionId) ? prev.filter(id => id !== permissionId) : [...prev, permissionId]);
  };

  const handleSelectAll = (permissionIds: string[]) => {
    const allSelected = permissionIds.every(id => selectedPermissions.includes(id));
    if (allSelected) setSelectedPermissions(prev => prev.filter(id => !permissionIds.includes(id)));
    else setSelectedPermissions(prev => [...new Set([...prev, ...permissionIds])]);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success(`Permissions for "${role?.name}" updated successfully`);
    setIsSaving(false);
  };

  if (isLoading) return <PermissionSkeleton />;
  if (!role) return <div className="flex flex-col items-center justify-center py-12"><Shield className="h-12 w-12 text-gray-400 mb-4" /><p className="text-gray-500">Role not found</p><Link href="/admin/roles" className="mt-4 text-orange-500 hover:text-orange-600">Back to Roles</Link></div>;

  const totalPermissions = selectedPermissions.length;

  return (
    <div className="space-y-6 p-6 max-w-400 mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/roles" className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-orange-600"><ArrowLeft className="h-4 w-4" /></Link>
          <div><div className="flex items-center gap-2"><h1 className="text-2xl font-bold text-gray-900">Manage Permissions</h1><div className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-700">{role.name}</div></div>{role.description && <p className="mt-1 text-sm text-gray-500">{role.description}</p>}</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right"><p className="text-sm text-gray-500">Total Permissions</p><p className="text-2xl font-bold text-orange-600">{totalPermissions}</p></div>
          <button onClick={handleSave} disabled={isSaving} className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50">{isSaving ? <><div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />Saving...</> : <><Save className="h-4 w-4" />Save Permissions</>}</button>
        </div>
      </div>
      <div className="rounded-lg bg-blue-50 p-4 border border-blue-100"><p className="text-sm text-blue-700">Define what this role can and cannot do in the system. Toggle individual permissions or use &quot;Select all&quot; for each group.</p></div>
      <div className="space-y-4">{permissionGroups.map((group) => (<PermissionGroup key={group.resource} group={group} selectedPermissions={selectedPermissions} onTogglePermission={handleTogglePermission} onSelectAll={handleSelectAll} />))}</div>
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 mt-6 rounded-lg shadow-lg"><div className="flex justify-end"><button onClick={handleSave} disabled={isSaving} className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50">{isSaving ? "Saving..." : "Save Permissions"}</button></div></div>
    </div>
  );
}