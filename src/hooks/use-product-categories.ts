import { useState, useEffect, useCallback } from "react";
import type { ProductCategory } from "@/types/products";

export function useProductCategories() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/product-categories");
      const json = await res.json();

      if (!res.ok) {
        setError(json.message ?? "Failed to fetch categories");
        return;
      }

      setCategories(json.data ?? []);
    } catch {
      setError("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, fetchCategories };
}
