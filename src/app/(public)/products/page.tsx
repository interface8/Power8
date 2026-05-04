"use client";

import { useState } from "react";
import ProductHero from "@/components/products/ProductHero";
import ProductsContent from "@/components/products/ProductsContent";
import { useProducts } from "@/hooks/use-products";
import { useCompanies } from "@/hooks/use-companies";
import { useProductCategories } from "@/hooks/use-product-categories";
import { useCart } from "@/hooks/use-cart";

export default function ProductsPage() {
  const { products, loading, fetchProducts } = useProducts();
  const { companies } = useCompanies();
  const { categories } = useProductCategories();
  const { addToCart } = useCart();
  
  // These 3 lines control pagination
  const [showCount, setShowCount] = useState(8);
  const displayedProducts = products.slice(0, showCount);
  const hasMore = showCount < products.length;

  const loadMore = () => {
    setShowCount(showCount + 8);
  };

  console.log("Total products:", products.length);
  console.log("Displayed products:", displayedProducts.length);

  return (
    <div>
      <ProductHero />
      <ProductsContent
        products={displayedProducts}  // ← MUST be displayedProducts
        loading={loading}
        categories={categories}
        companies={companies}
        onAddToCart={addToCart}
        fetchProducts={fetchProducts}
        hasMore={hasMore}
        loadMore={loadMore}
      />
    </div>
  );
}