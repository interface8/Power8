"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Tag, BookOpen, Loader2 } from "lucide-react";
import { useBlog } from "@/hooks/use-blogs";

export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { blog, loading, error } = useBlog(slug, true);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="animate-spin text-orange-500" size={32} />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <BookOpen className="mx-auto text-gray-300 mb-4" size={48} />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Blog post not found</h1>
        <p className="text-gray-500 mb-6">The article you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition"
        >
          <ArrowLeft size={16} />
          Back to Blog
        </Link>
      </div>
    );
  }

  const date = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString("en-NG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <article className="min-h-screen bg-white">
      {/* Hero Image */}
      {blog.imageUrl && (
        <div className="relative w-full h-64 sm:h-80 md:h-96">
          <Image
            src={blog.imageUrl}
            alt={blog.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Back Link */}
        <Link
          href="/blogs"
          className="inline-flex items-center gap-1.5 text-sm text-orange-500 hover:text-orange-600 font-medium mb-6"
        >
          <ArrowLeft size={16} />
          Back to Blog
        </Link>

        {/* Category Badge */}
        {blog.categoryName && (
          <span className="inline-block bg-orange-100 text-orange-600 text-xs px-3 py-1 rounded-full font-medium mb-4">
            {blog.categoryName}
          </span>
        )}

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
          {blog.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
          {date && (
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {date}
            </span>
          )}
          {blog.authorName && (
            <span className="flex items-center gap-1.5">
              <User size={14} />
              {blog.authorName}
            </span>
          )}
          {blog.companyName && (
            <span className="flex items-center gap-1.5">
              <Tag size={14} />
              {blog.companyName}
            </span>
          )}
        </div>

        {/* Divider */}
        <hr className="my-6 border-gray-200" />

        {/* Body */}
        <div className="prose prose-gray prose-lg max-w-none prose-headings:text-gray-800 prose-a:text-orange-500 prose-a:no-underline hover:prose-a:underline whitespace-pre-line leading-relaxed text-gray-700">
          {blog.content}
        </div>

        {/* Footer */}
        <hr className="my-8 border-gray-200" />
        <div className="flex justify-center">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition"
          >
            <ArrowLeft size={16} />
            Back to all posts
          </Link>
        </div>
      </div>
    </article>
  );
}
