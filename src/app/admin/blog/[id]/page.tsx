"use client";

import { useParams } from "next/navigation";
import { useBlog, useCategories, useUpdateBlog } from "@/hooks/use-admin-blogs";
import { BlogForm } from "@/components/admin/blogs/BlogForm";
import { CreateBlogData } from "@/types/admin-blog";

export default function EditBlogPage() {
  const params = useParams();
  const id = params.id as string;
  
  const { data: blogData, isLoading: blogLoading } = useBlog(id);
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const updateBlog = useUpdateBlog();

  const blog = blogData?.data;
  const categories = categoriesData?.data || [];

  const handleSubmit = async (data: CreateBlogData) => {
    await updateBlog.mutateAsync({ id, data });
  };

  if (blogLoading || categoriesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-gray-500">Blog post not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Blog Post</h1>
        <p className="text-sm text-gray-500 mt-1">Update your blog article</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <BlogForm
          blog={blog}
          categories={categories}
          onSubmit={handleSubmit}
          isSubmitting={updateBlog.isPending}
        />
      </div>
    </div>
  );
}