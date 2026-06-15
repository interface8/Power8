"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { RoleStatsCards } from "@/components/admin/roles/RoleStatsCards";
import { RolesTable } from "@/components/admin/roles/RolesTable";
import { RolesTableSkeleton } from "@/components/admin/roles/RolesTableSkeleton";
import { RoleModal } from "@/components/admin/roles/RoleModal";
import { DeleteRoleModal } from "@/components/admin/roles/DeleteRoleModal";
import { useRoles, useCreateRole, useUpdateRole, useDeleteRole } from "@/hooks/use-admin-roles";
import { Role, CreateRoleData } from "@/types/admin-role";

// Calculate stats from roles data
const calculateStats = (roles: Role[]) => ({
  totalRoles: roles.length,
  totalPermissions: roles.reduce((sum, r) => sum + r.permissionsCount, 0),
  totalUsers: roles.reduce((sum, r) => sum + r.usersCount, 0),
  totalRolesWithUsers: roles.filter(r => r.usersCount > 0).length,
});

export default function RolesPage() {
  const { data: rolesData, isLoading, error, refetch } = useRoles();
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();
  const deleteRole = useDeleteRole();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; role: Role | null }>({ isOpen: false, role: null });

  const roles = rolesData?.data || [];
  const stats = calculateStats(roles);

  const handleCreate = () => {
    setEditingRole(null);
    setIsModalOpen(true);
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (role: Role) => {
    setDeleteModal({ isOpen: true, role });
  };

  const handleSubmit = async (data: CreateRoleData) => {
    if (editingRole) {
      await updateRole.mutateAsync({ id: editingRole.id, data });
    } else {
      await createRole.mutateAsync(data);
    }
    setIsModalOpen(false);
    setEditingRole(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.role) return;
    await deleteRole.mutateAsync({ id: deleteModal.role.id, force: true });
    setDeleteModal({ isOpen: false, role: null });
  };

  // Show error state
  if (error) {
    return (
      <div className="space-y-6 px-6 pb-6 pt-2 max-w-[1600px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Roles & Permissions</h1>
            <p className="text-sm text-gray-500 mt-1">Roles group permissions together. Assign roles to admin users to control their access.</p>
          </div>
          <button onClick={handleCreate} className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600">
            <Plus className="h-4 w-4" />Create Role
          </button>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center bg-red-50 rounded-xl border border-red-200">
          <div className="rounded-full bg-red-100 p-3 mb-3">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <p className="text-red-600 font-medium">Something went wrong</p>
          <p className="text-sm text-gray-500 mt-1">{error.message}</p>
          <button onClick={() => refetch()} className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-6 pb-6 pt-2 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Roles & Permissions</h1>
          <p className="text-sm text-gray-500 mt-1">Roles group permissions together. Assign roles to admin users to control their access.</p>
        </div>
        <button onClick={handleCreate} className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600">
          <Plus className="h-4 w-4" />Create Role
        </button>
      </div>

      {/* Stats Cards - Show skeleton while loading */}
      {isLoading ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-5 animate-pulse">
              <div className="flex items-center justify-between">
                <div><div className="h-4 w-20 bg-gray-200 rounded mb-2" /><div className="h-8 w-16 bg-gray-200 rounded" /></div>
                <div className="h-10 w-10 bg-gray-200 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <RoleStatsCards stats={stats} />
      )}

      {/* Roles Table - Show skeleton while loading */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {isLoading ? <RolesTableSkeleton /> : <RolesTable roles={roles} onEdit={handleEdit} onDelete={handleDeleteClick} />}
      </div>

      <RoleModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingRole(null); }} onSubmit={handleSubmit} initialData={editingRole} isSubmitting={createRole.isPending || updateRole.isPending} />
      <DeleteRoleModal isOpen={deleteModal.isOpen} onClose={() => setDeleteModal({ isOpen: false, role: null })} onConfirm={handleConfirmDelete} role={deleteModal.role} isDeleting={deleteRole.isPending} />
    </div>
  );
}