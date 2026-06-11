"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { RoleStatsCards } from "@/components/admin/roles/RoleStatsCards";
import { RolesTable } from "@/components/admin/roles/RolesTable";
import { RoleModal } from "@/components/admin/roles/RoleModal";
import { DeleteRoleModal } from "@/components/admin/roles/DeleteRoleModal";
import { Role, CreateRoleData } from "@/types/admin-role";
import { dummyRoles, dummyStats } from "@/data/roles-data";
import { toast } from "sonner";

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>(dummyRoles);
  const [stats] = useState(dummyStats);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; role: Role | null; }>({ isOpen: false, role: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCreate = () => { setEditingRole(null); setIsModalOpen(true); };
  const handleEdit = (role: Role) => { setEditingRole(role); setIsModalOpen(true); };
  const handleDeleteClick = (role: Role) => { setDeleteModal({ isOpen: true, role }); };

  const handleSubmit = async (data: CreateRoleData) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (editingRole) {
      setRoles(prev => prev.map(role => role.id === editingRole.id ? { ...role, ...data, updatedAt: new Date().toISOString() } : role));
      toast.success("Role updated successfully");
    } else {
      const newRole: Role = { id: Date.now().toString(), name: data.name, description: data.description || null, permissionsCount: 0, usersCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      setRoles(prev => [newRole, ...prev]);
      toast.success("Role created successfully");
    }
    setIsSubmitting(false);
    setIsModalOpen(false);
    setEditingRole(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.role) return;
    setIsDeleting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRoles(prev => prev.filter(role => role.id !== deleteModal.role!.id));
    toast.success(`Role "${deleteModal.role.name}" deleted successfully`);
    setIsDeleting(false);
    setDeleteModal({ isOpen: false, role: null });
  };

  return (
    <div className="space-y-6 p-6 max-w-400 mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-gray-900">Roles & Permissions</h1><p className="text-sm text-gray-500 mt-1">Roles group permissions together. Assign roles to admin users to control their access.</p></div>
        <button onClick={handleCreate} className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"><Plus className="h-4 w-4" />Create Role</button>
      </div>
      <RoleStatsCards stats={stats} />
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"><RolesTable roles={roles} onEdit={handleEdit} onDelete={handleDeleteClick} /></div>
      <RoleModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingRole(null); }} onSubmit={handleSubmit} initialData={editingRole} isSubmitting={isSubmitting} />
      <DeleteRoleModal isOpen={deleteModal.isOpen} onClose={() => setDeleteModal({ isOpen: false, role: null })} onConfirm={handleConfirmDelete} role={deleteModal.role} isDeleting={isDeleting} />
    </div>
  );
}