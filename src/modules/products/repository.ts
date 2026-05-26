import { prisma } from "@/lib/prisma";
import type { ProductDto, CreateProductInput, UpdateProductInput, ProductFilters, AdminProductFilters, PaginatedProducts } from "./types";
import type { Prisma } from "@prisma/client";

const productWithRelations = {
  include: {
    category: { select: { name: true } },
    company: { select: { name: true } },
  },
} as const;

function toProductDto(product: {
  id: string;
  name: string;
  description: string | null;
  categoryId: string;
  category: { name: string };
  companyId: string;
  company: { name: string };
  price: { toNumber: () => number };
  warranty: number;
  capacity: number;
  imageUrl: string | null;
  stockQuantity: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}): ProductDto {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    categoryId: product.categoryId,
    categoryName: product.category.name,
    companyId: product.companyId,
    companyName: product.company.name,
    price: product.price.toNumber(),
    warranty: product.warranty,
    capacity: product.capacity,
    imageUrl: product.imageUrl,
    stockQuantity: product.stockQuantity,
    isActive: product.isActive,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

export async function findProducts(filters: ProductFilters = {}): Promise<PaginatedProducts> {
  const { search, categoryId, companyId, minCapacity, page = 1, limit = 12 } = filters;

  const where = {
    isActive: true,
    ...(categoryId ? { categoryId } : {}),
    ...(companyId ? { companyId } : {}),
    ...(minCapacity != null ? { capacity: { gte: minCapacity } } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [rows, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      ...productWithRelations,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products: rows.map(toProductDto),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function findProductById(id: string): Promise<ProductDto | null> {
  const product = await prisma.product.findUnique({
    where: { id },
    ...productWithRelations,
  });
  return product ? toProductDto(product) : null;
}

export async function createProduct(input: CreateProductInput): Promise<ProductDto> {
  const product = await prisma.product.create({
    data: input,
    ...productWithRelations,
  });
  return toProductDto(product);
}

export async function updateProduct(id: string, input: UpdateProductInput): Promise<ProductDto> {
  const product = await prisma.product.update({
    where: { id },
    data: input,
    ...productWithRelations,
  });
  return toProductDto(product);
}

export async function deleteProduct(id: string): Promise<void> {
  await prisma.product.delete({ where: { id } });
}

export async function productExists(id: string): Promise<boolean> {
  const count = await prisma.product.count({ where: { id } });
  return count > 0;
}

export async function findProductByName(name: string): Promise<ProductDto | null> {
  const product = await prisma.product.findFirst({
    where: { name: { equals: name, mode: "insensitive" } },
    ...productWithRelations,
  });
  return product ? toProductDto(product) : null;
}

export async function findProductsAdmin(
  filters: AdminProductFilters = {},
): Promise<PaginatedProducts> {
  const {
    search,
    categoryId,
    companyId,
    minCapacity,
    isActive,
    stockStatus,
    lowStockThreshold = 5,
    page = 1,
    limit = 20,
  } = filters;

  const where: Prisma.ProductWhereInput = {
    ...(isActive !== undefined ? { isActive } : {}),
    ...(categoryId ? { categoryId } : {}),
    ...(companyId ? { companyId } : {}),
    ...(minCapacity != null ? { capacity: { gte: minCapacity } } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  if (stockStatus === "OUT_OF_STOCK") where.stockQuantity = { lte: 0 };
  if (stockStatus === "LOW_STOCK") where.stockQuantity = { gt: 0, lte: lowStockThreshold };
  if (stockStatus === "IN_STOCK") where.stockQuantity = { gt: lowStockThreshold };

  const [rows, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      ...productWithRelations,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products: rows.map(toProductDto),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function updateProductStock(id: string, stockQuantity: number): Promise<ProductDto> {
  const product = await prisma.product.update({
    where: { id },
    data: { stockQuantity },
    ...productWithRelations,
  });
  return toProductDto(product);
}


export async function isProductReferencedInOrders(productId: string): Promise<boolean> {
  const count = await prisma.orderItem.count({ where: { productId } });
  return count > 0;
}

export async function softDeleteProduct(id: string): Promise<ProductDto> {
  const product = await prisma.product.update({
    where: { id },
    data: { isActive: false },
    ...productWithRelations,
  });
  return toProductDto(product);
}

export async function hardDeleteProduct(id: string): Promise<void> {
  await prisma.product.delete({ where: { id } });
}