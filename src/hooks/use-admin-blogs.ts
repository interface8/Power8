"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  publishBlog,
  unpublishBlog,
  getBlogStats,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  checkSlug,
  uploadImage,
} from "@/lib/api/admin-blogs";
import { BlogFilters, CreateBlogData, CreateCategoryData } from "@/types/admin-blog";
import { toast } from "sonner";

// ============ Blog Queries ============

export function useBlogs(filters: BlogFilters) {
  return useQuery({
    queryKey: ["admin-blogs", filters],
    queryFn: () => getBlogs(filters),
  });
}

export function useBlog(id: string) {
  return useQuery({
    queryKey: ["admin-blog", id],
    queryFn: () => getBlogById(id),
    enabled: !!id,
  });
}

export function useBlogStats() {
  return useQuery({
    queryKey: ["admin-blog-stats"],
    queryFn: () => getBlogStats(),
  });
}

export function useCheckSlug(slug: string, excludeId?: string) {
  return useQuery({
    queryKey: ["check-slug", slug, excludeId],
    queryFn: () => checkSlug(slug, excludeId),
    enabled: slug.length > 0,
  });
}

// ============ Blog Mutations ============

export function useCreateBlog() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateBlogData) => createBlog(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["admin-blog-stats"] });
      toast.success("Blog created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateBlog() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateBlogData> }) =>
      updateBlog(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["admin-blog", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["admin-blog-stats"] });
      toast.success("Blog updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteBlog() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["admin-blog-stats"] });
      toast.success("Blog deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function usePublishBlog() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => publishBlog(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["admin-blog", id] });
      queryClient.invalidateQueries({ queryKey: ["admin-blog-stats"] });
      toast.success("Blog published successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUnpublishBlog() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => unpublishBlog(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["admin-blog", id] });
      queryClient.invalidateQueries({ queryKey: ["admin-blog-stats"] });
      toast.success("Blog unpublished successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUploadImage() {
  return useMutation({
    mutationFn: (file: File) => uploadImage(file),
    onError: (error: Error) => {
      toast.error(error.message || "Failed to upload image");
    },
  });
}

// ============ Category Queries ============

export function useCategories() {
  return useQuery({
    queryKey: ["blog-categories"],
    queryFn: () => getCategories(),
  });
}

// ============ Category Mutations ============

export function useCreateCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateCategoryData) => createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-categories"] });
      toast.success("Category created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateCategoryData> }) =>
      updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-categories"] });
      toast.success("Category updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-categories"] });
      toast.success("Category deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}