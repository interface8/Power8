import * as blogRepo from "./repository";
import type { CreateBlogInput, UpdateBlogInput, BlogFilters, CreateBlogCategoryInput, UpdateBlogCategoryInput } from "./types";

// ─── Blog ──────────────────────────────────────────────

export async function listBlogs(filters: BlogFilters) {
  return blogRepo.findBlogs(filters);
}

export async function getBlogById(id: string) {
  const blog = await blogRepo.findBlogById(id);
  if (!blog) throw new Error("Blog not found");
  return blog;
}

export async function getBlogBySlug(slug: string) {
  const blog = await blogRepo.findBlogBySlug(slug);
  if (!blog) throw new Error("Blog not found");
  return blog;
}

export async function createBlog(input: CreateBlogInput) {
  if (await blogRepo.blogSlugExists(input.slug)) {
    throw new Error("A blog with this slug already exists");
  }
  return blogRepo.createBlog(input);
}

export async function updateBlog(id: string, input: UpdateBlogInput) {
  if (!(await blogRepo.blogExists(id))) {
    throw new Error("Blog not found");
  }
  if (input.slug) {
    const existing = await blogRepo.findBlogBySlug(input.slug);
    if (existing && existing.id !== id) {
      throw new Error("A blog with this slug already exists");
    }
  }
  return blogRepo.updateBlog(id, input);
}

export async function deleteBlog(id: string) {
  if (!(await blogRepo.blogExists(id))) {
    throw new Error("Blog not found");
  }
  return blogRepo.deleteBlog(id);
}

// ─── Blog Categories ───────────────────────────────────

export async function listBlogCategories() {
  return blogRepo.findBlogCategories();
}

export async function getBlogCategoryById(id: string) {
  const cat = await blogRepo.findBlogCategoryById(id);
  if (!cat) throw new Error("Blog category not found");
  return cat;
}

export async function createBlogCategory(input: CreateBlogCategoryInput) {
  return blogRepo.createBlogCategory(input);
}

export async function updateBlogCategory(id: string, input: UpdateBlogCategoryInput) {
  if (!(await blogRepo.blogCategoryExists(id))) {
    throw new Error("Blog category not found");
  }
  return blogRepo.updateBlogCategory(id, input);
}

export async function deleteBlogCategory(id: string) {
  if (!(await blogRepo.blogCategoryExists(id))) {
    throw new Error("Blog category not found");
  }
  return blogRepo.deleteBlogCategory(id);
}
