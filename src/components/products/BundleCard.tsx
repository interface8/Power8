"use client";

import React, { useState } from "react";
import { ShoppingCart, Loader2, Zap, Package } from "lucide-react";
import type { BundleDto } from "@/modules/bundles/types";
import { useCart } from "../providers/cart-providers";
import Link from "next/link";

type Props = {
  bundle: BundleDto;
};

const BundleCard = ({ bundle }: Props) => {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await addToCart(
        {
          itemType: "BUNDLE",
          bundleId: bundle.id,
          bundleName: bundle.name,
          price: bundle.totalPrice,
         
        },
        1,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col h-full border border-orange-100">
      {/* Header image area — bundles don't have images so use a styled placeholder */}
      <div className="relative w-full aspect-video bg-gradient-to-br from-green-800 to-green-600 flex flex-col items-center justify-center gap-2 p-4">
        <div className="bg-white/10 rounded-full p-3">
          <Zap className="w-8 h-8 text-orange-400" />
        </div>
        {bundle.systemCapacityKw && (
          <span className="text-white font-bold text-xl">
            {bundle.systemCapacityKw} kW
          </span>
        )}
        {/* Complete package badge */}
        <span className="absolute top-3 right-3 bg-orange-500 text-white text-[10px] px-2 py-1 rounded-full font-semibold">
          Complete Package
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1">
        {/* Category-style badge */}
        <span className="inline-flex items-center gap-1 bg-green-700 text-white text-[10px] px-2 py-1 rounded-md font-medium w-fit">
          <Package size={10} />
          System Bundle
        </span>

        <h3 className="text-[15px] mt-2 font-semibold text-gray-800 line-clamp-2">
          {bundle.name}
        </h3>

        {/* What's included */}
        <div className="mt-2 space-y-1">
          <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">
            Includes
          </p>
          {bundle.items.slice(0, 4).map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <p className="text-[11px] text-gray-600 line-clamp-1 flex-1">
                • {item.productName}
              </p>
              <span className="text-[10px] text-gray-400 ml-2 shrink-0">
                ×{item.quantity}
              </span>
            </div>
          ))}
          {bundle.items.length > 4 && (
            <p className="text-[11px] text-orange-500 font-medium">
              +{bundle.items.length - 4} more items
            </p>
          )}
        </div>

        <div className="flex-1" />

        <div className="flex justify-between items-center mt-3">
          <p className="text-lg font-bold text-orange-500">
            ₦{bundle.totalPrice.toLocaleString()}
          </p>
          {bundle.systemCapacityKw && (
            <p className="text-[12px] text-gray-400">
              {bundle.systemCapacityKw} kW system
            </p>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white text-sm py-2.5 rounded-lg flex items-center justify-center gap-2 mt-3"
        >
          <ShoppingCart size={16} />
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              Adding...
            </>
          ) : (
            "Add to Cart"
          )}
        </button>
        <Link
          href={`/bundles/${bundle.id}`}
          className="w-full bg-gray-300 hover:bg-gray-400 text-white text-sm py-2.5 rounded-lg flex items-center justify-center mt-2 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default BundleCard;