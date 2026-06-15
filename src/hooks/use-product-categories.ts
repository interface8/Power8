// import { useState, useEffect, useCallback } from "react";
// import type { ProductCategory } from "@/types/products";

// export function useProductCategories() {
//   const [categories, setCategories] = useState<ProductCategory[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const fetchCategories = useCallback(async () => {
//     setLoading(true);
//     setError("");

//     try {
//       const res = await fetch("/api/product-categories");
//       const json = await res.json();

//       if (!res.ok) {
//         setError(json.message ?? "Failed to fetch categories");
//         return;
//       }

//       setCategories(json.data ?? []);
//     } catch {
//       setError("Failed to fetch categories");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchCategories();
//   }, [fetchCategories]);

//   return { categories, loading, error, fetchCategories };
// }



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

  // Update a single category locally (optimistic update)
  const updateCategoryLocally = useCallback((id: string, updates: Partial<ProductCategory>) => {
    setCategories(prev => prev.map(cat => 
      cat.id === id ? { ...cat, ...updates } : cat
    ));
  }, []);

  // Add a new category locally
  const addCategoryLocally = useCallback((category: ProductCategory) => {
    setCategories(prev => [category, ...prev]);
  }, []);

  // Remove a category locally
  const removeCategoryLocally = useCallback((id: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { 
    categories, 
    loading, 
    error, 
    fetchCategories,
    updateCategoryLocally,
    addCategoryLocally,
    removeCategoryLocally,
  };
}