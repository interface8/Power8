"use client";

import { useEffect } from "react";
import { AlertTriangle, X, Users } from "lucide-react";
import { Role } from "@/types/admin-role";

interface DeleteRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  role: Role | null;
  isDeleting: boolean;
}

export function DeleteRoleModal({ isOpen, onClose, onConfirm, role, isDeleting }: DeleteRoleModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isDeleting) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, isDeleting, onClose]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen || !role) return null;

  const hasUsers = role.usersCount > 0;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between border-b border-gray-100 bg-linear-to-r from-red-50/30 to-white px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Delete Role</h2>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            <button onClick={onClose} disabled={isDeleting} className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-7 w-7 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete &quot;{role.name}&quot; role?</h3>
              {hasUsers && (
                <div className="flex items-center justify-center gap-2 text-orange-600 bg-orange-50 rounded-lg p-3 mb-4">
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-medium">{role.usersCount} user(s) are currently assigned this role</span>
                </div>
              )}
              <p className="text-sm text-gray-500">
                {hasUsers 
                  ? `Deleting this role will immediately remove it from ${role.usersCount} user(s), and they will lose all associated permissions.`
                  : "This role is not assigned to any users. It will be permanently removed."}
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={onClose} disabled={isDeleting} className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-50">Cancel</button>
              <button onClick={onConfirm} disabled={isDeleting} className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-red-600 disabled:opacity-50">
                {isDeleting ? "Deleting..." : "Delete Role"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}