"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import {
  LogOut,
  Calculator,
  ShoppingCart,
  User,
  ChevronDown,
  Sun,
} from "lucide-react";
import Link from "next/link";

function getInitials(name?: string) {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0];
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function DashboardNavbar() {
  const user = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const initials = getInitials(user?.name);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const handleNavigate = (path: string) => {
    router.push(path);
    setOpen(false);
  };

  return (
    <nav className="bg-white border-b px-4 py-2 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <div className="bg-orange-500 p-2 rounded-xl shadow">
          <Sun className="text-white" size={30} />
        </div>
        <span className="text-xl text-orange-600 font-bold">Power - 8</span>
      </Link>

      {/* User Profile */}
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 "
        >
          {/* Avatar */}
          <div className="relative w-10 h-10 rounded-full bg-orange-800 ring-2 ring-orange-600 text-white flex items-center justify-center font-semibold text-lg">
            {initials}
            <User className="absolute -bottom-1 -right-1 w-4 h-4 bg-white text-orange-700 rounded-full p-0.5 shadow" />
          </div>

          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95">
            {/* Profile Header */}
            <div className="px-4 py-4 bg-linear-to-r from-orange-50 to-amber-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center font-semibold text-sm shadow-sm">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="py-2">
              <p className="px-4 pb-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                Tools
              </p>

              <button
                onClick={() => handleNavigate("/calculator")}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-green-50 transition rounded-lg"
              >
                <div className="p-2 bg-orange-50 rounded-lg">
                  <Calculator className="w-4 h-4 text-orange-600" />
                </div>
                <span className="text-sm font-medium text-gray-800">
                  Calculator
                </span>
              </button>

              <button
                onClick={() => handleNavigate("/shop")}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-green-50 transition rounded-lg"
              >
                <div className="p-2 bg-gray-100 rounded-lg">
                  <ShoppingCart className="w-4 h-4 text-gray-600" />
                </div>
                <span className="text-sm font-medium text-gray-800">
                  Browse Products
                </span>
              </button>
            </div>

            <div className="h-px bg-gray-100 my-1" />

            {/* Logout */}
            <div className="py-1">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition rounded-lg"
              >
                <div className="p-2 bg-red-50 rounded-lg">
                  <LogOut className="w-4 h-4 text-red-600" />
                </div>
                <span className="text-sm font-medium text-red-600">
                  Log out
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
