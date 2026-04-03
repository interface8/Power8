"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShoppingCart, CheckCircle, Truck, Shield, Star } from "lucide-react";
import type { Product } from "@/types/products";
import QuantitySelector from "./QuantitySelector";
import ProductTabs from "./ProductTabs";

interface ProductDetailsProps {
  product: Product;
  onAddToCart: (productId: string, quantity?: number) => Promise<boolean>;
  stats: { totalTestimonials: number; averageRating: number };
  statsLoading: boolean;
  statsError: string;
}

export default function ProductDetails({ 
  product, 
  onAddToCart, 
  stats, 
  statsLoading, 
  statsError 
}: ProductDetailsProps) {
  if (!product) {
    return null;
  }

  const [mainImage, setMainImage] = useState(product.imageUrl || "/images/product-1.jpg");
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const isInStock = product.stockQuantity > 0;

  const handleAddToCart = async () => {
    if (isAdding) return;
    setIsAdding(true);
    await onAddToCart(product.id, quantity);
    setIsAdding(false);
  };

  return (
    <div className="min-h-screen bg-[#FFFAEC] py-4 px-4 md:py-8 md:px-24">
      <div className="max-w-full mx-auto">
        {/* Back Link */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-500 mb-4 md:mb-6 transition group"
        >
          <ArrowLeft size={16} className="md:size-6 group-hover:-translate-x-1 transition" />
          <span className="text-sm md:text-lg font-medium">Back to Products</span>
        </Link>

        {/* Main Product Section */}
        <div className="">
          <div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-8 p-4 md:p-8">
            
            {/* Left Column - Image Gallery */}
            <div className="flex flex-col gap-4 w-full">
              {/* Main Image */}
              <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden w-full">
                <Image
                  src={mainImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* Thumbnail Gallery - Full width */}
              <div className="w-full">
                <div className="flex justify-between gap-2 md:gap-3 overflow-x-auto pb-2">
                  {/* Thumbnail 1 */}
                  <button
                    onClick={() => setMainImage(product.imageUrl || "/images/product-1.jpg")}
                    className={`relative w-20 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden shrink-0 transition-all ${
                      mainImage === (product.imageUrl || "/images/product-1.jpg")
                        ? "ring-2 ring-orange-500"
                        : "ring-1 ring-gray-200"
                    }`}
                  >
                    <Image
                      src={product.imageUrl || "/images/product-1.jpg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </button>

                  {/* Thumbnail 2 */}
                  <button
                    onClick={() => setMainImage("/images/product-2.jpg")}
                    className={`relative w-20 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                      mainImage === "/images/product-2.jpg"
                        ? "ring-2 ring-orange-500"
                        : "ring-1 ring-gray-200"
                    }`}
                  >
                    <Image
                      src="/images/product-2.jpg"
                      alt="Product alternate view 1"
                      fill
                      className="object-cover"
                    />
                  </button>

                  {/* Thumbnail 3 */}
                  <button
                    onClick={() => setMainImage("/images/product-3.jpg")}
                    className={`relative w-20 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                      mainImage === "/images/product-3.jpg"
                        ? "ring-2 ring-orange-500"
                        : "ring-1 ring-gray-200"
                    }`}
                  >
                    <Image
                      src="/images/product-3.jpg"
                      alt="Product alternate view 2"
                      fill
                      className="object-cover"
                    />
                  </button>

                  {/* Thumbnail 4 */}
                  <button
                    onClick={() => setMainImage("/images/product-4.jpg")}
                    className={`relative w-20 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                      mainImage === "/images/product-4.jpg"
                        ? "ring-2 ring-orange-500"
                        : "ring-1 ring-gray-200"
                    }`}
                  >
                    <Image
                      src="/images/product-4.jpg"
                      alt="Product alternate view 3"
                      fill
                      className="object-cover"
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Product Info */}
            <div>
              {/* Category Badge */}
              <span className="inline-block bg-orange-100 text-orange-600 text-xs md:text-sm px-2 py-1 md:px-3 md:py-1 rounded-full mb-2 md:mb-3">
                {product.categoryName}
              </span>

              {/* Product Name */}
              <h1 className="text-lg md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, index) => (
                    <Star 
                      key={index} 
                      size={12}
                      className={`md:size-16 ${
                        index < Math.floor(stats.averageRating) 
                          ? "text-yellow-400 fill-yellow-400" 
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs md:text-sm text-gray-500">
                  {statsLoading ? "Loading..." : `(${stats.totalTestimonials} reviews)`}
                </span>
              </div>

              {/* Price */}
              <p className="text-xl md:text-3xl font-bold text-orange-500 mb-2 md:mb-4">
                ₦{product.price ? Number(product.price).toLocaleString() : "0"}
              </p>

              {/* Short Description */}
              <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Features List */}
              <div className="space-y-2 md:space-y-3 mb-4 md:mb-6 p-3 md:p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 md:gap-3">
                  {isInStock ? (
                    <CheckCircle size={14} className="text-green-500 md:size-18" />
                  ) : (
                    <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-red-500" />
                  )}
                  <span className={`text-xs md:text-sm ${isInStock ? "text-green-600" : "text-red-500"}`}>
                    {isInStock ? "In Stock - Ready to Ship" : "Out of Stock"}
                  </span>
                </div>

                <div className="flex items-center gap-2 md:gap-3">
                  <Shield size={14} className="text-blue-500 md:size-18" />
                  <span className="text-xs md:text-sm">{product.warranty} years Warranty</span>
                </div>

                <div className="flex items-center gap-2 md:gap-3">
                  <Truck size={14} className="text-orange-500 md:size-18" />
                  <span className="text-xs md:text-sm">Free Delivery in Lagos</span>
                </div>

                <div className="flex items-center gap-2 md:gap-3">
                  <span className="text-xs md:text-sm text-gray-500">Flexible Payment Options</span>
                </div>
              </div>

              {/* Quantity Selector */}
              <QuantitySelector 
                stockQuantity={Number(product.stockQuantity) || 0}
                onQuantityChange={setQuantity}
              />

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!isInStock || isAdding}
                  className={`w-full py-2.5 md:py-3 rounded-xl flex items-center justify-center gap-2 transition text-sm md:text-base ${
                    isInStock && !isAdding
                      ? "bg-orange-500 hover:bg-orange-600 text-white"
                      : "bg-gray-300 cursor-not-allowed text-gray-500"
                  }`}
                >
                  <ShoppingCart size={16} className="md:size-18" />
                  {isAdding ? "Adding..." : "Add to Cart"}
                </button>
                <button
                  disabled={!isInStock}
                  className={`w-full py-2.5 md:py-3 rounded-xl flex items-center justify-center gap-2 transition text-sm md:text-base ${
                    isInStock
                      ? "border-2 border-orange-500 text-orange-500 hover:bg-orange-50"
                      : "bg-gray-300 cursor-not-allowed text-gray-500 border-none"
                  }`}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <ProductTabs 
          description={product.description || ""}
          capacity={product.capacity}
          warranty={product.warranty}
          brand={product.companyName}
        />

        {/* Related Products Section */}
        <div className="mt-8 md:mt-12">
          <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-3 md:mb-6">
            Related Products in {product.categoryName}
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <p className="text-gray-500 text-center py-6 md:py-8 text-sm md:text-base">
              Related products coming soon...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}