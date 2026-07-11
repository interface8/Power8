"use client";

import { useState, useEffect, useCallback } from "react";
import { useProductCategories } from "@/hooks/use-product-categories";
import { useCompanies } from "@/hooks/use-companies";
import type { Product } from "@/types/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import ProductModal from "./component/ProductModal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export default function AdminProductsPage() {
  const { categories } = useProductCategories();
  const { companies } = useCompanies();

  const [products, setProducts] = useState<Product[]>([]);
  const updateProductLocally = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === id ? { ...product, ...updates } : product
    ));
  };
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStock, setSelectedStock] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const itemsPerPage = 8;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearchTerm) params.set("search", debouncedSearchTerm);
      if (selectedCategory !== "all") params.set("categoryId", selectedCategory);
      params.set("page", "1");
      params.set("limit", "100");

      const res = await fetch(`/api/admin/products?${params}`);
      const json = await res.json();

      if (res.ok) {
        setProducts(json.data ?? []);
      } else {
        toast.error(json.message || "Failed to fetch products");
      }
    } catch {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, selectedCategory]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchProducts();
  }, [debouncedSearchTerm, selectedCategory, fetchProducts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStock]);

  const filteredProducts = products.filter((product) => {
    if (selectedStock === "in_stock") return product.stockQuantity >= 5;
    if (selectedStock === "low_stock")
      return product.stockQuantity > 0 && product.stockQuantity < 5;
    if (selectedStock === "out_of_stock") return product.stockQuantity === 0;
    return true;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const toggleProductStatus = async (product: Product) => {
    const newStatus = !product.isActive;
    
    // Update UI instantly
    updateProductLocally(product.id, { isActive: newStatus });
    
    const toastId = toast.loading("Updating status...");
    
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newStatus }),
      });
      
      if (!res.ok) {
        updateProductLocally(product.id, { isActive: product.isActive });
        throw new Error("Failed to update status");
      }
      
      toast.success(newStatus ? "Product activated" : "Product deactivated", { id: toastId });
      
    } catch {
      toast.error("Failed to update status", { id: toastId });
      updateProductLocally(product.id, { isActive: product.isActive });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      const res = await fetch(`/api/products/${productToDelete.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Product deleted");
        fetchProducts();
      } else {
        toast.error("Failed to delete");
      }
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const openDeleteDialog = (id: string, name: string) => {
    setProductToDelete({ id, name });
    setDeleteDialogOpen(true);
  };

  const getStockDisplay = (stock: number) => {
    if (stock === 0) return "Out of stock";
    if (stock < 5) return `${stock} (low)`;
    return stock.toString();
  };

  const SkeletonRow = () => (
    <TableRow className="animate-pulse">
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-md" />
          <div className="h-5 bg-gray-200 rounded w-32" />
        </div>
      </TableCell>
      <TableCell>
        <div className="h-5 bg-gray-200 rounded w-24" />
      </TableCell>
      <TableCell>
        <div className="h-5 bg-gray-200 rounded w-20" />
      </TableCell>
      <TableCell>
        <div className="h-5 bg-gray-200 rounded w-16" />
      </TableCell>
      <TableCell>
        <div className="w-10 h-5 bg-gray-200 rounded-full" />
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded" />
          <div className="w-8 h-8 bg-gray-200 rounded" />
        </div>
      </TableCell>
    </TableRow>
  );

  const SkeletonCard = () => (
    <div className="bg-white rounded-lg border p-4 animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-gray-200 rounded-md" />
        <div className="h-5 bg-gray-200 rounded w-32" />
      </div>
      <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-20 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-16 mb-3" />
      <div className="flex justify-between items-center">
        <div className="w-10 h-5 bg-gray-200 rounded-full" />
        <div className="flex gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded" />
          <div className="w-8 h-8 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Products</h1>

        {/* Desktop Skeleton */}
        <div className="hidden md:block">
          <div className="flex flex-col sm:flex-row gap-3 mb-6 items-center">
            <div className="flex-1 bg-white rounded-lg border p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 h-11 bg-gray-200 rounded animate-pulse" />
                <div className="w-44 h-11 bg-gray-200 rounded animate-pulse" />
                <div className="w-36 h-11 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
            <div className="w-36 h-11 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="border rounded-lg overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-base font-semibold">PRODUCT</TableHead>
                    <TableHead className="text-base font-semibold">MERCHANT</TableHead>
                    <TableHead className="text-base font-semibold">CATEGORY</TableHead>
                    <TableHead className="text-base font-semibold">PRICE</TableHead>
                    <TableHead className="text-base font-semibold">STOCK</TableHead>
                    <TableHead className="text-base font-semibold">STATUS</TableHead>
                    <TableHead className="text-base font-semibold w-24">ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(5)].map((_, i) => (
                    <SkeletonRow key={i} />
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Mobile Skeleton */}
        <div className="md:hidden space-y-4">
          <div className="flex flex-col gap-3 mb-6">
            <div className="h-11 bg-gray-200 rounded animate-pulse" />
            <div className="h-11 bg-gray-200 rounded animate-pulse" />
            <div className="h-11 bg-gray-200 rounded animate-pulse" />
            <div className="h-11 bg-gray-200 rounded animate-pulse w-36" />
          </div>
          {[...Array(3)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Products</h1>

      {/* Filters Row - Responsive */}
      <div className="flex flex-col md:flex-row gap-3 mb-6 items-start md:items-center">
        <div className="flex-1 w-full bg-white rounded-lg border p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full h-11 text-base"
              />
            </div>

            <div className="w-full sm:w-44">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="h-11 text-base w-full">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-36">
              <Select value={selectedStock} onValueChange={setSelectedStock}>
                <SelectTrigger className="h-11 text-base w-full">
                  <SelectValue placeholder="All Stock" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stock</SelectItem>
                  <SelectItem value="in_stock">In Stock (&ge;5)</SelectItem>
                  <SelectItem value="low_stock">Low Stock (&lt;5)</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="shrink-0 w-full md:w-auto">
          <Button
            onClick={() => {
              setEditingProduct(null);
              setModalOpen(true);
            }}
            className="bg-orange-500 hover:bg-orange-600 whitespace-nowrap h-11 text-base px-6 w-full md:w-auto"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Desktop Table View - Horizontal scroll on mobile */}
      <div className="hidden md:block border rounded-lg overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-base font-semibold">PRODUCT</TableHead>
                    <TableHead className="text-base font-semibold">MERCHANT</TableHead>
                  <TableHead className="text-base font-semibold">CATEGORY</TableHead>
                  <TableHead className="text-base font-semibold">PRICE</TableHead>
                  <TableHead className="text-base font-semibold">STOCK</TableHead>
                  <TableHead className="text-base font-semibold">STATUS</TableHead>
                  <TableHead className="text-base font-semibold w-24">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-gray-500 text-base">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedProducts.map((product) => (
                    <TableRow key={product.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {product.imageUrl ? (
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="w-10 h-10 rounded-md object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                              <span className="text-gray-400 text-xs">No img</span>
                            </div>
                          )}
                          <span className="font-medium text-base">{product.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-base text-gray-700">
                        {product.merchantName ?? "In-house"}
                      </TableCell>
                      <TableCell className="text-base">{product.categoryName}</TableCell>
                      <TableCell className="text-base">₦{product.price.toLocaleString()}</TableCell>
                      <TableCell className={`text-base ${product.stockQuantity < 5 && product.stockQuantity > 0 ? "text-orange-600 font-medium" : product.stockQuantity === 0 ? "text-red-500 font-medium" : ""}`}>
                        {getStockDisplay(product.stockQuantity)}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={product.isActive}
                          onCheckedChange={() => toggleProductStatus(product)}
                          className="data-[state=checked]:bg-orange-500 bg-gray-300"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingProduct(product);
                              setModalOpen(true);
                            }}
                            className="h-9 w-9 p-0 hover:bg-orange-100"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteDialog(product.id, product.name)}
                            className="h-9 w-9 p-0 hover:bg-red-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {paginatedProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <p className="text-gray-500 text-base">No products found</p>
          </div>
        ) : (
          paginatedProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg border p-4 shadow-sm">
              <div className="flex items-start gap-3">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center shrink-0">
                    <span className="text-gray-400 text-xs">No img</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base text-gray-900 truncate">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Merchant: {product.merchantName ?? "In-house"}
                  </p>
                  <p className="text-sm text-gray-500">{product.categoryName}</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    ₦{product.price.toLocaleString()}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-sm ${product.stockQuantity < 5 && product.stockQuantity > 0 ? "text-orange-600 font-medium" : product.stockQuantity === 0 ? "text-red-500 font-medium" : "text-gray-600"}`}>
                      {getStockDisplay(product.stockQuantity)}
                    </span>
                    <Switch
                      checked={product.isActive}
                      onCheckedChange={() => toggleProductStatus(product)}
                      className="data-[state=checked]:bg-orange-500 bg-gray-300 scale-90"
                    />
                  </div>
                  <div className="flex gap-2 mt-3 pt-2 border-t border-gray-100">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingProduct(product);
                        setModalOpen(true);
                      }}
                      className="flex-1 h-8 px-2 hover:bg-orange-100 hover:text-orange-600"
                    >
                      <Pencil className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDeleteDialog(product.id, product.name)}
                      className="flex-1 h-8 px-2 hover:bg-red-100 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination - Responsive */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
          <div className="text-sm text-gray-500 text-center sm:text-left order-2 sm:order-1">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of{" "}
            {filteredProducts.length} products
          </div>
          <div className="flex gap-2 order-1 sm:order-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <span className="flex items-center px-3 text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="gap-1"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <ProductModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        product={editingProduct}
        onSuccess={() => {
          fetchProducts();
          setEditingProduct(null);
        }}
        categories={categories}
        companies={companies}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Product"
        description={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}