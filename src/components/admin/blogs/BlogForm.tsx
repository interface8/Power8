"use client";

import { Blog, BlogCategory, CreateBlogData } from "@/types/admin-blog";
import { BlogEditor } from "./BlogEditor";
import {
  TitleField,
  SlugField,
  CategoryField,
  StatusToggle,
  ExcerptField,
  ImageUploadField,
  FormActions,
} from "./blog-form";
import { useBlogForm } from "./hooks/useBlogForm";
import { useRouter } from "next/navigation";

interface BlogFormProps {
  blog?: Blog;
  categories: BlogCategory[];
  onSubmit: (data: CreateBlogData) => Promise<void>;
  isSubmitting: boolean;
  isModal?: boolean;
  onCancel?: () => void;
}

export function BlogForm({ blog, categories, onSubmit, isSubmitting, isModal = false, onCancel }: BlogFormProps) {
  const router = useRouter();
  const { formData, setters, handleSubmit } = useBlogForm({ blog, onSubmit });

  const handleCancel = () => {
    if (isModal && onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TitleField value={formData.title} onChange={setters.setTitle} autoFocus={!isModal} />
        <SlugField value={formData.slug} onChange={setters.setSlug} onEdit={() => setters.setSlugEdited(true)} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CategoryField categories={categories} value={formData.categoryId} onChange={setters.setCategoryId} />
        <StatusToggle value={formData.isPublished} onChange={setters.setIsPublished} />
      </div>

      <ExcerptField value={formData.excerpt} onChange={setters.setExcerpt} />
      
      <ImageUploadField value={formData.imageUrl} onChange={setters.setImageUrl} />
      
      {/* Compact Editor */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Content <span className="text-red-500">*</span>
        </label>
        <BlogEditor content={formData.content} onChange={setters.setContent} />
      </div>

      <FormActions isSubmitting={isSubmitting} isEdit={!!blog} onCancel={handleCancel} />
    </form>
  );
}