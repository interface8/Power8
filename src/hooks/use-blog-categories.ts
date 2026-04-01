import { useState, useEffect, useCallback } from "react";
import type { BlogCategory } from "@/types/blogs";

export function useBlogCategories() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/blog-categories");
      const json = await res.json();

      if (!res.ok) {
        setError(json.message ?? "Failed to fetch blog categories");
        return;
      }

      setCategories(json.data ?? []);
    } catch {
      setError("Failed to fetch blog categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, fetchCategories };
}
