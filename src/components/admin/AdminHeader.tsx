"use client";

import {
  Menu,
  ChevronRight,
  ExternalLink,
  ChevronDown,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  setOpen: (open: boolean) => void;
}

export default function AdminHeader({ setOpen }: Props) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* LEFT SIDE */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu */}
        <button
          onClick={() => setOpen(true)}
          className="lg:hidden"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          {pathname === "/admin/dashboard" ? (
            <span className="font-semibold text-[15px] text-gray-900">
              Dashboard
            </span>
          ) : (
            <>
              <Link
                href="/admin/dashboard"
                className="font-medium hover:text-orange-600 transition-colors"
              >
                Dashboard
              </Link>

              {segments.slice(1).map((segment, index) => {
                const href =
                  "/" + segments.slice(0, index + 2).join("/");

                return (
                  <div
                    key={segment}
                    className="flex items-center gap-2"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-400" />

                    <Link
                      href={href}
                      className="capitalize font-medium hover:text-orange-600 transition-colors"
                    >
                      {segment.replace("-", " ")}
                    </Link>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* View Store */}
        <Link
          href="/products"
          target="_blank"
          className="hidden md:flex items-center gap-1.5 text-sm text-gray-600 hover:text-orange-600 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          View Store
        </Link>

        {/* Admin Badge */}
        <div className="hidden sm:flex items-center justify-center px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold uppercase tracking-wide">
          Admin
        </div>


        {/* Profile */}
        <button className="flex items-center gap-2 sm:gap-3 hover:bg-gray-50 px-2 py-1.5 rounded-xl transition-colors">
          <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>

          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold text-gray-800 leading-none">
              System Admin
            </p>

            <p className="text-xs text-gray-500 mt-1">
              admin@power8
            </p>
          </div>

          <ChevronDown className="hidden sm:block w-4 h-4 text-gray-500" />
        </button>
      </div>
    </header>
  );
}