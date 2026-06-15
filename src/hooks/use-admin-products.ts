import { useState, useEffect, useCallback } from "react";
import type { Product } from "@/types/products";

export function useAdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProducts = useCallback(async (filters?: {
    search?: string;
    categoryId?: string;
    limit?: number;
  }) => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      if (filters?.search) params.set("search", filters.search);
      if (filters?.categoryId) params.set("categoryId", filters.categoryId);
      if (filters?.limit) params.set("limit", String(filters.limit));
      
      // Default to fetching all products (no pagination limit for admin)
      if (!filters?.limit) params.set("limit", "999");

      const res = await fetch(`/api/admin/products?${params}`);
      const json = await res.json();

      if (!res.ok) {
        setError(json.message ?? "Failed to fetch products");
        return;
      }

      setProducts(json.data ?? []);
    } catch {
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts({ limit: 999 });
  }, [fetchProducts]);

  return { products, loading, error, fetchProducts };
}