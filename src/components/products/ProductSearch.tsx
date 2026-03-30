"use client";

import { Search, Funnel, ChevronDown, Building2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { ProductCategory, Company } from "@/types/products";

interface ProductSearchProps {
  categories: ProductCategory[];
  companies: Company[];
  search: string;
  selectedCategoryId: string;
  selectedCompanyId: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (categoryId: string) => void;
  onCompanyChange: (companyId: string) => void;
}

export default function ProductSearch({
  categories,
  companies,
  search,
  selectedCategoryId,
  selectedCompanyId,
  onSearchChange,
  onCategoryChange,
  onCompanyChange,
}: ProductSearchProps) {
  const [catOpen, setCatOpen] = useState(false);
  const [compOpen, setCompOpen] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);
  const compRef = useRef<HTMLDivElement>(null);

  const selectedCategoryName =
    categories.find((c) => c.id === selectedCategoryId)?.name ?? "All Categories";
  const selectedCompanyName =
    companies.find((c) => c.id === selectedCompanyId)?.name ?? "All Companies";

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
      if (compRef.current && !compRef.current.contains(e.target as Node)) setCompOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search products..."
          className="w-full h-11 pl-11 pr-4 rounded-xl bg-green-50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
      </div>

      {/* Category Filter */}
      <div className="relative min-w-[180px]" ref={catRef}>
        <button
          onClick={() => { setCatOpen(!catOpen); setCompOpen(false); }}
          className="w-full h-11 px-4 rounded-xl bg-green-50 text-sm flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Funnel size={16} className="text-gray-400" />
            <span className="truncate">{selectedCategoryName}</span>
            <ChevronDown size={16} className="text-gray-400" />
          </div>
        </button>

        {catOpen && (
          <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
            <div
              onClick={() => { onCategoryChange(""); setCatOpen(false); }}
              className="px-4 py-2 text-sm text-black cursor-pointer hover:bg-green-200 transition"
            >
              All Categories
            </div>
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => { onCategoryChange(cat.id); setCatOpen(false); }}
                className="px-4 py-2 text-sm text-black cursor-pointer hover:bg-green-200 transition"
              >
                {cat.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Company Filter */}
      <div className="relative min-w-[180px]" ref={compRef}>
        <button
          onClick={() => { setCompOpen(!compOpen); setCatOpen(false); }}
          className="w-full h-11 px-4 rounded-xl bg-green-50 text-sm flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Building2 size={16} className="text-gray-400" />
            <span className="truncate">{selectedCompanyName}</span>
            <ChevronDown size={16} className="text-gray-400" />
          </div>
        </button>

        {compOpen && (
          <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
            <div
              onClick={() => { onCompanyChange(""); setCompOpen(false); }}
              className="px-4 py-2 text-sm text-black cursor-pointer hover:bg-green-200 transition"
            >
              All Companies
            </div>
            {companies.map((comp) => (
              <div
                key={comp.id}
                onClick={() => { onCompanyChange(comp.id); setCompOpen(false); }}
                className="px-4 py-2 text-sm text-black cursor-pointer hover:bg-green-200 transition"
              >
                {comp.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
