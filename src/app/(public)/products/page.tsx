"use client";

import ProductHero from "@/components/products/ProductHero";
import ProductsContent from "@/components/products/ProductsContent";
import BundleList from "@/components/products/BundleList";
import { useProducts } from "@/hooks/use-products";
import { useCompanies } from "@/hooks/use-companies";
import { useProductCategories } from "@/hooks/use-product-categories";
import { useCart } from "@/hooks/use-cart";
import { useBundles } from "@/hooks/use-bundles";
import { useState } from "react";
import { Package, Layers } from "lucide-react";

type Tab = "products" | "bundles";

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("products");

  const { products, loading, fetchProducts, pagination } = useProducts();
  const { companies } = useCompanies();
  const { categories } = useProductCategories();
  const activeCategories = categories.filter((cat) => cat.isActive === true);
  const { addToCart } = useCart();
  const { bundles, loading: bundlesLoading, error: bundlesError, fetchBundles } = useBundles();

  return (
    <div>
      <ProductHero />

      {/* Tab switcher */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === "products"
                ? "bg-white text-orange-500 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Layers size={16} />
            Products
          </button>
          <button
            onClick={() => setActiveTab("bundles")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === "bundles"
                ? "bg-white text-orange-500 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Package size={16} />
            System Packages
            {bundles.length > 0 && (
              <span className="bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-semibold">
                {bundles.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Tab content */}
      {activeTab === "products" ? (
        <ProductsContent
          products={products}
          loading={loading}
          categories={activeCategories}
          companies={companies}
          onAddToCart={(productId, quantity = 1) => {
            const product = products.find((p) => p.id === productId);
            if (!product) return Promise.resolve(false);
            return addToCart(
              {
                itemType: "PRODUCT",
                productId: product.id,
                productName: product.name,
                price: product.price,
                productImage: product.imageUrl ?? "",
              },
              quantity,
            );
          }}
          fetchProducts={fetchProducts}
          pagination={pagination}
        />
      ) : (
        <BundleList
          bundles={bundles}
          loading={bundlesLoading}
          error={bundlesError}
          onRetry={fetchBundles}
        />
      )}
    </div>
  );
}