"use client";

import { useState } from "react";
import { Plus, Search, ChevronDown, Check } from "lucide-react";
import {
  useBlogs,
  useBlogStats,
  useDeleteBlog,
  usePublishBlog,
  useUnpublishBlog,
  useUpdateBlog,
  useCategories,
  useCreateBlog,
} from "@/hooks/use-admin-blogs";
import { BlogStatsCards } from "./BlogStats";
import { BlogTable } from "@/components/admin/blogs/BlogTable";
import { BlogTableSkeleton } from "@/components/admin/blogs/BlogTableSkeleton";
import { BlogEditModal } from "@/components/admin/blogs/BlogEditModal";
import { BlogCreateModal } from "@/components/admin/blogs/BlogCreateModal";
import { ConfirmationModal } from "./ConfirmationModal";
import { Blog, CreateBlogData } from "@/types/admin-blog";
import { useDebounceValue } from "usehooks-ts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
];

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}

function FilterSelect({
  value,
  onChange,
  options,
  placeholder = "Select",
}: FilterSelectProps) {
  const selectedOption = options.find((option) => option.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="
            flex h-10 w-36
            items-center justify-between gap-3
            rounded-xl border border-gray-200
            bg-white px-4
            text-sm font-medium text-gray-700
            shadow-sm transition-all duration-200
            hover:border-orange-300
            hover:bg-orange-50/40
            focus:outline-none
            focus:ring-4
            focus:ring-orange-100
            active:scale-[0.98]
          "
        >
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate">
              {selectedOption?.label || placeholder}
            </span>
          </div>

          <ChevronDown className="h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={8}
        className="
          z-50 min-w-36
          rounded-xl border border-gray-200
          bg-white p-1.5 shadow-lg
        "
      >
        {options.map((option) => {
          const isActive = value === option.value;

          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onChange(option.value)}
              className={`
                flex cursor-pointer
                items-center justify-between
                rounded-lg px-3 py-2.5
                text-sm font-medium
                transition-all duration-150

                ${
                  isActive
                    ? "bg-orange-100 text-orange-700"
                    : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                }
              `}
            >
              <span>{option.label}</span>

              {isActive && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

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
  const { data, isLoading, error, refetch } = useBlogs({  // ✅ Added error and refetch
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

  // Handle error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-red-500 mb-4">Something went wrong</div>
        <p className="text-gray-500 mb-4">{error?.message || "An error occurred"}</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Create, edit, and manage blog posts
          </p>
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
        {/* Search Input */}
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

        {/* Status Dropdown */}
        <FilterSelect
          value={statusFilter}
          onChange={setStatusFilter}
          options={statusOptions}
          placeholder="All Status"
        />
      </div>

      {/* Blog Table - Show skeleton while loading */}
      {isLoading ? (
        <BlogTableSkeleton />
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
                onClick={() =>
                  setPage((p) => Math.min(pagination.totalPages, p + 1))
                }
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
        onClose={() =>
          setDeleteModal({ isOpen: false, blogId: null, blogTitle: "" })
        }
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