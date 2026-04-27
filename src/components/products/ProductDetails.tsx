"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProductImages from "./ProductImages";
import SideDetails from "./SideDetails";
import ProductTabs from "./ProductTabs";
import RelatedProducts from "./RelatedProducts";
import type { ProductDto } from "@/modules/products";

interface ProductDetailsProps {
  product: ProductDto;
  stats: { totalTestimonials: number; averageRating: number };
  onAddToCart: (productId: string, quantity: number) => Promise<boolean> | void;
}

export default function ProductDetails({ 
  product, 
  stats, 
  onAddToCart 
}: ProductDetailsProps) {
  
  const [quantity, setQuantity] = useState(1);

  // Prepare images array (using placeholders for now)
  const productImages = [
    product.imageUrl || "/images/solar.jpg",
    "/images/power-1.jpg",
    "/images/power-2.jpg",
    "/images/power-7.jpg",
  ];

  // Prepare features list
  const features = [
    { text: "In Stock - Ready to Ship", inStock: product.stockQuantity > 0 },
    { text: `${product.warranty || 25} years Warranty`, inStock: true },
    { text: "Free Delivery in Lagos", inStock: true },
    { text: "Flexible Payment Options", inStock: true },
  ];

  return (
    <div className="min-h-screen bg-[#FFFAEC] py-4 px-4 md:py-8 md:px-24">
      <div className="max-w-full mx-auto h-full">
        
        {/* Back to Products Button */}
        <div className="mb-7">
          <Link
            href="/products"
            className="inline-flex items-center gap-4 text-gray-600 transition group pl-4 md:pl-14"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition" />
            <span className="text-[12px] md:text-[14px] font-medium">Back to Products</span>
          </Link>
        </div>

        {/* Product Section - Stacked on mobile, Side by side on desktop */}
        <div className="flex flex-col lg:flex-row gap-9">
          
          {/* Left Column - Images */}
          <div className="lg:w-1/2 lg:h-full">
            <ProductImages images={productImages} />
          </div>

          {/* Right Column - Product Info */}
          <div className="lg:w-1/2 h-full">
            <SideDetails 
              product={product}
              stats={stats}
              features={features}
              quantity={quantity}
              onQuantityChange={setQuantity}
              onAddToCart={onAddToCart}
            />
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12">
          <ProductTabs 
            description={product.description || "Cost-effective polycrystalline panel for budget-conscious buyers"}
            keyFeatures={[
              "High efficiency power output",
              `${product.warranty || 20} years warranty coverage`,
              "Professional installation included",
              "Optimized for Nigerian climate conditions"
            ]}
            specifications={[
              { label: "Product ID", value: product.id?.slice(-8) || "panel-250w" },
              { label: "Category", value: product.categoryName || "Solar Panels" },
              { label: "Power Rating", value: `${product.capacity || 250}W` },
              { label: "Voltage", value: "24V" },
              { label: "Warranty Period", value: `${product.warranty || 20} years` },
              { label: "Stock Status", value: `${product.stockQuantity || 60} units available` }
            ]}
            warrantyCoverage={[
              `${product.warranty || 20} years manufacturer warranty`,
              "Free repair or replacement for manufacturing defects",
              "24/7 technical support hotline",
              "Annual maintenance check included"
            ]}
            extendedWarranty="Extend your warranty coverage for additional peace of mind. Contact our sales team for pricing."
          />
        </div>

        {/* Related Products Section */}
        <div className="mt-22">
          <RelatedProducts 
            categoryId={product.categoryId}
            categoryName={product.categoryName}
            currentProductId={product.id}
          />
        </div>
      </div>
    </div>
  );
}