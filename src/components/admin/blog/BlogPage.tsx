"use client";

import { useMemo, useState } from "react";
import { mockBlogs } from "@/data/admin-blogs";

import BlogStats from "./BlogStats";
import BlogFilters from "./BlogFilters";
import BlogTable from "./BlogTable";
import BlogCard from "./BlogCard";
import BlogPagination from "./BlogPagination";
import { FileText } from "lucide-react";

export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  const filteredBlogs = useMemo(() => {
    return mockBlogs.filter((blog) => {
      const matchesSearch = blog.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory = category === "all" || blog.category === category;

      const matchesStatus = status === "all" || blog.status === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [search, category, status]);

  const totalBlogs = mockBlogs.length;

  const publishedBlogs = mockBlogs.filter(
    (blog) => blog.status === "published",
  ).length;

  const draftBlogs = mockBlogs.filter((blog) => blog.status === "draft").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div
          className="flex h-14 w-14 items-center justify-center
      rounded-2xl
      bg-orange-100
      text-orange-600"
        >
          <FileText size={28} />
        </div>
        <h1 className="text-2xl font-bold text-gray-950">Blog Management</h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage blog posts and published content.
        </p>
      </div>

      {/* Stats */}
      <BlogStats
        total={totalBlogs}
        published={publishedBlogs}
        drafts={draftBlogs}
      />

      {/* Filters */}
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <BlogFilters
          search={search}
          category={category}
          status={status}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
          onStatusChange={setStatus}
        />
      </div>

      {/* Empty State */}
      {filteredBlogs.length === 0 ? (
        <div
          className="
            flex
            min-h-75
            flex-col
            items-center
            justify-center
            rounded-2xl
            border
            border-dashed
            bg-white
            text-center
          "
        >
          <div className="text-5xl">📝</div>

          <h3 className="mt-4 text-lg font-semibold">No blog posts found</h3>

          <p className="mt-2 text-sm text-gray-500">
            Try adjusting your filters or create a new blog post.
          </p>

          <button
            className="
              mt-5
              rounded-lg
              bg-orange-500
              px-5
              py-2
              text-white
              transition-colors
              hover:bg-orange-600
            "
          >
            Create Blog
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <BlogTable blogs={filteredBlogs} />

          {/* Mobile Cards */}
          <div className="grid gap-4 lg:hidden">
            {filteredBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>

          {/* Pagination */}
          <div className="pt-2">
            <BlogPagination />
          </div>
        </>
      )}
    </div>
  );
}
