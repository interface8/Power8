import { useState, useEffect, useCallback } from "react";
import type { Product } from "@/types/products";

// interface Product {
//   id: string;
//   name: string;
//   price: number;
//   description: string;
//   stockQuantity: number;
//   imageUrl: string | null;
//   categoryName: string;
//   companyName: string;
//   warranty: number;
//   capacity: number;
// }

export default function useProductDetails(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!id) return;
  console.log("Fetching product with ID:", id);
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/products/${id}`);
      const data = await response.json();
        console.log("API Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch product");
      }

      setProduct(data.data);
    } catch (err) {
          console.error("Error fetching product:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return { product, loading, error, fetchProduct };
}
