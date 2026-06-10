"use client";

import { Calendar, User, FolderOpen, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { Blog } from "@/types/admin-blog";
import { StatusBadge } from "./StatusBadge";

interface TableRowProps {
  blog: Blog;
  onDelete: (blog: Blog) => void; 
  onTogglePublish: (blog: Blog) => void;
  onEdit: (blog: Blog) => void;
  isDeleting: boolean;
  isToggling: boolean;
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export function TableRow({ blog, onDelete, onTogglePublish, onEdit, isDeleting, isToggling }: TableRowProps) {
  return (
    <tr className="border-b border-gray-100 transition-colors hover:bg-orange-50/30">
      <td className="px-4 py-3">
        <p className="font-medium text-gray-900 line-clamp-1">{blog.title}</p>
        <p className="text-xs text-gray-400 mt-0.5">/{blog.slug}</p>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          <FolderOpen className="h-3.5 w-3.5 text-gray-400" />
          <span className="text-sm text-gray-600">{blog.categoryName}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 text-gray-400" />
          <span className="text-sm text-gray-600">{blog.authorName}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <StatusBadge isPublished={blog.isPublished} />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-gray-400" />
          <span className="text-sm text-gray-500">{formatDate(blog.createdAt)}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => onTogglePublish(blog)}
            disabled={isToggling}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-green-100 hover:text-green-600"
            title={blog.isPublished ? "Unpublish" : "Publish"}
          >
            {blog.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
          <button
            onClick={() => onEdit(blog)}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-blue-100 hover:text-blue-600"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(blog)}  
            disabled={isDeleting}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-red-100 hover:text-red-600"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}