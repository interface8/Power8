"use client";

import Link from "next/link";
import {
  LogIn,
  Calculator,
  Sun,
  ShoppingCart,
  Star,
  BookOpen,
  Package,
  Box,
  Menu,
  X,
  Loader2,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { useState, useRef, useEffect } from "react";
import { UserDropdown } from "./UserDropdown";
import { useCart } from "../providers/cart-providers";

export default function PublicNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, setUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
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

  const LoadingSpinner = () => (
    <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
  );

  return (
    <nav className="fixed top-0 left-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className={`flex items-center gap-2 transition-opacity ${loading ? "opacity-70" : ""}`}
          onClick={(e) => loading && e.preventDefault()}
        >
          <div className="bg-orange-500 p-1.5 md:p-2 rounded-xl shadow">
            <Sun className="text-white w-5 h-5 md:w-7 md:h-7" />
          </div>
          <span className="text-base sm:text-xl text-orange-600 font-bold">
            Power - 8
          </span>
        </Link>

        {/* DESKTOP */}
        <div className="hidden md:flex items-center gap-4">
          {loading ? (
            <>
              <div className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-green-50 text-black border border-gray-200 opacity-50 cursor-wait">
                <Package size={16} className="text-blue-600" />
                Products
              </div>

              <div className="relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-green-50 text-gray-800 opacity-50 cursor-wait">
                <ShoppingCart size={16} className="text-green-600" />
                Cart
              </div>

              <div className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-orange-400 text-orange-600 opacity-50 cursor-wait">
                <Star size={14} />
                Testimonials
              </div>

              <div className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-orange-400 text-orange-600 opacity-50 cursor-wait">
                <BookOpen size={14} />
                Blog
              </div>

              <div className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-200 bg-green-50 text-gray-800 rounded-lg opacity-50 cursor-wait">
                <Calculator size={16} className="text-orange-600" />
                Calculator
              </div>

              <div className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white bg-green-950 opacity-50 cursor-wait">
                <LogIn size={16} />
                Login
              </div>

              {/* Loading indicator */}
              <div className="ml-2">
                <LoadingSpinner />
              </div>
            </>
          ) : !user ? (
            <>
              <Link
                href="/products"
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition ${
                  pathname === "/products"
                    ? "bg-green-200 text-black"
                    : "bg-green-50 hover:bg-green-200 hover:shadow-lg text-black border border-gray-200"
                }`}
              >
                <Package size={16} className="text-blue-600" />
                Products
              </Link>

              <Link
                href="/cart"
                className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition ${
                  pathname === "/cart"
                    ? "bg-green-200 text-gray-800"
                    : "bg-green-50 hover:bg-green-200 hover:shadow-lg text-gray-800"
                }`}
              >
                <ShoppingCart size={16} className="text-green-600" />
                Cart
                {count > 0 && (
                  <span className="relative bg-orange-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
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
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-200 bg-green-50 text-gray-800 rounded-lg hover:bg-green-200 hover:shadow-lg transition"
              >
                <Calculator size={16} className="text-orange-600" />
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
            <div className="flex items-center gap-2">
              <Link
                href="/products"
                className={`flex items-center gap-1 px-3 py-1 rounded-lg transition ${
                  pathname.startsWith("/products")
                    ? "bg-green-200"
                    : "bg-green-50 hover:bg-green-100 hover:shadow-lg"
                }`}
              >
                <div className="p-2">
                  <Package className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-gray-800 text-sm font-medium">
                  Products
                </span>
              </Link>

              <Link
                href="/cart"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition ${
                  pathname === "/cart"
                    ? "bg-green-200"
                    : "bg-green-50 hover:bg-green-100 hover:shadow-lg"
                }`}
              >
                <div className="p-2">
                  <ShoppingCart className="w-4 h-4 text-green-600" />
                </div>

                <span className="text-gray-800 text-sm font-medium flex items-center gap-2">
                  Cart
                  {count > 0 && (
                    <span className="bg-orange-500 text-white text-xs min-w-4.5 h-4.5 px-1 flex items-center justify-center rounded-md">
                      {count}
                    </span>
                  )}
                </span>
              </Link>

              <UserDropdown
                user={user}
                open={open}
                setOpen={setOpen}
                dropdownRef={dropdownRef}
                handleLogout={handleLogout}
                isAdmin={user?.roles?.includes("admin")}
              />
            </div>
          )}
        </div>

        {/* MOBILE */}
        <div className="flex md:hidden items-center gap-2 relative">
          {loading ? (
            <>
              <div className="p-2 rounded-md border bg-green-50 opacity-50 cursor-wait">
                <Box className="w-4 h-4 text-blue-600" />
              </div>

              <div className="bg-green-800 text-white p-2 rounded-md opacity-50 cursor-wait">
                <LogIn className="w-4 h-4" />
              </div>

              <button
                disabled
                className="p-2 bg-orange-500 text-white rounded-md opacity-50 cursor-wait"
              >
                <Menu size={15} />
              </button>

              <LoadingSpinner />
            </>
          ) : !user ? (
            <>
              <Link
                href="/products"
                className={`p-2 rounded-md border ${
                  pathname.startsWith("/products")
                    ? "bg-green-200"
                    : "bg-green-50 hover:bg-green-100 hover:shadow-lg"
                }`}
              >
                <Box className="w-4 h-4 text-blue-600" />
              </Link>

              <Link
                href="/login"
                className="bg-green-800 hover:bg-green-900 text-white p-2 rounded-md"
              >
                <LogIn className="w-4 h-4" />
              </Link>

              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md"
              >
                {menuOpen ? <X size={15} /> : <Menu size={15} />}
              </button>

              {menuOpen && (
                <div className="absolute top-12 right-0 w-56 bg-orange-50 border border-orange-100 rounded-xl shadow-lg p-3 space-y-2 z-50">
                  <Link
                    href="/cart"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-green-100 transition"
                  >
                    <ShoppingCart className="text-green-600" size={18} />
                    <span className="text-gray-800 text-sm font-medium">
                      Cart
                    </span>

                    {count > 0 && (
                      <span className="ml-auto text-xs bg-orange-500 text-white px-2 py-0.5 rounded">
                        {count}
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/blogs"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-green-100 transition"
                  >
                    <BookOpen className="text-yellow-600" size={18} />
                    <span className="text-gray-800 text-sm font-medium">
                      Blogs
                    </span>
                  </Link>

                  <Link
                    href="/calculator"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-green-100 transition"
                  >
                    <Calculator className="text-orange-600" size={18} />
                    <span className="text-gray-800 text-sm font-medium">
                      Calculator
                    </span>
                  </Link>

                  <Link
                    href="/testimonial"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-green-100 transition"
                  >
                    <Star className="text-amber-600" size={18} />
                    <span className="text-gray-800 text-sm font-medium">
                      Testimonials
                    </span>
                  </Link>
                </div>
              )}
            </>
          ) : (
            <>
              <Link
                href="/products"
                className={`p-2 rounded-md hover:bg-green-100 hover:shadow-lg ${
                  pathname.startsWith("/products")
                    ? "bg-green-200"
                    : "bg-green-50"
                }`}
              >
                <Package className="w-5 h-5 text-blue-600" />
              </Link>

              <Link
                href="/cart"
                className={`relative p-2 rounded-md hover:bg-green-100 hover:shadow-lg ${
                  pathname === "/cart" ? "bg-green-200" : "bg-green-50"
                }`}
              >
                <ShoppingCart className="w-5 h-5 text-green-600" />

                {count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {count}
                  </span>
                )}
              </Link>

              <UserDropdown
                user={user}
                open={open}
                setOpen={setOpen}
                dropdownRef={dropdownRef}
                handleLogout={handleLogout}
                mobile
                isAdmin={user?.roles?.includes("admin")}
              />
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
