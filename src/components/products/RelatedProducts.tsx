"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface RelatedProduct {
  id: string;
  categoryName: string;
  name: string;
  price: number;
  imageUrl: string;
}

interface RelatedProductsProps {
  categoryId: string;
  categoryName: string;
  currentProductId: string;
}

export default function RelatedProducts({ categoryId, categoryName, currentProductId }: RelatedProductsProps) {
  const [products, setProducts] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fallbackImage = "/images/solar.jpg";

  useEffect(() => {
    if (!categoryId) return;

    const fetchRelatedProducts = async () => {
      setLoading(true);
      try {
        // Fetch ALL products from the same category (no limit)
        const res = await fetch(`/api/products?categoryId=${categoryId}`);
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.message || "Failed to fetch related products");
        }

        // Filter out the current product
        const filtered = (json.data || []).filter(
          (product: any) => product.id !== currentProductId
        );
        
        setProducts(filtered);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch");
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [categoryId, currentProductId]);

  // Don't show anything if loading
  if (loading) {
    return null;
  }

  // Don't show anything if error
  if (error) {
    return null;
  }

  // Don't show anything if no products
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 md:ml-8">
      <h2 className="text-3xl md:text-[28px] font-medium text-gray-900 mb-6 md:mb-6">
        Related Products in {categoryName}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition"
          >
            {/* Image */}
            <div className="relative w-full h-68 bg-gray-100">
              <Image
                src={product.imageUrl || fallbackImage}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition duration-300"
                sizes="(max-width: 768px) 100vw, 50vw"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = fallbackImage;
                }}
              />
            </div>
            
            {/* Content */}
            <div className="p-4 mt-8">
              <span className="inline-block text-[12px] font-medium text-orange-700 bg-orange-100 px-2 py-0.5 rounded-2xl mb-3">
                {product.categoryName}
              </span>
              <h3 className="font-semibold text-lg md:text-xl text-gray-900  mb-3">
                {product.name}
              </h3>
              <p className="text-black font-medium text-2xl md:text-[20px] mt-1 mb-2">
                ₦{product.price.toLocaleString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}