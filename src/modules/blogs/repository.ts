import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import type {
  AdminBlogFilters,
  AdminBlogsListDto,
  BlogCategoryDto,
  BlogDto,
  BlogFilters,
  CreateBlogCategoryInput,
  CreateBlogInput,
  UpdateBlogCategoryInput,
  UpdateBlogInput,
} from "./types";

const blogWithRelations = {
  include: {
    category: { select: { name: true } },
    company: { select: { name: true } },
    author: { select: { name: true } },
  },
} as const;

function toBlogDto(blog: {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  imageUrl: string | null;
  isPublished: boolean;
  publishedAt: Date | null;
  categoryId: string | null;
  category: { name: string } | null;
  companyId: string | null;
  company: { name: string } | null;
  authorId: string | null;
  author: { name: string } | null;
  createdAt: Date;
  updatedAt: Date;
}): BlogDto {
  return {
    id: blog.id,
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt,
    content: blog.content,
    imageUrl: blog.imageUrl,
    isPublished: blog.isPublished,
    publishedAt: blog.publishedAt?.toISOString() ?? null,
    categoryId: blog.categoryId,
    categoryName: blog.category?.name ?? null,
    companyId: blog.companyId,
    companyName: blog.company?.name ?? null,
    authorId: blog.authorId,
    authorName: blog.author?.name ?? null,
    createdAt: blog.createdAt,
    updatedAt: blog.updatedAt,
  };
}

export async function findBlogs(filters: BlogFilters = {}): Promise<BlogDto[]> {
  const { search, categoryId, companyId, published } = filters;

  const blogs = await prisma.blog.findMany({
    where: {
      ...(categoryId ? { categoryId } : {}),
      ...(companyId ? { companyId } : {}),
      ...(published != null ? { isPublished: published } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" as const } },
              { slug: { contains: search, mode: "insensitive" as const } },
              { excerpt: { contains: search, mode: "insensitive" as const } },
              { content: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    ...blogWithRelations,
  });

  return blogs.map(toBlogDto);
}

export async function findAdminBlogs(
  filters: AdminBlogFilters,
): Promise<AdminBlogsListDto> {
  const { search, categoryId, authorId, published, page, limit } = filters;
  const skip = (page - 1) * limit;

  const where: Prisma.BlogWhereInput = {
    ...(categoryId ? { categoryId } : {}),
    ...(authorId ? { authorId } : {}),
    ...(published != null ? { isPublished: published } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { slug: { contains: search, mode: "insensitive" } },
            { excerpt: { contains: search, mode: "insensitive" } },
            { content: { contains: search, mode: "insensitive" } },
            { author: { name: { contains: search, mode: "insensitive" } } },
            { category: { name: { contains: search, mode: "insensitive" } } },
          ],
        }
      : {}),
  };

  const [total, rows] = await Promise.all([
    prisma.blog.count({ where }),
    prisma.blog.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      ...blogWithRelations,
    }),
  ]);

  return {
    data: rows.map(toBlogDto),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function findBlogById(id: string): Promise<BlogDto | null> {
  const blog = await prisma.blog.findUnique({
    where: { id },
    ...blogWithRelations,
  });
  return blog ? toBlogDto(blog) : null;
}

export async function findBlogBySlug(slug: string): Promise<BlogDto | null> {
  const blog = await prisma.blog.findUnique({
    where: { slug },
    ...blogWithRelations,
  });
  return blog ? toBlogDto(blog) : null;
}

export async function blogExists(id: string): Promise<boolean> {
  const count = await prisma.blog.count({ where: { id } });
  return count > 0;
}

export async function blogSlugExists(slug: string): Promise<boolean> {
  const count = await prisma.blog.count({ where: { slug } });
  return count > 0;
}

export async function createBlog(input: CreateBlogInput): Promise<BlogDto> {
  const blog = await prisma.blog.create({
    data: {
      ...input,
      publishedAt: input.isPublished ? new Date() : undefined,
    },
    ...blogWithRelations,
  });

  return toBlogDto(blog);
}

export async function updateBlog(
  id: string,
  input: UpdateBlogInput,
): Promise<BlogDto> {
  const existing = await prisma.blog.findUnique({
    where: { id },
    select: {
      publishedAt: true,
    },
  });

  const data: Prisma.BlogUpdateInput = {
    ...input,
  };

  if (Object.prototype.hasOwnProperty.call(input, "isPublished")) {
    if (input.isPublished) {
      data.publishedAt = existing?.publishedAt ?? new Date();
    } else {
      data.publishedAt = null;
    }
  }

  const blog = await prisma.blog.update({
    where: { id },
    data,
    ...blogWithRelations,
  });

  return toBlogDto(blog);
}

export async function publishBlog(id: string): Promise<BlogDto> {
  const blog = await prisma.blog.update({
    where: { id },
    data: {
      isPublished: true,
      publishedAt: new Date(),
    },
    ...blogWithRelations,
  });

  return toBlogDto(blog);
}

export async function unpublishBlog(id: string): Promise<BlogDto> {
  const blog = await prisma.blog.update({
    where: { id },
    data: {
      isPublished: false,
      publishedAt: null,
    },
    ...blogWithRelations,
  });

  return toBlogDto(blog);
}

export async function deleteBlog(id: string): Promise<void> {
  await prisma.blog.delete({ where: { id } });
}

export async function findBlogCategories(): Promise<BlogCategoryDto[]> {
  return prisma.blogCategory.findMany({
    orderBy: [{ sort: "asc" }, { name: "asc" }],
  });
}

export async function findBlogCategoryById(
  id: string,
): Promise<BlogCategoryDto | null> {
  return prisma.blogCategory.findUnique({ where: { id } });
}

export async function findBlogCategoryByName(
  name: string,
): Promise<BlogCategoryDto | null> {
  const category = await prisma.blogCategory.findFirst({
    where: {
      name: {
        equals: name,
        mode: "insensitive",
      },
    },
  });

  return category;
}

export async function blogCategoryExists(id: string): Promise<boolean> {
  const count = await prisma.blogCategory.count({ where: { id } });
  return count > 0;
}

export async function createBlogCategory(
  input: CreateBlogCategoryInput,
): Promise<BlogCategoryDto> {
  return prisma.blogCategory.create({ data: input });
}

export async function updateBlogCategory(
  id: string,
  input: UpdateBlogCategoryInput,
): Promise<BlogCategoryDto> {
  return prisma.blogCategory.update({
    where: { id },
    data: input,
  });
}

export async function deleteBlogCategory(id: string): Promise<void> {
  await prisma.$transaction([
    prisma.blog.updateMany({
      where: { categoryId: id },
      data: { categoryId: null },
    }),
    prisma.blogCategory.delete({ where: { id } }),
  ]);
}