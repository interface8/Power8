"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, User, Tag } from "lucide-react";
import type { Blog } from "@/types/blogs";

interface Props {
  blog: Blog;
}

export default function BlogCard({ blog }: Props) {
  const date = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString("en-NG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <Link href={`/blogs/${blog.slug}`}>
      <article className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col h-full group">
        {/* Image */}
        <div className="relative w-full aspect-video">
          <Image
            src={blog.imageUrl || "/images/power-1.jpg"}
            alt={blog.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {blog.categoryName && (
            <span className="absolute top-3 left-3 bg-orange-500 text-white text-[11px] px-2.5 py-1 rounded-full font-medium">
              {blog.categoryName}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-lg font-semibold text-gray-800 leading-snug line-clamp-2 group-hover:text-orange-500 transition-colors">
            {blog.title}
          </h3>

          {blog.excerpt && (
            <p className="text-sm text-gray-500 mt-2 line-clamp-3 leading-relaxed">
              {blog.excerpt}
            </p>
          )}

          <div className="flex-1" />

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-gray-400">
            {date && (
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {date}
              </span>
            )}
            {blog.authorName && (
              <span className="flex items-center gap-1">
                <User size={12} />
                {blog.authorName}
              </span>
            )}
            {blog.companyName && (
              <span className="flex items-center gap-1">
                <Tag size={12} />
                {blog.companyName}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
