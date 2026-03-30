"use client";

import BlogHero from "@/components/blogs/BlogHero";
import BlogContent from "@/components/blogs/BlogContent";
import { useBlogs } from "@/hooks/use-blogs";
import { useBlogCategories } from "@/hooks/use-blog-categories";

export default function BlogsPage() {
  const { blogs, loading, fetchBlogs } = useBlogs();
  const { categories } = useBlogCategories();

  return (
    <div>
      <BlogHero />
      <BlogContent
        blogs={blogs}
        loading={loading}
        categories={categories}
        fetchBlogs={fetchBlogs}
      />
    </div>
  );
}
