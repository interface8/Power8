"use client";

import Link from "next/link";
import {
  LogIn,
  Calculator,
  Sun,
  ShoppingCart,
  Star,
  BookOpen,
  LayoutDashboard,
  Package,
  Box,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { useState, useRef, useEffect } from "react";
import { UserDropdown } from "./UserDropdown";
import { useCart } from "../providers/cart-providers";

export default function PublicNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser } = useAuth();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { count } = useCart();

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
  };

  return (
    <nav className="fixed top-0 left-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-orange-500 p-1.5 md:p-2 rounded-xl shadow">
            <Sun className="text-white w-5 h-5 md:w-7 md:h-7" />
          </div>
          <span className="text-base sm:text-xl text-orange-600 font-bold">
            Power - 8
          </span>
        </Link>

        {/* DESKTOP */}
        <div className="hidden md:flex items-center gap-4">
          {!user ? (
            <>
              <Link
                href="/products"
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition ${
                  pathname === "/products"
                    ? "bg-green-200 text-black"
                    : "bg-green-50 hover:bg-green-200 hover:shadow-lg text-black border border-gray-200"
                }`}
              >
                <Package size={16} />
                Products
              </Link>

              <Link
                href="/cart"
                className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition ${
                  pathname === "/cart"
                    ? "bg-green-200 text-black"
                    : "bg-green-50 hover:bg-green-200 hover:shadow-lg text-black"
                }`}
              >
                <ShoppingCart size={16} />
                Cart
                {count > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {count}
                  </span>
                )}
              </Link>

              <Link
                href="/testimonial"
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition ${
                  pathname === "/testimonial"
                    ? "border-orange-500 bg-orange-50 text-orange-600"
                    : "border-orange-400 text-orange-600 hover:bg-orange-50"
                }`}
              >
                <Star size={14} />
                Testimonials
              </Link>

              <Link
                href="/blogs"
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition ${
                  pathname.startsWith("/blogs")
                    ? "border-orange-500 bg-orange-50 text-orange-600"
                    : "border-orange-400 text-orange-600 hover:bg-orange-50"
                }`}
              >
                <BookOpen size={14} />
                Blog
              </Link>

              <Link
                href="/calculator"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-200 bg-green-50 text-black rounded-lg hover:bg-green-200 hover:shadow-lg transition"
              >
                <Calculator size={16} />
                Calculator
              </Link>

              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white bg-green-950 hover:bg-green-900 hover:shadow-lg border"
              >
                <LogIn size={16} />
                Login
              </Link>
            </>
          ) : (
            <div className="flex items-center">
              <Link
                href="/products"
                className="flex items-center px-2.5 py-2.5 rounded-full hover:bg-green-50 transition"
              >
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="w-4 h-4 text-blue-600" />
                </div>
              </Link>

              <Link
                href="/cart"
                className="relative flex items-center px-2.5 py-2.5 rounded-full hover:bg-green-50 transition"
              >
                <div className="p-2 bg-green-100 rounded-lg">
                  <ShoppingCart className="w-4 h-4 text-green-600" />
                </div>

                {count > 0 && (
                  <span className="absolute top-1 -right-1 bg-orange-500 text-white text-xs min-w-4.5 h-4.5 px-1 flex items-center justify-center rounded-lg shadow">
                    {count}
                  </span>
                )}
              </Link>

              <Link
                href="/dashboard"
                className="flex items-center px-2.5 py-2.5 rounded-full hover:bg-green-50 transition"
              >
                <div className="p-2 bg-orange-100 rounded-lg">
                  <LayoutDashboard className="w-4 h-4 text-orange-600" />
                </div>
              </Link>

              {/* User */}
              <UserDropdown
                user={user}
                open={open}
                setOpen={setOpen}
                dropdownRef={dropdownRef}
                handleLogout={handleLogout}
              />
            </div>
          )}
        </div>

        {/* MOBILE */}
        <div className="flex md:hidden items-center gap-2">
          {!user ? (
            <>
              <Link
                href="/products"
                className="bg-green-50 p-1.5 md:p-2 rounded-md border"
              >
                <Box className="w-5 h-5 md:w-7 md:h-7" />
              </Link>

              <Link
                href="/cart"
                className="relative bg-green-50 p-1.5 md:p-2 rounded-md"
              >
                <ShoppingCart className="w-5 h-5 md:w-7 md:h-7" />

                {count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {count}
                  </span>
                )}
              </Link>

              <Link
                href="/blogs"
                className="border-2 border-orange-400 p-1.5 md:p-2 rounded-md"
              >
                <BookOpen className="w-5 h-5 md:w-7 md:h-7" />
              </Link>

              <Link
                href="/calculator"
                className="bg-green-50 p-1.5 md:p-2 rounded-md border"
              >
                <Calculator className="w-5 h-5 md:w-7 md:h-7" />
              </Link>

              <Link
                href="/login"
                className="bg-green-950 text-white p-1.5 md:p-2 rounded-md"
              >
                <LogIn className="w-5 h-5 md:w-7 md:h-7" />
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/cart"
                className="relative p-2 bg-green-100 rounded-md"
              >
                <ShoppingCart className="w-5 h-5 text-green-600" />

                {count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs min-w-4.5 h-4.5 px-1 flex items-center justify-center rounded-full">
                    {count}
                  </span>
                )}
              </Link>

              <Link href="/dashboard" className="p-2 bg-orange-50 rounded-md">
                <LayoutDashboard className="w-5 h-5 text-orange-600" />
              </Link>

              <UserDropdown
                user={user}
                open={open}
                setOpen={setOpen}
                dropdownRef={dropdownRef}
                handleLogout={handleLogout}
                mobile
              />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
