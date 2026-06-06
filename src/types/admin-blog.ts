export type BlogStatus = "published" | "draft";

export interface Blog {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  status: BlogStatus;
  createdAt: string;
  updatedAt: string;
}