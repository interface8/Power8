export interface BlogDto {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  imageUrl: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  categoryId: string | null;
  categoryName: string | null;
  companyId: string | null;
  companyName: string | null;
  authorId: string | null;
  authorName: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBlogInput {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  imageUrl?: string;
  isPublished?: boolean;
  categoryId?: string;
  companyId?: string;
  authorId?: string;
}

export type UpdateBlogInput = {
  title?: string;
  slug?: string;
  excerpt?: string | null;
  content?: string;
  imageUrl?: string | null;
  isPublished?: boolean;
  categoryId?: string | null;
  companyId?: string | null;
  authorId?: string | null;
};

export interface BlogFilters {
  search?: string;
  categoryId?: string;
  companyId?: string;
  published?: boolean;
}

export interface AdminBlogFilters {
  search?: string;
  categoryId?: string;
  authorId?: string;
  published?: boolean;
  page: number;
  limit: number;
}

export interface AdminBlogsListDto {
  data: BlogDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BlogCategoryDto {
  id: string;
  name: string;
  description: string | null;
  sort: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBlogCategoryInput {
  name: string;
  description?: string;
  sort?: number;
}

export type UpdateBlogCategoryInput = {
  name?: string;
  description?: string | null;
  sort?: number;
};

export interface BlogStatsDto {
  totalBlogs: number;
  publishedBlogs: number;
  draftBlogs: number;
  categories: number;
}

export interface BlogSlugAvailabilityDto {
  available: boolean;
}