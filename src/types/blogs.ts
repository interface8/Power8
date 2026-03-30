export interface Blog {
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
  createdAt: string;
  updatedAt: string;
}

export interface BlogFilters {
  search?: string;
  categoryId?: string;
  companyId?: string;
  published?: boolean;
}

export interface BlogCategory {
  id: string;
  name: string;
  description: string | null;
  sort: number;
  createdAt: string;
  updatedAt: string;
}
