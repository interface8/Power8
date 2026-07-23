"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Store, MapPin, Package, Zap, ShoppingCart, Loader2, Calendar } from "lucide-react";
import { useCart } from "@/components/providers/cart-providers";

interface MerchantProduct {
  id: string;
  merchantProductId: string;
  name: string;
  description: string | null;
  price: number;
  warranty: number;
  capacity: number;
  stockQuantity: number;
  imageUrl: string | null;
  imageUrls: string[];
  categoryName: string;
}

interface MerchantBundle {
  id: string;
  merchantBundleId: string;
  name: string;
  totalPrice: number;
  systemCapacityKw: number | null;
  description: string | null;
  items: { productName: string; quantity: number }[];
}

interface Storefront {
  id: string;
  businessName: string;
  businessAddress: string;
  logoUrl: string | null;
  memberSince: string;
  products: MerchantProduct[];
  bundles: MerchantBundle[];
}

type Tab = "products" | "bundles";

export default function MerchantStorefrontPage({
  params,
}: {
  params: { merchantId: string };
}) {
  const { addToCart } = useCart();
  const [storefront, setStorefront] = useState<Storefront | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("products");
  const [addingId, setAddingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchStorefront = async () => {
      try {
        const res = await fetch(`/api/merchants/${params.merchantId}/storefront`);
        const json = await res.json();
        if (!res.ok) {
          setError(json.message || "Merchant not found");
          return;
        }
        setStorefront(json.data);
      } catch {
        setError("Failed to load store");
      } finally {
        setLoading(false);
      }
    };
    fetchStorefront();
  }, [params.merchantId]);

  const handleAddProduct = async (product: MerchantProduct) => {
    if (addingId) return;
    setAddingId(product.id);
    try {
      await addToCart(
        {
          itemType: "PRODUCT",
          productId: product.id,
          productName: product.name,
          price: product.price,
          productImage: product.imageUrl ?? "",
        },
        1,
      );
    } finally {
      setAddingId(null);
    }
  };

  const handleAddBundle = async (bundle: MerchantBundle) => {
    if (addingId) return;
    setAddingId(bundle.id);
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
      setAddingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading store...</p>
        </div>
      </div>
    );
  }

  if (error || !storefront) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Store size={48} className="text-gray-200 mx-auto mb-4" />
          <p className="text-red-600 text-lg mb-2">{error || "Store not found"}</p>
          <Link href="/products" className="text-orange-500 hover:underline text-sm">
            ← Browse all products
          </Link>
        </div>
      </div>
    );
  }

  const memberYear = new Date(storefront.memberSince).getFullYear();

  return (
    <div className="min-h-screen bg-[#FFFAEC]">
      {/* Store header */}
      <div className="bg-gradient-to-r from-green-900 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-12 py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Logo */}
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white/10 flex items-center justify-center flex-shrink-0 border-2 border-white/20">
              {storefront.logoUrl ? (
                <div className="relative w-full h-full">
                  <Image
                    src={storefront.logoUrl}
                    alt={storefront.businessName}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <Store size={32} className="text-white/70" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold">
                {storefront.businessName}
              </h1>
              <div className="flex flex-wrap gap-4 mt-2">
                {storefront.businessAddress && (
                  <span className="flex items-center gap-1.5 text-white/70 text-sm">
                    <MapPin size={13} />
                    {storefront.businessAddress}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-white/70 text-sm">
                  <Calendar size={13} />
                  Member since {memberYear}
                </span>
              </div>
              <div className="flex gap-4 mt-3">
                <span className="text-sm text-white/90">
                  <span className="font-bold text-white">{storefront.products.length}</span>{" "}
                  product{storefront.products.length !== 1 ? "s" : ""}
                </span>
                <span className="text-sm text-white/90">
                  <span className="font-bold text-white">{storefront.bundles.length}</span>{" "}
                  bundle{storefront.bundles.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 md:px-12 pt-6">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "products"
                ? "bg-white text-orange-500 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Package size={15} />
            Products
            {storefront.products.length > 0 && (
              <span className="bg-orange-100 text-orange-600 text-[10px] px-1.5 py-0.5 rounded-full font-semibold">
                {storefront.products.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("bundles")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "bundles"
                ? "bg-white text-orange-500 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Zap size={15} />
            Packages
            {storefront.bundles.length > 0 && (
              <span className="bg-orange-100 text-orange-600 text-[10px] px-1.5 py-0.5 rounded-full font-semibold">
                {storefront.bundles.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-12 py-6">
        {activeTab === "products" ? (
          storefront.products.length === 0 ? (
            <div className="text-center py-20">
              <Package size={48} className="text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500">No products listed yet</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {storefront.products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col"
                >
                  <div className="relative aspect-video bg-gray-50">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={32} className="text-gray-200" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <span className="inline-block bg-green-700 text-white text-[10px] px-2 py-1 rounded-md font-medium w-fit">
                      {product.categoryName}
                    </span>
                    <h3 className="text-[15px] mt-2 font-semibold text-gray-800 line-clamp-2">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-[12px] text-gray-500 mt-1 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    <div className="text-[11px] text-gray-500 mt-2 space-y-1">
                      {product.capacity > 0 && <p>Capacity: {product.capacity}</p>}
                      {product.warranty > 0 && (
                        <p>Warranty: {product.warranty} {product.warranty === 1 ? "year" : "years"}</p>
                      )}
                    </div>
                    <div className="flex-1" />
                    <div className="flex justify-between items-center mt-3">
                      <p className="text-lg font-bold text-orange-500">
                        ₦{product.price.toLocaleString()}
                      </p>
                      <p className="text-[12px] text-gray-400">
                        Stock: {product.stockQuantity}
                      </p>
                    </div>
                    <button
                      onClick={() => handleAddProduct(product)}
                      disabled={product.stockQuantity === 0 || addingId === product.id}
                      className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white text-sm py-2.5 rounded-lg flex items-center justify-center gap-2 mt-3 transition"
                    >
                      {addingId === product.id ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <ShoppingCart size={16} />
                      )}
                      {product.stockQuantity === 0 ? "Out of Stock" : addingId === product.id ? "Adding..." : "Add to Cart"}
                    </button>
                    <Link
                      href={`/products/${product.id}`}
                      className="w-full bg-gray-300 hover:bg-gray-400 text-white text-sm py-2.5 rounded-lg flex items-center justify-center mt-2 transition"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : storefront.bundles.length === 0 ? (
          <div className="text-center py-20">
            <Zap size={48} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500">No packages listed yet</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {storefront.bundles.map((bundle) => (
              <div
                key={bundle.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col border border-orange-100"
              >
                <div className="aspect-video bg-gradient-to-br from-green-800 to-green-600 flex flex-col items-center justify-center gap-2 p-4 relative">
                  <div className="bg-white/10 rounded-full p-3">
                    <Zap className="w-7 h-7 text-orange-400" />
                  </div>
                  {bundle.systemCapacityKw && (
                    <span className="text-white font-bold text-xl">
                      {bundle.systemCapacityKw} kW
                    </span>
                  )}
                  <span className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">
                    Package
                  </span>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-[15px] font-semibold text-gray-800 line-clamp-2">
                    {bundle.name}
                  </h3>
                  <div className="mt-2 space-y-1">
                    {bundle.items.slice(0, 3).map((item, i) => (
                      <p key={i} className="text-[11px] text-gray-500">
                        • {item.productName} ×{item.quantity}
                      </p>
                    ))}
                    {bundle.items.length > 3 && (
                      <p className="text-[11px] text-orange-500">
                        +{bundle.items.length - 3} more
                      </p>
                    )}
                  </div>
                  <div className="flex-1" />
                  <p className="text-lg font-bold text-orange-500 mt-3">
                    ₦{bundle.totalPrice.toLocaleString()}
                  </p>
                  <button
                    onClick={() => handleAddBundle(bundle)}
                    disabled={addingId === bundle.id}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white text-sm py-2.5 rounded-lg flex items-center justify-center gap-2 mt-3 transition"
                  >
                    {addingId === bundle.id ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <ShoppingCart size={16} />
                    )}
                    {addingId === bundle.id ? "Adding..." : "Add to Cart"}
                  </button>
                  <Link
                    href={`/bundles/${bundle.id}`}
                    className="w-full bg-gray-300 hover:bg-gray-400 text-white text-sm py-2.5 rounded-lg flex items-center justify-center mt-2 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}