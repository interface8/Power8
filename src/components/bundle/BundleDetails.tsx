"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingCart, Loader2, Zap, Store, Package } from "lucide-react";
import { useCart } from "@/components/providers/cart-providers";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { BundleDetailDto } from "@/modules/bundles/repository";

export default function BundleDetail({
  id,
}: {
  id: string;
}) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [bundle, setBundle] = useState<BundleDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<BundleDetailDto["items"][0] | null>(null);

  useEffect(() => {
    const fetchBundle = async () => {
      try {
        const res = await fetch(`/api/bundles/${id}`);
        const json = await res.json();
        console.log("Bundle API response:", JSON.stringify(json.data, null, 2));
        if (!res.ok) {
          setError(json.message || "Bundle not found");
          return;
        }
        setBundle(json.data);
        if (json.data.items.length > 0) {
          setSelectedProduct(json.data.items[0]);
        }
      } catch {
        setError("Failed to load bundle");
      } finally {
        setLoading(false);
      }
    };
    fetchBundle();
  }, [id]);

  const handleAddToCart = async () => {
    if (!bundle || addingToCart) return;
    setAddingToCart(true);
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
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading package...</p>
        </div>
      </div>
    );
  }

  if (error || !bundle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-2">{error || "Bundle not found"}</p>
          <Link href="/products" className="text-orange-500 hover:underline">
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFAEC]">
      <div className="w-full mx-auto">
        {/* Breadcrumb */}
        <div className="mb-4 bg-[#FFFEFB] py-4 md:py-6 px-8 md:px-24 border-b border-gray-400/20 mt-8">
          <Breadcrumb>
            <BreadcrumbList className="gap-3 md:gap-4">
              <BreadcrumbItem>
                <BreadcrumbLink
                  onClick={() => router.push("/")}
                  className="text-xl font-medium cursor-pointer hover:text-orange-500 transition"
                >
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="[&>svg]:w-4 [&>svg]:h-4 md:[&>svg]:w-5 md:[&>svg]:h-5" />
              <BreadcrumbItem>
                <BreadcrumbLink
                  onClick={() => router.push("/products")}
                  className="text-xl font-medium cursor-pointer hover:text-orange-500 transition"
                >
                  Products
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="[&>svg]:w-4 [&>svg]:h-4 md:[&>svg]:w-5 md:[&>svg]:h-5" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-xl font-[330]">
                  {bundle.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="py-4 px-4 md:py-8 md:px-24">
          {/* Back button */}
          <div className="mb-7">
            <Link
              href="/products"
              className="inline-flex items-center gap-4 text-gray-600 transition group pl-4 md:pl-14"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition" />
              <span className="text-[12px] md:text-[14px] font-medium">
                Back to Products
              </span>
            </Link>
          </div>

          {/* Top section */}
          <div className="flex flex-col lg:flex-row gap-9">
            {/* Left — selected product image */}
            <div className="lg:w-1/2">
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                {selectedProduct && selectedProduct.imageUrls.length > 0 ? (
                  <div className="relative aspect-square">
                    <Image
                      src={selectedProduct.imageUrls[0]}
                      alt={selectedProduct.productName}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-square bg-gradient-to-br from-green-800 to-green-600 flex flex-col items-center justify-center gap-3">
                    <div className="bg-white/10 rounded-full p-4">
                      <Zap className="w-12 h-12 text-orange-400" />
                    </div>
                    {bundle.systemCapacityKw && (
                      <span className="text-white font-bold text-3xl">
                        {bundle.systemCapacityKw} kW
                      </span>
                    )}
                    <span className="text-white/70 text-sm">System Package</span>
                  </div>
                )}
              </div>

              {/* Product image thumbnails */}
              {bundle.items.length > 1 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {bundle.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedProduct(item)}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                        selectedProduct?.id === item.id
                          ? "border-orange-500"
                          : "border-gray-200 hover:border-orange-300"
                      }`}
                    >
                      {item.imageUrls.length > 0 ? (
                        <Image
                          src={item.imageUrls[0]}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-green-100 flex items-center justify-center">
                          <Package size={16} className="text-green-600" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right — bundle info */}
            <div className="lg:w-1/2 space-y-5">
              {/* Complete package badge */}
              <span className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-600 text-xs px-3 py-1.5 rounded-full font-semibold">
                <Zap size={12} />
                Complete Solar Package
              </span>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {bundle.name}
              </h1>

              {/* Merchant link */}
              {bundle.merchant && (
                <Link
                  href={`/store/${bundle.merchant.id}`}
                  className="inline-flex items-center gap-2 text-sm text-green-700 hover:text-orange-500 transition font-medium group"
                >
                  {bundle.merchant.logoUrl ? (
                    <div className="relative w-6 h-6 rounded-full overflow-hidden border border-gray-200">
                      <Image
                        src={bundle.merchant.logoUrl}
                        alt={bundle.merchant.businessName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                      <Store size={12} className="text-green-700" />
                    </div>
                  )}
                  <span className="group-hover:underline">
                    {bundle.merchant.businessName}
                  </span>
                  <span className="text-gray-400">→</span>
                </Link>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-orange-500">
                  ₦{bundle.totalPrice.toLocaleString()}
                </span>
                {bundle.systemCapacityKw && (
                  <span className="text-gray-500 text-sm">
                    {bundle.systemCapacityKw} kW system
                  </span>
                )}
              </div>

              {/* What's included */}
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Package size={14} className="text-green-700" />
                  What&apos;s included in this package
                </h3>
                <div className="space-y-2">
                  {bundle.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedProduct(item)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition ${
                        selectedProduct?.id === item.id
                          ? "bg-orange-50 border border-orange-200"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                          {item.imageUrls.length > 0 ? (
                            <div className="relative w-full h-full">
                              <Image
                                src={item.imageUrls[0]}
                                alt={item.productName}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package size={12} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-800">
                            {item.productName}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {item.categoryName}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold text-gray-700">
                          ×{item.quantity}
                        </p>
                        <p className="text-[10px] text-orange-500">
                          ₦{item.price.toLocaleString()}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Add to cart */}
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition"
              >
                <ShoppingCart size={18} />
                {addingToCart ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Adding to cart...
                  </>
                ) : (
                  "Add Package to Cart"
                )}
              </button>

              {/* Features */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Complete solar package",
                  "Professional installation",
                  "Warranty included",
                  "Flexible payment options",
                ].map((f) => (
                  <div
                    key={f}
                    className="flex items-center gap-1.5 text-xs text-gray-600"
                  >
                    <span className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                      ✓
                    </span>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Selected product detail section */}
          {selectedProduct && (
            <div className="mt-12 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Package size={18} className="text-green-700" />
                {selectedProduct.productName} — Details
              </h2>
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Images */}
                <div className="lg:w-1/3">
                  {selectedProduct.imageUrls.length > 0 ? (
                    <div className="space-y-2">
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50">
                        <Image
                          src={selectedProduct.imageUrls[0]}
                          alt={selectedProduct.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      {selectedProduct.imageUrls.length > 1 && (
                        <div className="flex gap-2">
                          {selectedProduct.imageUrls.slice(1).map((url, i) => (
                            <div
                              key={i}
                              className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-50"
                            >
                              <Image
                                src={url}
                                alt={`${selectedProduct.productName} ${i + 2}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="aspect-square rounded-xl bg-gray-50 flex items-center justify-center">
                      <Package size={48} className="text-gray-200" />
                    </div>
                  )}
                </div>

                {/* Product details */}
                <div className="lg:w-2/3 space-y-4">
                  <div>
                    <span className="text-xs bg-green-700 text-white px-2 py-1 rounded-md font-medium">
                      {selectedProduct.categoryName}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mt-2">
                      {selectedProduct.productName}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      By {selectedProduct.companyName}
                    </p>
                  </div>

                  {selectedProduct.productDescription && (
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {selectedProduct.productDescription}
                    </p>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { label: "Unit Price", value: `₦${selectedProduct.price.toLocaleString()}` },
                      { label: "Quantity in Bundle", value: `×${selectedProduct.quantity}` },
                      { label: "Capacity", value: selectedProduct.capacity > 0 ? `${selectedProduct.capacity}` : "—" },
                      { label: "Warranty", value: selectedProduct.warranty > 0 ? `${selectedProduct.warranty} year${selectedProduct.warranty > 1 ? "s" : ""}` : "—" },
                      { label: "Stock", value: `${selectedProduct.stockQuantity} units` },
                      { label: "Category", value: selectedProduct.categoryName },
                    ].map((spec) => (
                      <div
                        key={spec.label}
                        className="bg-gray-50 rounded-lg p-3"
                      >
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">
                          {spec.label}
                        </p>
                        <p className="text-sm font-semibold text-gray-800 mt-0.5">
                          {spec.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* All items overview */}
          <div className="mt-8 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Package specifications
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {bundle.items.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-100 rounded-xl p-4 hover:border-orange-200 transition cursor-pointer"
                  onClick={() => setSelectedProduct(item)}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                      {item.imageUrls.length > 0 ? (
                        <Image
                          src={item.imageUrls[0]}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={16} className="text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 line-clamp-1">
                        {item.productName}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {item.categoryName}
                      </p>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-xs text-orange-500 font-semibold">
                          ₦{item.price.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-400">
                          ×{item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}