import { useState, useEffect, useCallback } from "react";
import type { Company } from "@/types/products";

export function useCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/companies");
      const json = await res.json();

      if (!res.ok) {
        setError(json.message ?? "Failed to fetch companies");
        return;
      }

      setCompanies(json.data ?? []);
    } catch {
      setError("Failed to fetch companies");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  return { companies, loading, error, fetchCompanies };
}
