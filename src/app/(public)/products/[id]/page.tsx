"use client";

import { useRouter } from "next/navigation";
import { useProductDetails } from "@/hooks/use-product-details";
import { useTestimonialStats } from "@/hooks/use-testimonials";
import { useCart } from "@/hooks/use-cart";
import ProductDetails from "@/components/products/ProductDetails";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { product, loading, error } = useProductDetails(params.id);
  const { stats, loading: statsLoading } = useTestimonialStats();
  const { addToCart } = useCart();

  if (loading || statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-2">{error || "Product not found"}</p>
          <a href="/products" className="text-orange-500 hover:underline">
            ← Back to Products
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFAEC] ">
      <div className="w-full mx-auto ">
        
        {/* Breadcrumb using shadcn/ui components */}
        <div className="mb-4 bg-[#FFFEFB] py-4 md:py-6 px-8 md:px-24 border-b border-gray-400/20 pb-4" >
          <Breadcrumb>
            <BreadcrumbList className="gap-3 md:gap-4">
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => router.push("/")} className="text-xl font-medium">
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="[&>svg]:w-4 [&>svg]:h-4 md:[&>svg]:w-5 md:[&>svg]:h-5" />
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => router.push("/products")} className="text-xl font-medium">
                  Products
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="[&>svg]:w-4 [&>svg]:h-4 md:[&>svg]:w-5 md:[&>svg]:h-5"/>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-xl font-[330]">{product.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Product Details */}
        <ProductDetails 
          product={product}
          stats={stats}
          onAddToCart={addToCart}
        />
      </div>
    </div>
  );
}