"use client";

import { useState, useEffect } from "react";
import { Blog, CreateBlogData } from "@/types/admin-blog";
import { toast } from "sonner";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

interface UseBlogFormProps {
  blog?: Blog;
  onSubmit: (data: CreateBlogData) => Promise<void>;  
}

export function useBlogForm({ blog, onSubmit }: UseBlogFormProps) {  
  const [title, setTitle] = useState(blog?.title || "");
  const [slug, setSlug] = useState(blog?.slug || "");
  const [excerpt, setExcerpt] = useState(blog?.excerpt || "");
  const [content, setContent] = useState(blog?.content || "");
  const [categoryId, setCategoryId] = useState(blog?.categoryId || "");
  const [imageUrl, setImageUrl] = useState(blog?.imageUrl || "");
  const [isPublished, setIsPublished] = useState(blog?.isPublished || false);
  const [slugEdited, setSlugEdited] = useState(false);

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugEdited && title) {
      setSlug(generateSlug(title));
    }
  }, [title, slugEdited]);

  const validate = () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return false;
    }
    if (!slug.trim()) {
      toast.error("Slug is required");
      return false;
    }
    if (!categoryId) {
      toast.error("Please select a category");
      return false;
    }
    if (!content.trim()) {
      toast.error("Content is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await onSubmit({
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || undefined,
      content: content.trim(),
      categoryId,
      imageUrl: imageUrl || undefined,
      isPublished,
    });
  };

  return {
    formData: { title, slug, excerpt, content, categoryId, imageUrl, isPublished },
    setters: { setTitle, setSlug, setExcerpt, setContent, setCategoryId, setImageUrl, setIsPublished, setSlugEdited },
    handleSubmit,
  };
}