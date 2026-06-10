"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, FolderTree } from "lucide-react";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/use-admin-blogs";
import { CategoryModal } from "@/components/admin/blogs/CategoryModal";
import { ConfirmationModal } from "@/components/admin/blogs/ConfirmationModal";
import { BlogCategory } from "@/types/admin-blog";

export default function BlogCategoriesPage() {
  const { data, isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(
    null,
  );

  // Delete confirmation state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    categoryId: string | null;
    categoryName: string;
  }>({
    isOpen: false,
    categoryId: null,
    categoryName: "",
  });

  const categories = data?.data || [];

  const handleEdit = (category: BlogCategory) => {
    setEditingCategory(category);
    setModalOpen(true);
  };

  const handleDeleteClick = (category: BlogCategory) => {
    setDeleteModal({
      isOpen: true,
      categoryId: category.id,
      categoryName: category.name,
    });
  };

  const handleConfirmDelete = async () => {
    if (deleteModal.categoryId) {
      await deleteCategory.mutateAsync(deleteModal.categoryId);
      setDeleteModal({ isOpen: false, categoryId: null, categoryName: "" });
    }
  };

  const handleSubmit = async (formData: {
    name: string;
    description: string;
    sort: number;
  }) => {
    if (editingCategory) {
      await updateCategory.mutateAsync({
        id: editingCategory.id,
        data: formData,
      });
    } else {
      await createCategory.mutateAsync(formData);
    }
    setModalOpen(false);
    setEditingCategory(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Categories</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage categories for blog posts
          </p>
        </div>
        <button
          onClick={() => {
            setEditingCategory(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-orange-600"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-gray-200 bg-white">
          <div className="rounded-full bg-gray-100 p-3 mb-3">
            <FolderTree className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-gray-500">No categories yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Create your first blog category
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category: BlogCategory) => (
            <div
              key={category.id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-gray-400">
                    Sort order: {category.sort}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(category)}
                    className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(category)}
                    className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category Modal */}
      <CategoryModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingCategory(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingCategory}
        isSubmitting={createCategory.isPending || updateCategory.isPending}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, categoryId: null, categoryName: "" })
        }
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteModal.categoryName}"? Blog posts in this category will lose their category assignment.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleteCategory.isPending}
        variant="danger"
      />
    </div>
  );
}
