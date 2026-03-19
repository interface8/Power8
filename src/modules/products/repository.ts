import { prisma } from "@/lib/prisma";
import type { ProductDto, ProductFilters } from "./types";

function toProductDto(product: {
  id: string;
  name: string;
  description: string | null;
  price: { toNumber: () => number };
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
    price: product.price.toNumber(), // Prisma Decimal → number
    imageUrl: product.imageUrl,
    stockQuantity: product.stockQuantity,
    isActive: product.isActive,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

export async function findProducts(filters: ProductFilters = {}): Promise<ProductDto[]> {
  const { search } = filters;

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return products.map(toProductDto);
}

export async function findProductById(id: string): Promise<ProductDto | null> {
  const product = await prisma.product.findUnique({ where: { id } });
  return product ? toProductDto(product) : null;
}