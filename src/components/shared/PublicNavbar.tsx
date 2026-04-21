"use client";

import Link from "next/link";
import { LogIn, Calculator, Sun, ShoppingCart, Star, BookOpen, Package } from "lucide-react";
import { usePathname } from "next/navigation";

export default function PublicNavbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-orange-500 p-2 rounded-xl shadow">
            <Sun className="text-white" size={30} />
          </div>
          <span className="text-xl text-orange-600 font-bold">Power - 8</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-4">
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
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition ${
              pathname === "/cart"
                ? "bg-green-200 text-black"
                : "bg-green-50 hover:bg-green-200 hover:shadow-lg text-black"
            }`}
          >
            <ShoppingCart size={16} />
            Cart
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
        </div>

        {/* Mobile links */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/products"
            className="bg-green-50 hover:bg-green-200 text-black p-2 rounded-md border border-gray-200"
          >
            <ShoppingCart size={18} />
          </Link>

          <Link
            href="/cart"
            className="bg-green-50 hover:bg-green-200 text-black p-2 rounded-md"
          >
            <ShoppingCart size={18} />
          </Link>

          <Link
            href="/testimonial"
            className="border-2 border-orange-400 text-orange-600 p-2 rounded-md"
          >
            <Star size={18} />
          </Link>

          <Link
            href="/blogs"
            className="border-2 border-orange-400 text-orange-600 p-2 rounded-md"
          >
            <BookOpen size={18} />
          </Link>

          <Link
            href="/calculator"
            className="bg-green-50 hover:bg-green-200 text-black p-2 rounded-md border border-gray-200"
          >
            <Calculator size={18} />
          </Link>

          <Link
            href="/login"
            className="border p-2 text-white bg-green-950 hover:bg-green-900 rounded-md"
          >
            <LogIn size={18} />
          </Link>
        </div>
      </div>
    </nav>
  );
}
