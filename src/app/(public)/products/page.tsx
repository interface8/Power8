"use client";

import ProductHero from "@/components/products/ProductHero";
import ProductsContent from "@/components/products/ProductsContent";
import { useProducts } from "@/hooks/use-products";
import { useCompanies } from "@/hooks/use-companies";
import { useProductCategories } from "@/hooks/use-product-categories";
import { useCart } from "@/hooks/use-cart";

export default function ProductsPage() {
  const { products, loading, fetchProducts, pagination } = useProducts();
  const { companies } = useCompanies();
  const { categories } = useProductCategories();
  const activeCategories = categories.filter(cat => cat.isActive === true);
  const { addToCart } = useCart();

  return (
    <div>
      <ProductHero />
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
            quantity
          );
        }}
        fetchProducts={fetchProducts}
        pagination={pagination}
      />
    </div>
  );
}