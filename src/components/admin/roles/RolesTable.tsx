"use client";

import {
  Edit,
  Trash2,
  Key,
  Users,
  Calendar,
  Shield,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Role } from "@/types/admin-role";
import { useState } from "react";
import Link from "next/link";

interface RolesTableProps {
  roles: Role[];
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

function MobileRoleCard({
  role,
  onEdit,
  onDelete,
}: {
  role: Role;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-3 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 flex-1">
          <Shield className="h-5 w-5 text-orange-500" />
          <h3 className="font-semibold text-gray-900">{role.name}</h3>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </button>
      </div>
      {role.description && (
        <p className="text-base text-gray-600 mt-2 line-clamp-2">
          {role.description}
        </p>
      )}
      <div className="flex flex-wrap gap-4 mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <Key className="h-3.5 w-3.5 text-gray-400" />
          <span className="text-base text-gray-600">
            {role.permissionsCount} permissions
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5 text-gray-400" />
          <span className="text-sm text-gray-600">{role.usersCount} users</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-gray-400" />
          <span className="text-base text-gray-500">
            {formatDate(role.createdAt)}
          </span>
        </div>
      </div>
      {expanded && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/admin/roles/${role.id}/permissions`}
              className="flex-1 rounded-lg bg-orange-50 px-3 py-2 text-sm font-medium text-orange-600 text-center hover:bg-orange-100"
            >
              Manage Permissions
            </Link>
            <button
              onClick={() => onEdit(role)}
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            >
              Edit Role
            </button>
            <button
              onClick={() => onDelete(role)}
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TableHeader() {
  const headers = [
    "Role Name",
    "Description",
    "Permissions",
    "Users",
    "Created",
    "Actions",
  ];
  return (
    <thead className="border-b border-gray-200 bg-gray-50">
      <tr>
        {headers.map((header) => (
          <th
            key={header}
            className="px-4 py-3 text-left text-base font-semibold text-gray-600"
          >
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
}

function TableRow({
  role,
  onEdit,
  onDelete,
}: {
  role: Role;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
}) {
  return (
    <tr className="border-b border-gray-100 transition-colors hover:bg-orange-50/30">
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-orange-500" />
          <span className="font-semibold text-gray-900">{role.name}</span>
        </div>
      </td>
      <td className="px-4 py-4">
        <p className="text-sm text-gray-600 line-clamp-2 max-w-xs">
          {role.description || "-"}
        </p>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-1.5">
          <Key className="h-3.5 w-3.5 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">
            {role.permissionsCount}
          </span>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">
            {role.usersCount}
          </span>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-gray-400" />
          <span className="text-sm text-gray-500 whitespace-nowrap">
            {formatDate(role.createdAt)}
          </span>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/roles/${role.id}/permissions`}
            className="whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium text-orange-600 hover:bg-orange-50"
          >
            Manage Permissions
          </Link>
          <button
            onClick={() => onEdit(role)}
            className="rounded-lg p-2 text-gray-500 hover:bg-blue-100 hover:text-blue-600"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(role)}
            className="rounded-lg p-2 text-gray-500 hover:bg-red-100 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export function RolesTable({ roles, onEdit, onDelete }: RolesTableProps) {
  if (roles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-gray-100 p-3 mb-3">
          <Shield className="h-6 w-6 text-gray-400" />
        </div>
        <p className="text-gray-500">No roles found</p>
        <p className="text-sm text-gray-400 mt-1">
          Create your first role to get started
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="block md:hidden">
        {roles.map((role) => (
          <MobileRoleCard
            key={role.id}
            role={role}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-200">
          <TableHeader />
          <tbody>
            {roles.map((role) => (
              <TableRow
                key={role.id}
                role={role}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
