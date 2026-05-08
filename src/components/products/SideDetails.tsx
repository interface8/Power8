"use client";

import { Star, ShoppingCart, CheckCircle, Shield, Truck, CreditCard} from "lucide-react";
import type { ProductDto } from "@/modules/products";

interface SideDetailsProps {
  product: ProductDto;
  stats: { totalTestimonials: number; averageRating: number };
  features: { text: string; inStock: boolean }[];
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: (productId: string, quantity: number) => void;
}

export default function SideDetails({
  product,
  stats,
  features,
  quantity,
  onQuantityChange,
  onAddToCart,
}: SideDetailsProps) {
  const isInStock = product.stockQuantity > 0;

  return (
    <div>
      {/* Category Badge */}
      <span className="inline-block bg-orange-100 text-orange-700 text-sm md:text-[12px] font-medium px-3  rounded-full mb-4">
        {product.categoryName}
      </span>

      {/* Product Name */}
      <h1 className="text-xl md:text-5xl font-[620]  text-gray-900 mb-4">
        {product.name}
      </h1>

      {/* Rating Stars */}
      <div className="flex items-center gap-2.5 mb-7">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              size={19}
              className={`${
                index < Math.floor(stats.averageRating)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <span className="text-xl text-gray-500">
          ({stats.totalTestimonials} reviews)
        </span>
      </div>

      {/* Price */}
      <p className="text-2xl md:text-5xl font-medium text-gray-800 mb-3">
        ₦{product.price.toLocaleString()}
      </p>

      {/* Description */}
      <p className="text-xl text-gray-600 mb-6 leading-relaxed">
        {product.description}
      </p>

{/* Features List - 2x2 Grid with individual cards */}
<div className="grid md:grid-cols-2 gap-4 mb-6 border-b border-gray-250 pb-8">
  {features.map((feature, index) => (
    <div key={index} className="flex items-center gap-3 p-6 rounded-lg bg-orange-50">
      {feature.text.includes("Warranty") ? (
        <Shield size={18} className="text-blue-500 shrink-0" />
      ) : feature.text.includes("Delivery") ? (
        <Truck size={18} className="text-orange-500 shrink-0" />
      ) : feature.text.includes("In Stock") ? (
        <CheckCircle size={18} className="text-green-500 shrink-0" />
      ) : (
        <CreditCard size={18} className="text-green-500 shrink-0" />
      )}
      <span className="text-sm md:text-lg text-gray-700">{feature.text}</span>
    </div>
  ))}
</div>

      {/* Quantity Selector */}
      <div className="mb-5">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          Quantity
        </label>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className="w-16 h-8 border text-xl border-amber-500 p-5 bg-white rounded-lg flex items-center justify-center disabled:opacity-50"
          >
            -
          </button>
         <input
         
  type="number"
  value={quantity}
  onChange={(e) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val >= 1 && val <= product.stockQuantity) {
      onQuantityChange(val);
    }
  }}
  className="w-24 text-center py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
  min={1}
  max={product.stockQuantity}
/>
          <button
            onClick={() => onQuantityChange(Math.min(product.stockQuantity, quantity + 1))}
            disabled={quantity >= product.stockQuantity}
            className="w-8 h-8 border text-xl border-amber-500 p-5 bg-white rounded-lg flex items-center justify-center disabled:opacity-50"
          >
            +
          </button>
          <span className="text-xl text-gray-700 ml-2 ">
            {product.stockQuantity} available
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-2">
        <button
          onClick={() => onAddToCart(product.id, quantity)}
          disabled={!isInStock}
          className="w-full py-2.5 rounded-xl bg-linear-to-r from-orange-500 to-orange-400 hover:bg-yellow-600 text-lg  font-medium text-white  flex items-center justify-center gap-2"
        >
          <ShoppingCart size={16} />
          Add to Cart
        </button>
        <button
          disabled={!isInStock}
          className="w-full py-2.5 rounded-xl  text-xl font-medium border-2 border-orange-300 text-gray-800 hover:bg-orange-50 bg-gray-50"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}