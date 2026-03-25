import { Product } from "@/types/products";

export const getProducts = async (): Promise<Product[]> => {
  const res = await fetch("/api/products", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await res.json();

  return data.map(
    (item: any): Product => ({
      id: item.id,
      name: item.name,
      description: item.description ?? "",
      imageUrl: item.imageUrl ?? "/placeholder.png",
      price: item.price,
      stockQuantity: item.stockQuantity,
      categoryName: item.categoryName,
      power: item.power ? String(item.power) : undefined,
      capacity: item.capacity ? String(item.capacity) : undefined,
      warranty: item.warranty,
    }),
  );
};
