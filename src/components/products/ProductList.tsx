"use client";

import React from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/types/products";
import { Loader2 } from "lucide-react";

interface ProductListProps {
  products: Product[];
  loading?: boolean;
  onAddToCart: (productId: string, quantity?: number) => Promise<boolean>;
}

const ProductList = ({ products, loading, onAddToCart }: ProductListProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-orange-500" size={36} />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="text-lg font-medium">No products found</p>
        <p className="text-sm mt-1">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="transform transition-transform duration-300 hover:scale-105"
          >
            <ProductCard product={product} onAddToCart={onAddToCart} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
