"use client";

import React, { useState } from "react";
import { ShoppingCart, Loader2 } from "lucide-react";
import Image from "next/image";
import { Product } from "@/types/products";
import Link from "next/link";
import { useCart } from "../providers/cart-providers";

type Props = {
  product: Product;
  onAddToCart: (productId: string, quantity?: number) => Promise<boolean>;
};

const ProductCard = ({ product }: Props) => {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);

  // Use first image from imageUrls array, fallback to imageUrl, then default
  const productImage = product.imageUrls?.[0] || product.imageUrl || "/images/product-1.jpg";

  const handleAddToCart = async () => {
    if (loading) return;

    setLoading(true);

    try {
      await addToCart(
        {
          itemType: "PRODUCT",
          productId: product.id,
          productName: product.name,
          price: product.price,
          productImage: productImage,
        },
        1,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col h-full">
      <div className="relative w-full aspect-4/3 sm:aspect-video">
        <Image
          src={productImage}
          alt={product.name}
          fill
          className="object-fit"
        />
      </div>

      <div className="p-4 flex flex-col flex-1">
        <span className="inline-block bg-green-700 text-white text-[10px] px-2 py-1 rounded-md font-medium w-fit">
          {product.categoryName}
        </span>

        <h3 className="text-[15px] mt-2 font-semibold text-gray-800 line-clamp-2">
          {product.name}
        </h3>

        <p className="text-[12px] text-gray-500 mt-1 line-clamp-2">
          {product.description}
        </p>

        <div className="text-[11px] text-gray-500 mt-2 space-y-1">
          {product.capacity > 0 && <p>Capacity: {product.capacity}</p>}
          {product.warranty > 0 && (
            <p>
              Warranty: {product.warranty}{" "}
              {product.warranty === 1 ? "year" : "years"}
            </p>
          )}
          {product.merchantName && <p>Merchant: {product.merchantName}</p>}
          {product.companyName && <p>Brand: {product.companyName}</p>}
        </div>

        <div className="flex-1" />

        <div className="flex justify-between items-center mt-3">
          <p className="text-lg font-bold text-orange-500">
            ₦{(product.price ?? 0).toLocaleString()}
          </p>
          <p className="text-[12px] text-gray-400">
            Stock: {product.stockQuantity}
          </p>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stockQuantity === 0 || loading}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white text-sm py-2.5 rounded-lg flex items-center justify-center gap-2 mt-3"
        >
          <ShoppingCart size={16} />
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              Adding...
            </>
          ) : product.stockQuantity === 0 ? (
            "Out of Stock"
          ) : (
            "Add to Cart"
          )}
        </button>

        <Link
          href={`/products/${product.id}`}
          className="w-full bg-gray-300 hover:bg-gray-400 text-white text-sm py-2.5 rounded-lg flex items-center justify-center mt-3"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;