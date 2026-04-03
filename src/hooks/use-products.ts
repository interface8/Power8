import { useState, useEffect, useCallback, useRef } from "react";
import type { Product, ProductFilters } from "@/types/products";
import { ca } from "zod/v4/locales";
import { ProductDto } from "@/modules/products";

export function useProducts(filters?: ProductFilters) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const fetchProducts = useCallback(async (overrideFilters?: ProductFilters) => {
    const f = overrideFilters ?? filtersRef.current;
    const params = new URLSearchParams();
    if (f?.search) params.set("search", f.search);
    if (f?.categoryId) params.set("categoryId", f.categoryId);
    if (f?.companyId) params.set("companyId", f.companyId);
    if (f?.minCapacity != null) params.set("minCapacity", String(f.minCapacity));

    const url = `/api/products${params.toString() ? `?${params}` : ""}`;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(url);
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
    fetchProducts();
  }, [fetchProducts]);
 
  return { products, loading, error, fetchProducts };
}

export function useProductDetails(productId: string) {  
  const [product, setProduct] = useState<ProductDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

   const fetchProductDetails = useCallback(async (productId: string) => {
    setLoading(true);
    setError("");

    try {

      const res = await fetch(`/api/products/${productId}`);
      const json = await res.json();
      if (!res.ok) {
        setError(json.message ?? "Failed to fetch product details");
        return;
      }
      setProduct(json.data as ProductDto);

    }catch {
      setError("Failed to fetch product details");
    }finally{
      setLoading(false);
    }

   }, [productId]);

   useEffect(() => {
     fetchProductDetails(productId);
   }, []);

   return { product, loading, error, fetchProductDetails };
}
