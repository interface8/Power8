"use-client"
import { useState, useEffect, useCallback } from "react";
import { ProductDto } from "@/modules/products";

export function useProductDetails(productId: string) {  
  const [product, setProduct] = useState<ProductDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProductDetails = useCallback(async () => {
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
    } catch {
      setError("Failed to fetch product details");
    } finally {
      setLoading(false);
    }
  }, [productId]); // ← Keep productId here (it's used inside)

  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]); // ← Add fetchProductDetails here

  return { product, loading, error, fetchProductDetails };
}