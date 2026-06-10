import {
  BlogFilters,
  CreateBlogData,
  CreateCategoryData,
} from "@/types/admin-blog";

const BASE_URL = "/api/admin/blogs";
const CATEGORIES_URL = "/api/admin/blog-categories";

// ============ Blog APIs ============

export async function getBlogs(filters: BlogFilters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  });

  const response = await fetch(`${BASE_URL}?${params}`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch blogs");
  return response.json();
}

export async function getBlogById(id: string) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch blog");
  return response.json();
}

export async function createBlog(data: CreateBlogData) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create blog");
  }
  return response.json();
}

export async function updateBlog(id: string, data: Partial<CreateBlogData>) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update blog");
  }
  return response.json();
}

export async function deleteBlog(id: string) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete blog");
  }
  return response.json();
}

export async function publishBlog(id: string) {
  const response = await fetch(`${BASE_URL}/${id}/publish`, {
    method: "PATCH",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to publish blog");
  }
  return response.json();
}

export async function unpublishBlog(id: string) {
  const response = await fetch(`${BASE_URL}/${id}/unpublish`, {
    method: "PATCH",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to unpublish blog");
  }
  return response.json();
}

export async function checkSlug(slug: string, excludeId?: string) {
  const params = new URLSearchParams({ slug });
  if (excludeId) params.append("excludeId", excludeId);

  const response = await fetch(`${BASE_URL}/check-slug?${params}`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to check slug");
  return response.json();
}

export async function getBlogStats() {
  const response = await fetch(`${BASE_URL}/stats`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch stats");
  return response.json();
}

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${BASE_URL}/upload-image`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to upload image");
  }
  return response.json();
}

// ============ Category APIs ============

export async function getCategories() {
  const response = await fetch(CATEGORIES_URL, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch categories");
  return response.json();
}

export async function createCategory(data: CreateCategoryData) {
  const response = await fetch(CATEGORIES_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create category");
  }
  return response.json();
}

export async function updateCategory(
  id: string,
  data: Partial<CreateCategoryData>,
) {
  const response = await fetch(`${CATEGORIES_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update category");
  }
  return response.json();
}

export async function deleteCategory(id: string) {
  const response = await fetch(`${CATEGORIES_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete category");
  }
  return response.json();
}
