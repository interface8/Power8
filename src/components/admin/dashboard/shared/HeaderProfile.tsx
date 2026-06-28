"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { toast } from "sonner";

interface HeaderProfileProps {
  name?: string;
  email?: string;
}

export function HeaderProfile({ name, email }: HeaderProfileProps) {
  const router = useRouter();
  const { setUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const initials =
    name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AD";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
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
      } else {
        toast.error("Failed to logout");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An error occurred during logout");
    }
  };


  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-1 sm:gap-2 lg:gap-3
          rounded-lg sm:rounded-xl
          px-1.5 sm:px-2 lg:px-2.5 py-1 sm:py-1.5 lg:py-2
          transition-all duration-200 bg-green-50
          hover:bg-green-100
          hover:shadow-sm
          ${isOpen ? "bg-green-100 shadow-sm" : ""}
        `}
      >
        {/* Avatar */}
        <div
          className="
            relative flex items-center justify-center
            rounded-full
            bg-green-950 ring-1 ring-green-500
            font-semibold text-white
            shadow-sm
            w-6 h-6 sm:w-7 sm:h-7 lg:w-9 lg:h-9
            text-xs sm:text-sm lg:text-base
          "
        >
          {initials}
          <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-500 rounded-full border-2 border-white" />
        </div>

        {/* User Info */}
        <div className="hidden sm:block text-left">
          <p
            className="
              max-w-25 md:max-w-35 lg:max-w-40
              truncate text-xs sm:text-sm lg:text-base
              font-semibold text-gray-900
            "
          >
            {name || "Administrator"}
          </p>
          <p
            className="
              hidden md:block
              max-w-30 lg:max-w-40
              truncate text-[10px] sm:text-xs
              text-gray-500
            "
          >
            {email || "admin@power8.com"}
          </p>
        </div>

        {/* Chevron */}
        <ChevronDown
          className={`
            hidden sm:block h-3 w-3 sm:h-4 sm:w-4
            text-gray-500 transition-transform duration-200
            ${isOpen ? "rotate-180" : ""}
          `}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="
            absolute right-0 top-full mt-2
            w-56 sm:w-64
            bg-white rounded-xl shadow-lg
            border border-gray-200
            overflow-hidden
            animate-in fade-in slide-in-from-top-2
            duration-200
            z-50
          "
        >
          {/* Header Section */}
          <div className="px-4 py-3 border-b border-gray-100 bg-linear-to-r from-green-50 to-white">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {name || "Administrator"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {email || "admin@power8.com"}
            </p>
          </div>

          {/* Logout Button */}
          <div className="p-1.5">
            <button
              onClick={handleLogout}
              className="
                w-full flex items-center gap-3
                px-3 py-2.5 rounded-lg
                text-sm font-medium text-red-600
                transition-all duration-200
                hover:bg-red-50
              "
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
