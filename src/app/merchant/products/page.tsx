"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/merchant/product/PageHeader";
import { ProductFilters } from "@/components/merchant/product/ProductFilters";
import { ProductTable } from "@/components/merchant/product/ProductTable";
import { ProductTableSkeleton } from "@/components/merchant/product/ProductTableSkeleton";
import { EmptyState } from "@/components/merchant/product/EmptyState";
import { RejectionReasonModal } from "@/components/merchant/product/RejectionReasonModal";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  categoryName: string;
  price: number;
  stockQuantity: number;
  status: "approved" | "pending" | "rejected";
  primaryImage: string | null;
  createdAt: string;
  rejectionReason?: string | null;
}

interface ApiResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function MerchantProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewReasonProduct, setViewReasonProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const itemsPerPage = 10;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);
      if (statusFilter !== "all") params.set("status", statusFilter);
      params.set("page", currentPage.toString());
      params.set("limit", itemsPerPage.toString());

      const res = await fetch(`/api/merchant/products?${params}`);
      const json: ApiResponse = await res.json();

      if (res.ok) {
        setProducts(json.data);
        setTotalPages(json.totalPages);
        setTotalProducts(json.total);
      } else {
        toast.error("Failed to load products");
      }
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, currentPage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const handleDelete = async (id: string) => {
    const productToDelete = products.find((p) => p.id === id);
    if (!productToDelete) return;

    setProducts((prev) => prev.filter((p) => p.id !== id));

    try {
      const res = await fetch(`/api/merchant/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete product");
      }

      toast.success("Product deactivated successfully");
      setTotalProducts((prev) => prev - 1);
    } catch {
      setProducts((prev) => [...prev, productToDelete]);
      toast.error("Failed to delete product");
    }
  };

  const handleViewReason = (product: Product) => {
    setViewReasonProduct(product);
  };

  if (loading && products.length === 0) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <PageHeader onAdd={() => router.push("/merchant/products/add")} />
        <div className="mb-6">
          <div className="h-11 w-48 bg-gray-200 rounded animate-pulse" />
        </div>
        <ProductTableSkeleton rows={5} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader onAdd={() => router.push("/merchant/products/add")} />

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <ProductFilters
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          statusValue={statusFilter}
          onStatusChange={setStatusFilter}
        />
      </div>

      {products.length === 0 ? (
        <EmptyState onAdd={() => router.push("/merchant/products/add")} />
      ) : (
        <>
          <ProductTable
            products={products}
            onEdit={(id) => router.push(`/merchant/products/edit/${id}`)}
            onDelete={handleDelete}
            onViewReason={handleViewReason}
          />

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, totalProducts)} of {totalProducts} products
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="flex items-center px-3 text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <RejectionReasonModal
        open={!!viewReasonProduct}
        onOpenChange={(open) => !open && setViewReasonProduct(null)}
        rejectionReason={viewReasonProduct?.rejectionReason || ""}
        onEdit={() => {
          if (viewReasonProduct) {
            router.push(`/merchant/products/edit/${viewReasonProduct.id}`);
          }
        }}
      />
    </div>
  );
}