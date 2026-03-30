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

export type UpdateBlogInput = Partial<CreateBlogInput>;

export interface BlogFilters {
  search?: string;
  categoryId?: string;
  companyId?: string;
  published?: boolean;
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

export type UpdateBlogCategoryInput = Partial<CreateBlogCategoryInput>;
