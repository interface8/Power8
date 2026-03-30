"use client";

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

  return (
    <div>
      <ProductHero />
      <ProductsContent
        products={products}
        loading={loading}
        categories={categories}
        companies={companies}
        onAddToCart={addToCart}
        fetchProducts={fetchProducts}
      />
    </div>
  );
}
