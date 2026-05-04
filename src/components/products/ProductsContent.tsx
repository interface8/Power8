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
  hasMore?: boolean;
  loadMore?: () => void;
}

export default function ProductsContent({
  products,
  loading,
  categories,
  companies,
  onAddToCart,
  fetchProducts,
  hasMore = false,
  loadMore,
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

      {/* Load More Button */}
      {!loading && hasMore && loadMore && (
        <div className="flex justify-center mt-12 mb-12">
          <button
            onClick={loadMore}
            className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition"
          >
            Load More Products
          </button>
        </div>
      )}
      
      {/* End of products message */}
      {!loading && !hasMore && products.length > 0 && (
        <div className="text-center mt-12 text-gray-500">
          You&apos;ve reached the end
        </div>
      )}
    </>
  );
}