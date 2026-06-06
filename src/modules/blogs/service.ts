import * as blogRepo from "./repository";
import type {
  AdminBlogFilters,
  BlogFilters,
  CreateBlogCategoryInput,
  CreateBlogInput,
  UpdateBlogCategoryInput,
  UpdateBlogInput,
} from "./types";

export async function listBlogs(filters: BlogFilters) {
  return blogRepo.findBlogs(filters);
}

export async function listAdminBlogs(filters: AdminBlogFilters) {
  return blogRepo.findAdminBlogs(filters);
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
  const existing = await blogRepo.findBlogById(id);
  if (!existing) throw new Error("Blog not found");

  if (input.slug && input.slug !== existing.slug) {
    const duplicate = await blogRepo.findBlogBySlug(input.slug);
    if (duplicate && duplicate.id !== id) {
      throw new Error("A blog with this slug already exists");
    }
  }

  return blogRepo.updateBlog(id, input);
}

export async function publishBlog(id: string) {
  if (!(await blogRepo.blogExists(id))) {
    throw new Error("Blog not found");
  }
  return blogRepo.publishBlog(id);
}

export async function unpublishBlog(id: string) {
  if (!(await blogRepo.blogExists(id))) {
    throw new Error("Blog not found");
  }
  return blogRepo.unpublishBlog(id);
}

export async function deleteBlog(id: string) {
  if (!(await blogRepo.blogExists(id))) {
    throw new Error("Blog not found");
  }
  return blogRepo.deleteBlog(id);
}

export async function listBlogCategories() {
  return blogRepo.findBlogCategories();
}

export async function getBlogCategoryById(id: string) {
  const cat = await blogRepo.findBlogCategoryById(id);
  if (!cat) throw new Error("Blog category not found");
  return cat;
}

export async function createBlogCategory(input: CreateBlogCategoryInput) {
  const existing = await blogRepo.findBlogCategoryByName(input.name);
  if (existing) {
    throw new Error("A blog category with this name already exists");
  }

  return blogRepo.createBlogCategory(input);
}

export async function updateBlogCategory(
  id: string,
  input: UpdateBlogCategoryInput,
) {
  const current = await blogRepo.findBlogCategoryById(id);
  if (!current) throw new Error("Blog category not found");

  if (input.name) {
    const duplicate = await blogRepo.findBlogCategoryByName(input.name);
    if (duplicate && duplicate.id !== id) {
      throw new Error("A blog category with this name already exists");
    }
  }

  return blogRepo.updateBlogCategory(id, input);
}

export async function deleteBlogCategory(id: string) {
  if (!(await blogRepo.blogCategoryExists(id))) {
    throw new Error("Blog category not found");
  }
  return blogRepo.deleteBlogCategory(id);
}