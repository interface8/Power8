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

<<<<<<< HEAD
export default function ProductDetailPage({
=======
export default function ProductDetailsPage({
>>>>>>> 073202a4896a73a04043bd70ec3b037481975814
  params,
}: {
  params: { id: string };
}) {
<<<<<<< HEAD
  const router = useRouter(); 
=======
  const router = useRouter();
>>>>>>> 073202a4896a73a04043bd70ec3b037481975814
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
<<<<<<< HEAD
            {error || statsError || "Product not found"}
          </p>
          <Link href="/products" className="text-orange-500 hover:underline">
=======
            {error || "Product not found"}
          </p>
          <a href="/products" className="text-orange-500 hover:underline">
>>>>>>> 073202a4896a73a04043bd70ec3b037481975814
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
<<<<<<< HEAD
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
=======
    <div className="min-h-screen bg-[#FFFAEC] ">
      <div className="w-full mx-auto ">
        {/* Breadcrumb using shadcn/ui components */}
        <div className="mb-4 bg-[#FFFEFB] py-4 md:py-6 px-8 md:px-24 border-b border-gray-400/20 pb-4">
          <Breadcrumb>
            <BreadcrumbList className="gap-3 md:gap-4">
              <BreadcrumbItem>
                <BreadcrumbLink
                  onClick={() => router.push("/")}
                  className="text-xl font-medium"
                >
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="[&>svg]:w-4 [&>svg]:h-4 md:[&>svg]:w-5 md:[&>svg]:h-5" />
              <BreadcrumbItem>
                <BreadcrumbLink
                  onClick={() => router.push("/products")}
                  className="text-xl font-medium"
                >
                  Products
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="[&>svg]:w-4 [&>svg]:h-4 md:[&>svg]:w-5 md:[&>svg]:h-5" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-xl font-[330]">
                  {product.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Product Details */}
        <ProductDetails
          product={product}
          stats={stats}
          onAddToCart={(productId, quantity) =>
            addToCart(
              {
                productId,
                productName: product.name,
                price: product.price,
                productImage: product.imageUrl ?? "", // fallback if missing
              },
              quantity,
            )
          }
        />
>>>>>>> 073202a4896a73a04043bd70ec3b037481975814
      </div>
      {/* Product Details */}
      <ProductDetails product={product} stats={stats} onAddToCart={addToCart} />
    </>
  );
<<<<<<< HEAD
};
=======
}
>>>>>>> 073202a4896a73a04043bd70ec3b037481975814
