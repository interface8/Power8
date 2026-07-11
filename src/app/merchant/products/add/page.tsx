"use client";

import { useRouter } from "next/navigation";
import { useProductCategories } from "@/hooks/use-product-categories";
import { ProductForm } from "@/components/merchant/product/ProductForm";
import { toast } from "sonner";

interface ProductSubmitData {
  name: string;
  description: string;
  categoryId: string;
  price: number;
  warranty: number;
  stockQuantity: number;
  capacity: number;
  isActive: boolean;
  images: string[];
}

export default function AddProductPage() {
  const router = useRouter();
  const { categories } = useProductCategories();

  const handleSubmit = async (data: ProductSubmitData) => {
    try {
      const res = await fetch("/api/merchant/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (res.ok) {
        toast.success("Product submitted for review");
        router.push("/merchant/products");
      } else {
        toast.error(json.message || "Failed to create product");
      }
    } catch {
      toast.error("Failed to create product");
    }
  };

  return (
    <ProductForm
      categories={categories}
      onSubmit={handleSubmit}
      onCancel={() => router.push("/merchant/products")}
    />
  );
}