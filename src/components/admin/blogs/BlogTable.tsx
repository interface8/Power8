"use client";

import { Blog } from "@/types/admin-blog";
import { TableHeader, TableRow, EmptyState } from "./blog-table";

interface BlogTableProps {
  blogs: Blog[];
  onDelete: (blog: Blog) => void; 
  onTogglePublish: (blog: Blog) => void;
  onEdit: (blog: Blog) => void;
  isDeleting: boolean;
  isToggling: boolean;
}

export function BlogTable({ blogs, onDelete, onTogglePublish, onEdit, isDeleting, isToggling }: BlogTableProps) {
  if (blogs.length === 0) return <EmptyState />;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-200">
        <TableHeader />
        <tbody className="divide-y divide-gray-100">
          {blogs.map((blog) => (
            <TableRow
              key={blog.id}
              blog={blog}
              onDelete={onDelete}
              onTogglePublish={onTogglePublish}
              onEdit={onEdit}
              isDeleting={isDeleting}
              isToggling={isToggling}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}