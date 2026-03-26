"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import ProductSearch from "./ProductSearch";
import ProductList from "./ProductList";
import type { Product, ProductCategory, Company, ProductFilters } from "@/types/products";

interface ProductsContentProps {
  products: Product[];
  loading: boolean;
  categories: ProductCategory[];
  companies: Company[];
  onAddToCart: (productId: string, quantity?: number) => Promise<boolean>;
  fetchProducts: (filters?: ProductFilters) => Promise<void>;
}

export default function ProductsContent({
  products,
  loading,
  categories,
  companies,
  onAddToCart,
  fetchProducts,
}: ProductsContentProps) {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [companyId, setCompanyId] = useState("");

  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const triggerFetch = useCallback(
    (s: string, catId: string, compId: string) => {
      fetchProducts({
        search: s || undefined,
        categoryId: catId || undefined,
        companyId: compId || undefined,
      });
    },
    [fetchProducts],
  );

  // Refetch when category or company changes (instant)
  useEffect(() => {
    triggerFetch(search, categoryId, companyId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, companyId]);

  // Debounced search
  const handleSearchChange = (value: string) => {
    setSearch(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      triggerFetch(value, categoryId, companyId);
    }, 400);
  };

  return (
    <>
      <ProductSearch
        categories={categories}
        companies={companies}
        search={search}
        selectedCategoryId={categoryId}
        selectedCompanyId={companyId}
        onSearchChange={handleSearchChange}
        onCategoryChange={setCategoryId}
        onCompanyChange={setCompanyId}
      />
      <ProductList products={products} loading={loading} onAddToCart={onAddToCart} />
    </>
  );
}
