"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProductDetails } from "@/hooks/use-product-details";
import { useCart } from "@/hooks/use-cart";
import { useTestimonialStats } from "@/hooks/use-testimonials";
import ProductDetails from "@/components/products/ProductDetails";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter(); 
  const { product, loading, error } = useProductDetails(params.id);
  const { addToCart } = useCart();
  const {
    stats,
    loading: statsLoading,
    error: statsError,
  } = useTestimonialStats();

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

  if (error || statsError || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-2">
            {error || statsError || "Product not found"}
          </p>
          <Link href="/products" className="text-orange-500 hover:underline">
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 pl-8 md:pl-34 bg-[#fffefa] py-6">
        <Breadcrumb>
          <BreadcrumbList className="text-base md:text-xl font-medium text-black">
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={() => router.push("/")}
                className="cursor-pointer hover:text-orange-500 transition"
              >
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-base md:text-2xl" />
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={() => router.push("/products")}
                className="cursor-pointer hover:text-orange-500 transition"
              >
                Products
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-base md:text-lg" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-base md:text-lg">
                {product.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {/* Product Details */}
      <ProductDetails product={product} stats={stats} onAddToCart={addToCart} />
    </>
  );
};