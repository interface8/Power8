import { useState, useEffect, useCallback } from "react";
import type { BundleDto } from "@/modules/bundles/types";

export function useBundles() {
  const [bundles, setBundles] = useState<BundleDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBundles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/bundles");
      const json = await res.json();
      if (res.ok) {
        setBundles(json.data ?? []);
      } else {
        setError(json.message || "Failed to load bundles");
      }
    } catch {
      setError("Failed to load bundles");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBundles();
  }, [fetchBundles]);

  return { bundles, loading, error, fetchBundles };
}