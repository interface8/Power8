import { useState, useEffect, useCallback, useRef } from "react";
import type { Blog, BlogFilters } from "@/types/blogs";

export function useBlogs(filters?: BlogFilters) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const fetchBlogs = useCallback(async (overrideFilters?: BlogFilters) => {
    const f = overrideFilters ?? filtersRef.current;
    const params = new URLSearchParams();
    if (f?.search) params.set("search", f.search);
    if (f?.categoryId) params.set("categoryId", f.categoryId);
    if (f?.companyId) params.set("companyId", f.companyId);
    if (f?.published != null) params.set("published", String(f.published));

    const url = `/api/blogs${params.toString() ? `?${params}` : ""}`;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(url);
      const json = await res.json();

      if (!res.ok) {
        setError(json.message ?? "Failed to fetch blogs");
        return;
      }

      setBlogs(json.data ?? []);
    } catch {
      setError("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return { blogs, loading, error, fetchBlogs };
}

export function useBlog(idOrSlug: string, bySlug = false) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchBlog = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const url = bySlug ? `/api/blogs/slug/${idOrSlug}` : `/api/blogs/${idOrSlug}`;
      const res = await fetch(url);
      const json = await res.json();

      if (!res.ok) {
        setError(json.message ?? "Blog not found");
        return;
      }

      setBlog(json.data ?? null);
    } catch {
      setError("Failed to fetch blog");
    } finally {
      setLoading(false);
    }
  }, [idOrSlug, bySlug]);

  useEffect(() => {
    if (idOrSlug) fetchBlog();
  }, [idOrSlug, fetchBlog]);

  return { blog, loading, error, refetch: fetchBlog };
}
