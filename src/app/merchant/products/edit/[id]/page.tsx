"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useProductCategories } from "@/hooks/use-product-categories";
import { ProductForm } from "@/components/merchant/product/ProductForm";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  price: number;
  warranty: number;
  stockQuantity: number;
  capacity: string;
  isActive: boolean;
  status: "APPROVED" | "PENDING" | "REJECTED";
  rejectionReason: string | null;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
}

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

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const { categories } = useProductCategories();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/merchants/products/${productId}`);
        const json = await res.json();

        if (res.ok) {
          setProduct(json.data);
        } else {
          toast.error(json.message || "Product not found");
          router.push("/merchant/products");
        }
      } catch {
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, router]);

  const handleSubmit = async (data: ProductSubmitData) => {
    try {
      const res = await fetch(`/api/merchants/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (res.ok) {
        const message = json.requiresReapproval
          ? "Product updated and submitted for re-approval"
          : "Product updated successfully";
        toast.success(message);
        router.push("/merchant/products");
      } else {
        toast.error(json.message || "Failed to update product");
      }
    } catch {
      toast.error("Failed to update product");
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-32" />
          <div className="h-10 bg-gray-200 rounded w-48" />
          <div className="space-y-3">
            <div className="h-12 bg-gray-200 rounded" />
            <div className="h-24 bg-gray-200 rounded" />
            <div className="h-12 bg-gray-200 rounded" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-12 bg-gray-200 rounded" />
              <div className="h-12 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <ProductForm
      initialData={product}
      categories={categories}
      isEdit={true}
      status={product.status}
      rejectionReason={product.rejectionReason}
      existingImages={product.imageUrls || []}
      onSubmit={handleSubmit}
      onCancel={() => router.push("/merchant/products")}
    />
  );
}