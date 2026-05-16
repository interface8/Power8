"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import ProductSearch from "./ProductSearch";
import ProductList from "./ProductList";
import type { Product, ProductCategory, Company, ProductFilters } from "@/types/products";

interface Pagination {
  total: number;
  totalPages: number;
}

interface ProductsContentProps {
  products: Product[];
  loading: boolean;
  categories: ProductCategory[];
  companies: Company[];
  onAddToCart: (productId: string, quantity?: number) => Promise<boolean>;
  fetchProducts: (filters?: ProductFilters) => Promise<void>;
  pagination: Pagination;
}

export default function ProductsContent({
  products,
  loading,
  categories,
  companies,
  onAddToCart,
  fetchProducts,
  pagination,
}: ProductsContentProps) {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [page, setPage] = useState(1);

  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const triggerFetch = useCallback(
    (s: string, catId: string, compId: string, p: number) => {
      fetchProducts({
        search: s || undefined,
        categoryId: catId || undefined,
        companyId: compId || undefined,
        page: p,
      });
    },
    [fetchProducts],
  );

  // Refetch when category or company changes (instant), reset page
  useEffect(() => {
    setPage(1);
    triggerFetch(search, categoryId, companyId, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, companyId]);

  // Debounced search, reset page
  const handleSearchChange = (value: string) => {
    setSearch(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      triggerFetch(value, categoryId, companyId, 1);
    }, 400);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    triggerFetch(search, categoryId, companyId, newPage);
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
      <ProductList
        products={products}
        loading={loading}
        onAddToCart={onAddToCart}
        page={page}
        totalPages={pagination.totalPages}
        total={pagination.total}
        onPageChange={handlePageChange}
      />
    </>
  );
}