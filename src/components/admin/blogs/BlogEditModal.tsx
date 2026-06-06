"use client";

import { useEffect, useState, useCallback } from "react";
import { X } from "lucide-react";
import { Blog, BlogCategory, CreateBlogData } from "@/types/admin-blog";
import { BlogForm } from "./BlogForm";

interface BlogEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  blog: Blog | null;
  categories: BlogCategory[];
  onUpdate: (id: string, data: CreateBlogData) => Promise<void>;
  isUpdating: boolean;
}

export function BlogEditModal({
  isOpen,
  onClose,
  blog,
  categories,
  onUpdate,
  isUpdating,
}: BlogEditModalProps) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  }, [onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isUpdating) {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, isUpdating, handleClose]);  

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = async (data: CreateBlogData) => {
    if (!blog) return;
    await onUpdate(blog.id, data);
    handleClose();
  };

  if (!isOpen || !blog) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${
          isClosing ? "opacity-0" : "opacity-100"
        }`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200 ${
          isClosing ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        <div
          className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-linear-to-r from-orange-50/30 to-white px-6 py-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Edit Blog Post</h2>
              <p className="text-sm text-gray-500 mt-0.5">Update your blog article</p>
            </div>
            <button
              onClick={handleClose}
              disabled={isUpdating}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto p-6 max-h-[calc(90vh-80px)]">
            <BlogForm
              blog={blog}
              categories={categories}
              onSubmit={handleSubmit}
              isSubmitting={isUpdating}
              isModal={true}
              onCancel={handleClose}
            />
          </div>
        </div>
      </div>
    </>
  );
}