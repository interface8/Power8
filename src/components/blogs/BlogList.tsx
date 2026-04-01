"use client";

import type { Blog } from "@/types/blogs";
import BlogCard from "./BlogCard";
import { Loader2 } from "lucide-react";

interface Props {
  blogs: Blog[];
  loading: boolean;
}

export default function BlogList({ blogs, loading }: Props) {
  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="animate-spin text-orange-500" size={32} />
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">No blog posts found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
}
