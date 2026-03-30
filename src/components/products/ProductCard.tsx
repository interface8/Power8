"use client"

import React from "react";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { Product } from "@/types/products";

type Props = {
  product: Product;
  onAddToCart: (productId: string, quantity?: number) => Promise<boolean>;
};

const ProductCard = ({ product, onAddToCart }: Props) => {
  const handleAddToCart = async () => {
    await onAddToCart(product.id);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col h-full">
      {/* Image */}
      <div className="relative w-full aspect-4/3 sm:aspect-video">
        <Image
          src={product.imageUrl || "/images/product-1.jpg"}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Badge */}
        <span className="inline-block bg-green-700 text-white text-[10px] px-2 py-1 rounded-md font-medium w-fit">
          {product.categoryName}
        </span>

        {/* Title */}
        <h3 className="text-[15px] mt-2 font-semibold text-gray-800 leading-snug line-clamp-2">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-[12px] text-gray-500 mt-1 line-clamp-2">
          {product.description}
        </p>

        {/* Specs */}
        <div className="text-[11px] text-gray-500 mt-2 space-y-1">
          {product.capacity > 0 && <p>Capacity: {product.capacity}</p>}
          {product.warranty > 0 && (
            <p>Warranty: {product.warranty} {product.warranty === 1 ? "year" : "years"}</p>
          )}
          {product.companyName && <p>Brand: {product.companyName}</p>}
        </div>

        {/* Push bottom content down */}
        <div className="flex-1" />

        {/* Price & Stock */}
        <div className="flex justify-between items-center mt-3">
          <p className="text-lg font-bold text-orange-500">
            ₦{product.price.toLocaleString()}
          </p>
          <p className="text-[12px] text-gray-400">Stock: {product.stockQuantity}</p>
        </div>

        {/* Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stockQuantity === 0}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm py-2.5 rounded-lg flex items-center justify-center gap-2 mt-3 transition"
        >
          <ShoppingCart size={16} />
          {product.stockQuantity === 0 ? "Out of Stock" : "Add to Cart"}
        </button>

        {/* Bottom spacing */}
        <div className="mt-2" />
      </div>
    </div>
  );
};

export default ProductCard;
