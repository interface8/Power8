"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { useBlogs, useBlogStats, useDeleteBlog, usePublishBlog, useUnpublishBlog, useUpdateBlog, useCategories, useCreateBlog } from "@/hooks/use-admin-blogs";
import { BlogStatsCards } from "./BlogStats";
import { BlogTable } from "@/components/admin/blogs/BlogTable";
import { BlogEditModal } from "@/components/admin/blogs/BlogEditModal";
import { BlogCreateModal } from "@/components/admin/blogs/BlogCreateModal";
import { ConfirmationModal } from "./ConfirmationModal";
import { Blog, CreateBlogData } from "@/types/admin-blog";
import { useDebounceValue } from "usehooks-ts";

export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounceValue(search, 500);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  
  // Edit modal state
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Create modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Delete confirmation state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    blogId: string | null;
    blogTitle: string;
  }>({
    isOpen: false,
    blogId: null,
    blogTitle: "",
  });

  const { data: statsData } = useBlogStats();
  const { data: categoriesData } = useCategories();
  const { data, isLoading } = useBlogs({
    page,
    limit: 10,
    search: debouncedSearch,
    isPublished: statusFilter ? statusFilter === "published" : undefined,
  });
  
  const deleteBlog = useDeleteBlog();
  const publishBlog = usePublishBlog();
  const unpublishBlog = useUnpublishBlog();
  const updateBlog = useUpdateBlog();
  const createBlog = useCreateBlog();

  const blogs = data?.data || [];
  const pagination = data?.pagination;
  const categories = categoriesData?.data || [];

  const handleTogglePublish = async (blog: Blog) => {
    if (blog.isPublished) {
      await unpublishBlog.mutateAsync(blog.id);
    } else {
      await publishBlog.mutateAsync(blog.id);
    }
  };

  const handleDeleteClick = (blog: Blog) => {
    setDeleteModal({
      isOpen: true,
      blogId: blog.id,
      blogTitle: blog.title,
    });
  };

  const handleConfirmDelete = async () => {
    if (deleteModal.blogId) {
      await deleteBlog.mutateAsync(deleteModal.blogId);
      setDeleteModal({ isOpen: false, blogId: null, blogTitle: "" });
    }
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (id: string, data: CreateBlogData) => {
    await updateBlog.mutateAsync({ id, data });
  };

  const handleCreate = async (data: CreateBlogData) => {
    await createBlog.mutateAsync(data);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-sm text-gray-500 mt-1">Create, edit, and manage blog posts</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-orange-600"
        >
          <Plus className="h-4 w-4" />
          New Blog Post
        </button>
      </div>

      {/* Stats Cards */}
      {statsData && <BlogStatsCards stats={statsData} />}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-lg border border-gray-200 bg-white px-4 text-sm focus:border-orange-400 focus:outline-none"
        >
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Blog Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
        </div>
      ) : (
        <>
          <BlogTable
            blogs={blogs}
            onDelete={handleDeleteClick}
            onTogglePublish={handleTogglePublish}
            onEdit={handleEdit}
            isDeleting={deleteBlog.isPending}
            isToggling={publishBlog.isPending || unpublishBlog.isPending}
          />

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between gap-4 pt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-500">
                Page {page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Edit Modal */}
      <BlogEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingBlog(null);
        }}
        blog={editingBlog}
        categories={categories}
        onUpdate={handleUpdate}
        isUpdating={updateBlog.isPending}
      />

      {/* Create Modal */}
      <BlogCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        categories={categories}
        onCreate={handleCreate}
        isCreating={createBlog.isPending}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, blogId: null, blogTitle: "" })}
        onConfirm={handleConfirmDelete}
        title="Delete Blog Post"
        message={`Are you sure you want to delete "${deleteModal.blogTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleteBlog.isPending}
        variant="danger"
      />
    </div>
  );
}