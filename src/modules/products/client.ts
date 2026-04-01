import type { Product } from "@/types/products";

type RawProduct = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  price: number;
  stockQuantity: number;
  categoryId: string;
  categoryName: string;
  companyId: string;
  companyName: string;
  warranty: number;
  capacity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export const getProducts = async (): Promise<Product[]> => {
  const res = await fetch("/api/products", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await res.json();

  return data.map(
    (item: RawProduct): Product => ({
      id: item.id,
      name: item.name,
      description: item.description,
      imageUrl: item.imageUrl,
      price: item.price,
      stockQuantity: item.stockQuantity,
      categoryId: item.categoryId,
      categoryName: item.categoryName,
      companyId: item.companyId,
      companyName: item.companyName,
      warranty: item.warranty,
      capacity: item.capacity,
      isActive: item.isActive,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }),
  );
};
