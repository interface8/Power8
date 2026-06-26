"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, ChevronDown, LogOut, UserCircle2, Store } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { toast } from "sonner";

interface MerchantHeaderProps {
  setOpen: (open: boolean) => void;
}

export function MerchantHeader({ setOpen }: MerchantHeaderProps) {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "M";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        setUser(null);
        toast.success("Logged out successfully");
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-orange-500 p-1.5 rounded-lg">
              <Store className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 hidden sm:block">
              Merchant
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1.5 rounded-xl transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center font-semibold text-sm shadow-md">
                {initials}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-gray-800">
                  {user?.name || "Merchant"}
                </p>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                <div className="px-4 py-3 bg-linear-to-r from-orange-50 to-white border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">
                    {user?.name || "Merchant"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.email || "merchant@power8.com"}
                  </p>
                </div>
                <div className="p-1.5">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      router.push("/merchant/profile");
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors"
                  >
                    <UserCircle2 className="h-4 w-4" />
                    Profile Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
