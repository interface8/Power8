"use client";

import {
  ChevronDown,
  Calculator,
  LogOut,
  Star,
  Package,
  BookOpen,
  LayoutDashboard,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface UserType {
  name?: string | null;
  email?: string | null;
}

interface Props {
  user: UserType;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dropdownRef: React.RefObject<HTMLDivElement>;
  handleLogout: () => Promise<void>;
  mobile?: boolean;
}

function getInitials(name?: string | null) {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0];
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function UserDropdown({
  user,
  open,
  setOpen,
  dropdownRef,
  handleLogout,
  mobile = false,
}: Props) {
  const router = useRouter();
  const initials = getInitials(user?.name);

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const navigate = (path: string) => {
    router.push(path);
    setOpen(false);
  };

  const logout = async () => {
    await handleLogout();
    setOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-2 cursor-pointer bg-green-50 rounded-lg hover:bg-green-100"
      >
        <div
          className={`relative rounded-full bg-green-950 ring-1 ring-green-600 text-white flex items-center justify-center font-semibold  ${
            mobile ? "w-7 h-7 text-sm" : "w-7 h-7"
          }`}
        >
          {initials}
        </div>

        <p className="hidden sm:block font-medium text-gray-900 truncate">{user?.name}</p>

        <ChevronDown
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* DROPDOWN */}
      {open && (
        <div
          onMouseDown={stopPropagation}
          className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-lg border z-50 overflow-hidden"
        >
          {/* Profile */}
          <div className="px-4 py-4 bg-linear-to-r from-orange-50 to-amber-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center font-semibold text-sm shadow-sm">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="py-2">
            <p className="px-4 pb-1 text-xs font-semibold text-green-950 uppercase tracking-wider">
              Actions
            </p>

            <button
              onMouseDown={() => navigate("/dashboard")}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-green-50 transition rounded-lg cursor-pointer"
            >
              <div className="p-2 bg-gray-100 rounded-lg">
                <LayoutDashboard className="w-4 h-4 text-gray-600" />
              </div>
              <span className="text-sm font-medium text-gray-800">
                Dashboard
              </span>
            </button>

            <button
              onMouseDown={() => navigate("/calculator")}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-green-50 transition rounded-lg cursor-pointer"
            >
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calculator className="w-4 h-4 text-orange-600" />
              </div>
              <span className="text-sm font-medium text-gray-800">
                Calculator
              </span>
            </button>

            <button
              onMouseDown={() => navigate("/products")}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-green-50 transition rounded-lg cursor-pointer"
            >
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-800">
                Browse Products
              </span>
            </button>

            <button
              onMouseDown={() => navigate("/testimonial")}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-green-50 transition rounded-lg cursor-pointer"
            >
              <div className="p-2 bg-green-100 rounded-lg">
                <Star className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-800">
                Testimonials
              </span>
            </button>

            <button
              onMouseDown={() => navigate("/blogs")}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-green-50 transition rounded-lg cursor-pointer"
            >
              <div className="p-2 bg-yellow-100 rounded-lg">
                <BookOpen className="w-4 h-4 text-yellow-600" />
              </div>
              <span className="text-sm font-medium text-gray-800">Blogs</span>
            </button>
          </div>

          <div className="h-px bg-gray-100 my-1" />

          {/* Logout */}
          <div className="py-1">
            <button
              onMouseDown={logout}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition rounded-lg cursor-pointer"
            >
              <div className="p-2 bg-red-100 rounded-lg">
                <LogOut className="w-4 h-4 text-red-600" />
              </div>
              <span className="text-sm font-medium text-red-600">Log out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
