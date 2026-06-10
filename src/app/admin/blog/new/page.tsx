"use client";

import { useRouter } from "next/navigation";
import { useCategories, useCreateBlog } from "@/hooks/use-admin-blogs";
import { BlogForm } from "@/components/admin/blogs/BlogForm";
import { CreateBlogData } from "@/types/admin-blog";

export default function CreateBlogPage() {
  const router = useRouter();
  const { data: categoriesData, isLoading: categoriesLoading } =
    useCategories();
  const createBlog = useCreateBlog();

  const categories = categoriesData?.data || [];

  const handleSubmit = async (data: CreateBlogData) => {
    await createBlog.mutateAsync(data);
    router.push("/admin/blog");
  };

  if (categoriesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Create New Blog Post
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Write and publish a new blog article
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <BlogForm
          categories={categories}
          onSubmit={handleSubmit}
          isSubmitting={createBlog.isPending}
        />
      </div>
    </div>
  );
}
