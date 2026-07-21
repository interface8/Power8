import { useState, useEffect, useCallback, useRef } from "react";
import type { Product, ProductFilters } from "@/types/products";
import { ProductDto } from "@/modules/products";

interface Pagination {
  total: number;
  totalPages: number;
}

export function useProducts(filters?: ProductFilters) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasFetched, setHasFetched] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    totalPages: 0,
  });

  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const fetchProducts = useCallback(
    async (overrideFilters?: ProductFilters) => {
      const f = overrideFilters ?? filtersRef.current;
      const params = new URLSearchParams();
      if (f?.search) params.set("search", f.search);
      if (f?.categoryId) params.set("categoryId", f.categoryId);
      if (f?.companyId) params.set("companyId", f.companyId);
      if (f?.minCapacity != null)
        params.set("minCapacity", String(f.minCapacity));
      params.set("page", String(f?.page ?? 1));
      params.set("limit", "12");

      const url = `/api/products?${params}`;

      setLoading(true);
      setError("");

      try {
        const res = await fetch(url);
        const json = await res.json();

        if (!res.ok) {
          setError(json.message ?? "Failed to fetch products");
          setProducts([]);
          setPagination({ total: 0, totalPages: 0 });
          return;
        }

        setProducts(json.data ?? []);
        setPagination({
          total: json.total ?? 0,
          totalPages: json.totalPages ?? 0,
        });
      } catch {
        setError("Failed to fetch products");
        setProducts([]);
        setPagination({ total: 0, totalPages: 0 });
      } finally {
        setLoading(false);
        setHasFetched(true);
      }
    },
    [],
  );

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, fetchProducts, pagination, hasFetched };
}

export function useProductDetails(productId: string) {
  const [product, setProduct] = useState<ProductDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProductDetails = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/products/${productId}`);
      const json = await res.json();
      if (!res.ok) {
        setError(json.message ?? "Failed to fetch product details");
        setProduct(null);
        return;
      }
      setProduct(json.data as ProductDto);
    } catch {
      setError("Failed to fetch product details");
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);

  return { product, loading, error, fetchProductDetails };
}
