export interface BlogCategory {
  id: string;
  name: string;
  description: string | null;
  sort: number;
  createdAt: string;
  updatedAt: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  imageUrl: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  categoryId: string;
  categoryName: string;
  companyId: string | null;
  companyName: string | null;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogFilters {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  isPublished?: boolean;
}

export interface BlogStats {
  totalBlogs: number;
  publishedBlogs: number;
  draftBlogs: number;
  categories: number;
}

export interface CreateBlogData {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  imageUrl?: string;
  categoryId: string;
  isPublished?: boolean;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  sort?: number;
}