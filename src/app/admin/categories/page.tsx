"use client";

import { useState } from "react";
import { useProductCategories } from "@/hooks/use-product-categories";
import type { ProductCategory } from "@/types/products";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, FolderTree, Calendar, Search, ChevronLeft, ChevronRight, X, Copy, Check, Trash, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface CategoryFormData {
  name: string;
  description: string;
  sort: number;
  isActive: boolean;
}

interface DeletedCategory {
  id: string;
  name: string;
  description: string | null;
  sort: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CategoriesPage() {
  const { categories, loading, error, fetchCategories, updateCategoryLocally } = useProductCategories();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<ProductCategory | null>(null);
  const [deletingMultiple, setDeletingMultiple] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
    sort: 0,
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{ name?: string; sort?: string }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const resetForm = () => {
    setFormData({ name: "", description: "", sort: 0, isActive: true });
    setFormErrors({});
    setEditingCategory(null);
  };

  const openAddModal = () => {
    resetForm();
    setModalOpen(true);
  };

  const openEditModal = (category: ProductCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      sort: category.sort,
      isActive: category.isActive,
    });
    setModalOpen(true);
  };

  const validateForm = (): boolean => {
    const errors: { name?: string; sort?: string } = {};
    if (!formData.name.trim()) {
      errors.name = "Category name is required";
    }
    if (formData.sort === undefined || formData.sort === null) {
      errors.sort = "Sort order is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const url = editingCategory
        ? `/api/product-categories/${editingCategory.id}`
        : "/api/product-categories";
      const method = editingCategory ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          sort: formData.sort,
          isActive: formData.isActive,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to save category");
      }

      toast.success(editingCategory ? "Category updated" : "Category created");
      setModalOpen(false);
      resetForm();
      await fetchCategories();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

const toggleActiveStatus = async (category: ProductCategory) => {
  const newStatus = !category.isActive;
  
  // THIS USES updateCategoryLocally - instant UI update
  updateCategoryLocally(category.id, { isActive: newStatus });
  
  const toastId = toast.loading("Updating status...");
  
  try {
    const res = await fetch(`/api/product-categories/${category.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: newStatus }),
    });

    if (!res.ok) {
      // Revert on error
      updateCategoryLocally(category.id, { isActive: category.isActive });
      throw new Error("Failed to update status");
    }

    toast.success(newStatus ? "Category activated" : "Category deactivated", { id: toastId });
    
  } catch {
    toast.error("Failed to update status", { id: toastId });
    updateCategoryLocally(category.id, { isActive: category.isActive });
  }
};
  const undoDelete = async (deletedCategory: DeletedCategory, toastId: string | number) => {
    try {
      const res = await fetch("/api/product-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: deletedCategory.name,
          description: deletedCategory.description,
          sort: deletedCategory.sort,
          isActive: deletedCategory.isActive,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to restore category");
      }

      await fetchCategories();
      toast.dismiss(toastId);
      toast.success(`Category "${deletedCategory.name}" restored`);
    } catch {
      toast.error("Failed to restore category");
    }
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;

    setIsSubmitting(true);

    const deletedData: DeletedCategory = {
      id: deletingCategory.id,
      name: deletingCategory.name,
      description: deletingCategory.description,
      sort: deletingCategory.sort,
      isActive: deletingCategory.isActive,
      createdAt: deletingCategory.createdAt,
      updatedAt: deletingCategory.updatedAt,
    };

    try {
      const res = await fetch(`/api/product-categories/${deletingCategory.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete category");
      }

      await fetchCategories();
      setDeletingCategory(null);
      
      toast.custom((t) => (
        <div className="flex items-center justify-between gap-4 bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-4 min-w-[300px]">
          <span className="text-sm">Category {deletedData.name} deleted</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => undoDelete(deletedData, t)}
            className="h-8 text-orange-600 border-orange-300 hover:bg-orange-50"
          >
            Undo
          </Button>
        </div>
      ), { duration: 5000 });
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCategories.size === 0) return;

    setIsSubmitting(true);

    try {
      const deletePromises = Array.from(selectedCategories).map((id) =>
        fetch(`/api/product-categories/${id}`, { method: "DELETE" })
      );

      const results = await Promise.all(deletePromises);
      const failed = results.filter((res) => !res.ok);

      if (failed.length > 0) {
        toast.error(`Failed to delete ${failed.length} categories`);
      } else {
        toast.success(`Deleted ${selectedCategories.size} categories successfully`);
      }

      setSelectedCategories(new Set());
      setDeletingMultiple(false);
      await fetchCategories();
    } catch {
      toast.error("Failed to delete categories");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSelectCategory = (id: string) => {
    const newSelected = new Set(selectedCategories);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedCategories(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedCategories.size === paginatedCategories.length) {
      setSelectedCategories(new Set());
    } else {
      setSelectedCategories(new Set(paginatedCategories.map((c) => c.id)));
    }
  };

  const copyCategoryName = async (name: string, id: string) => {
    try {
      await navigator.clipboard.writeText(name);
      setCopiedId(id);
      toast.success(`"${name}" copied to clipboard`);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  // Filter categories based on search term only (show ALL active + inactive)
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories = filteredCategories.slice(startIndex, startIndex + itemsPerPage);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
    setSelectedCategories(new Set());
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
    setSelectedCategories(new Set());
  };

  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Loading Skeleton for Desktop Table
  const TableSkeleton = () => (
    <div className="hidden md:block overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            <TableHead className="w-8" />
            <TableHead className="font-semibold">Name</TableHead>
            <TableHead className="font-semibold">Description</TableHead>
            <TableHead className="font-semibold w-24 text-center">Sort Order</TableHead>
            <TableHead className="font-semibold w-24 text-center">Status</TableHead>
            <TableHead className="font-semibold w-32">Date Created</TableHead>
            <TableHead className="font-semibold w-32 text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell><div className="h-4 w-4 bg-gray-200 rounded animate-pulse" /></TableCell>
              <TableCell><div className="h-5 bg-gray-200 rounded animate-pulse w-32" /></TableCell>
              <TableCell><div className="h-5 bg-gray-200 rounded animate-pulse w-48" /></TableCell>
              <TableCell><div className="h-5 bg-gray-200 rounded animate-pulse w-16 mx-auto" /></TableCell>
              <TableCell><div className="h-5 bg-gray-200 rounded animate-pulse w-16 mx-auto" /></TableCell>
              <TableCell><div className="h-5 bg-gray-200 rounded animate-pulse w-24" /></TableCell>
              <TableCell><div className="flex justify-center gap-2"><div className="h-8 w-8 bg-gray-200 rounded animate-pulse" /><div className="h-8 w-8 bg-gray-200 rounded animate-pulse" /><div className="h-8 w-8 bg-gray-200 rounded animate-pulse" /></div></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  // Loading Skeleton for Mobile Cards
  const MobileSkeleton = () => (
    <div className="md:hidden divide-y divide-gray-100">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2 flex-1">
              <div className="w-4 h-4 bg-gray-200 rounded" />
              <div className="w-2 h-2 rounded-full bg-gray-200" />
              <div className="h-5 bg-gray-200 rounded animate-pulse w-32" />
            </div>
            <div className="flex gap-1">
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-full mb-2" />
          <div className="flex items-center gap-3">
            <div className="h-5 bg-gray-200 rounded animate-pulse w-16" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
          </div>
        </div>
      ))}
    </div>
  );

  if (loading && categories.length === 0) {
    return (
      <div className="p-4 md:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mb-2" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-64" />
          </div>
          <div className="flex gap-2">
            <div className="h-10 bg-gray-200 rounded animate-pulse w-36" />
            <div className="h-10 bg-gray-200 rounded animate-pulse w-36" />
          </div>
        </div>
        <div className="mb-4">
          <div className="h-10 bg-gray-200 rounded animate-pulse max-w-sm" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-orange-100">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-24 mb-2" />
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-12" />
                </div>
                <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
        <TableSkeleton />
        <MobileSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="text-red-500 text-center">
          <p className="text-lg font-semibold">Error loading categories</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const activeCount = categories.filter(c => c.isActive).length;
  const inactiveCount = categories.filter(c => !c.isActive).length;

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Product Categories</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Manage categories for your solar products
          </p>
        </div>
        <Button
          onClick={openAddModal}
          className="bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Search and Items Per Page */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search categories by name..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9 pr-9 focus:ring-orange-500 focus:border-orange-500"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Show:</span>
          <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-500">per page</span>
        </div>
      </div>
      
      {searchTerm && (
        <p className="text-sm text-gray-500 mt-1 mb-4">
          Found {filteredCategories.length} of {categories.length} categories
        </p>
      )}

      {/* Bulk Delete Bar */}
      {selectedCategories.size > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trash className="w-4 h-4 text-orange-600" />
            <span className="text-sm text-gray-700">
              {selectedCategories.size} category(ies) selected
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedCategories(new Set())}
              className="border-gray-300"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => setDeletingMultiple(true)}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <Card className="border-orange-100 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Categories</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <FolderTree className="w-5 h-5 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-100 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-bold text-green-600">{activeCount}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Eye className="w-5 h-5 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Inactive</p>
              <p className="text-2xl font-bold text-gray-500">{inactiveCount}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-full">
              <EyeOff className="w-5 h-5 text-gray-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-blue-100 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="text-lg font-semibold text-gray-900">
                {categories.length > 0
                  ? new Date(
                      Math.max(...categories.map((c) => new Date(c.updatedAt).getTime()))
                    ).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories - Card view on mobile, Table on desktop */}
      <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="w-8">
                  <Checkbox
                    checked={paginatedCategories.length > 0 && selectedCategories.size === paginatedCategories.length}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Description</TableHead>
                <TableHead className="font-semibold w-24 text-center">Sort Order</TableHead>
                <TableHead className="font-semibold w-24 text-center">Status</TableHead>
                <TableHead className="font-semibold w-32">Date Created</TableHead>
                <TableHead className="font-semibold w-32 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <FolderTree className="w-12 h-12 text-gray-300" />
                      <p className="text-gray-500">
                        {searchTerm ? "No matching categories found" : "No categories found"}
                      </p>
                      {!searchTerm && (
                        <Button variant="outline" onClick={openAddModal} className="mt-2">
                          <Plus className="w-4 h-4 mr-2" />
                          Add your first category
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCategories.map((category) => (
                  <TableRow 
                    key={category.id} 
                    className={`hover:bg-orange-50/50 transition-colors cursor-pointer ${!category.isActive ? 'bg-gray-50 opacity-70' : ''}`}
                    onDoubleClick={() => openEditModal(category)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedCategories.has(category.id)}
                        onCheckedChange={() => toggleSelectCategory(category.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${category.isActive ? 'bg-orange-500' : 'bg-gray-400'}`} />
                        <span>{category.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyCategoryName(category.name, category.id);
                          }}
                          className="h-6 w-6 p-0 hover:bg-orange-100"
                          title="Copy category name"
                        >
                          {copiedId === category.id ? (
                            <Check className="w-3 h-3 text-green-600" />
                          ) : (
                            <Copy className="w-3 h-3 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600 max-w-xs truncate">
                      {category.description || "—"}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="bg-gray-100">
                        Sort: {category.sort}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={category.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}>
                        {category.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Switch
                          checked={category.isActive}
                          onCheckedChange={() => toggleActiveStatus(category)}
                          className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(category);
                          }}
                          className="hover:bg-orange-100 hover:text-orange-600"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingCategory(category);
                          }}
                          className="hover:bg-red-100 hover:text-red-600"
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

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-100">
          {paginatedCategories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <FolderTree className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-gray-500 text-center">
                {searchTerm ? "No matching categories found" : "No categories found"}
              </p>
              {!searchTerm && (
                <Button variant="outline" onClick={openAddModal} className="mt-3">
                  <Plus className="w-4 h-4 mr-2" />
                  Add your first category
                </Button>
              )}
            </div>
          ) : (
            paginatedCategories.map((category) => (
              <div 
                key={category.id} 
                className={`p-4 hover:bg-orange-50/50 transition-colors cursor-pointer ${!category.isActive ? 'bg-gray-50 opacity-70' : ''}`}
                onDoubleClick={() => openEditModal(category)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2 flex-1">
                    <div className={`w-2 h-2 rounded-full ${category.isActive ? 'bg-orange-500' : 'bg-gray-400'}`} />
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyCategoryName(category.name, category.id);
                      }}
                      className="h-6 w-6 p-0 hover:bg-orange-100"
                      title="Copy category name"
                    >
                      {copiedId === category.id ? (
                        <Check className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  <Badge className={category.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}>
                    {category.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                {category.description && (
                  <p className="text-sm text-gray-500 mb-2">{category.description}</p>
                )}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-3 text-xs">
                    <Badge variant="secondary" className="bg-gray-100 text-xs">
                      Sort: {category.sort}
                    </Badge>
                    <span className="text-gray-400">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <Switch
                      checked={category.isActive}
                      onCheckedChange={() => toggleActiveStatus(category)}
                      className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(category);
                      }}
                      className="h-8 w-8 p-0 hover:bg-orange-100 hover:text-orange-600"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingCategory(category);
                      }}
                      className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredCategories.length)} of {filteredCategories.length} categories
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="gap-1"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={deletingMultiple} onOpenChange={setDeletingMultiple}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Multiple Categories</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-red-600">{selectedCategories.size} categories</span>?
              <br />
              <br />
              This action <span className="font-semibold">cannot be undone</span>. Deleting these
              categories may affect products assigned to them.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              disabled={isSubmitting}
              className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
            >
              {isSubmitting ? "Deleting..." : "Yes, Delete All"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {editingCategory ? "Edit Category" : "Create Category"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Update the category details below."
                : "Fill in the details to create a new product category."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold">
                Category Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Solar Panels, Inverters, Batteries"
                className="focus:ring-orange-500 focus:border-orange-500"
              />
              {formErrors.name && (
                <p className="text-red-500 text-sm">{formErrors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold">
                Description <span className="text-gray-400 text-xs font-normal">(Optional)</span>
              </Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of this category"
                className="focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sort" className="text-sm font-semibold">
                Sort Order <span className="text-red-500">*</span>
              </Label>
              <Input
                id="sort"
                type="text"
                value={formData.sort === 0 ? "" : formData.sort}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    setFormData({ ...formData, sort: 0 });
                  } else {
                    const num = parseInt(value, 10);
                    if (!isNaN(num)) {
                      setFormData({ ...formData, sort: num });
                    }
                  }
                }}
                placeholder="1, 2, 3..."
                className="focus:ring-orange-500 focus:border-orange-500"
              />
              <p className="text-xs text-gray-500">
                Controls the order categories appear in dropdowns. Lower numbers appear first.
              </p>
              {formErrors.sort && (
                <p className="text-red-500 text-sm">{formErrors.sort}</p>
              )}
            </div>

            {/* Status Toggle in Modal - Only for Edit */}
            {editingCategory && (
              <div className="flex items-center justify-between pt-2">
                <Label htmlFor="modal-status" className="text-sm font-semibold">
                  Category Status
                </Label>
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${!formData.isActive ? 'text-gray-500' : 'text-green-600'}`}>
                    {formData.isActive ? "Active" : "Inactive"}
                  </span>
                  <Switch
                    id="modal-status"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isSubmitting ? "Saving..." : editingCategory ? "Update Category" : "Create Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Single Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingCategory} onOpenChange={() => setDeletingCategory(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-red-600">{deletingCategory?.name || "this category"}</span>?
              <br />
              <br />
              This action <span className="font-semibold">cannot be undone</span>. Deleting this
              category may affect products assigned to it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isSubmitting}
              className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
            >
              {isSubmitting ? "Deleting..." : "Yes, Delete Category"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}