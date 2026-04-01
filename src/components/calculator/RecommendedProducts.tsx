"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { ChevronRight, Package } from "lucide-react";
import { useProducts } from "@/hooks/use-products";
import { useProductCategories } from "@/hooks/use-product-categories";
import { useCart } from "@/hooks/use-cart";
import ProductCard from "@/components/products/ProductCard";
import type { SolarResults, SolarConfig } from "@/types/solar";

interface Props {
  results: SolarResults;
  config: SolarConfig;
}

/** Maps category names to the minimum capacity required from the calculation. */
function buildCategoryRequirements(
  results: SolarResults,
  config: SolarConfig,
): Record<string, number> {
  return {
    "Solar Panels": config.panelRating,
    Inverters: results.inverterSize,
    Batteries: config.batteryUnitAh,
  };
}

const PREVIEW_LIMIT = 3;

export default function RecommendedProducts({ results, config }: Props) {
  const { categories } = useProductCategories();
  const { addToCart } = useCart();

  const requirements = useMemo(
    () => buildCategoryRequirements(results, config),
    [results, config],
  );

  // Resolve category name → id
  const categoryMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const cat of categories) {
      if (requirements[cat.name] != null) {
        map[cat.name] = cat.id;
      }
    }
    return map;
  }, [categories, requirements]);

  // One hook per section — panels, inverters, batteries
  const panels = useProducts(
    categoryMap["Solar Panels"]
      ? { categoryId: categoryMap["Solar Panels"], minCapacity: requirements["Solar Panels"] }
      : undefined,
  );
  const inverters = useProducts(
    categoryMap["Inverters"]
      ? { categoryId: categoryMap["Inverters"], minCapacity: requirements["Inverters"] }
      : undefined,
  );
  const batteries = useProducts(
    categoryMap["Batteries"]
      ? { categoryId: categoryMap["Batteries"], minCapacity: requirements["Batteries"] }
      : undefined,
  );

  // Re-fetch when category IDs become available
  useEffect(() => {
    if (categoryMap["Solar Panels"]) {
      panels.fetchProducts({ categoryId: categoryMap["Solar Panels"], minCapacity: requirements["Solar Panels"] });
    }
    if (categoryMap["Inverters"]) {
      inverters.fetchProducts({ categoryId: categoryMap["Inverters"], minCapacity: requirements["Inverters"] });
    }
    if (categoryMap["Batteries"]) {
      batteries.fetchProducts({ categoryId: categoryMap["Batteries"], minCapacity: requirements["Batteries"] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryMap, requirements]);

  const sections = [
    { label: "Solar Panels", catName: "Solar Panels", data: panels, min: requirements["Solar Panels"] },
    { label: "Inverters", catName: "Inverters", data: inverters, min: requirements["Inverters"] },
    { label: "Batteries", catName: "Batteries", data: batteries, min: requirements["Batteries"] },
  ];

  const handleAddToCart = async (productId: string, quantity = 1): Promise<boolean> => {
    try {
      await addToCart(productId, quantity);
      return true;
    } catch {
      return false;
    }
  };

  const hasAny = sections.some((s) => s.data.products.length > 0);
  const allLoading = sections.every((s) => s.data.loading);

  if (allLoading) {
    return (
      <div className="mt-8 text-center text-gray-500 text-sm animate-pulse">
        Loading recommended products…
      </div>
    );
  }

  if (!hasAny) return null;

  return (
    <div className="mt-8 sm:mt-10 space-y-8">
      <div className="flex items-center gap-2">
        <Package className="text-orange-500" size={22} />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Recommended Products
        </h2>
      </div>

      {sections.map(({ label, catName, data, min }) => {
        if (data.products.length === 0) return null;
        const catId = categoryMap[catName];
        const preview = data.products.slice(0, PREVIEW_LIMIT);
        const moreCount = data.products.length - PREVIEW_LIMIT;

        return (
          <div key={catName}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-700">
                {label}{" "}
                <span className="text-sm font-normal text-gray-400">
                  (≥&thinsp;{min.toLocaleString()}{catName === "Batteries" ? " Ah" : " W"})
                </span>
              </h3>
              {catId && (
                <Link
                  href={`/products?categoryId=${catId}`}
                  className="inline-flex items-center gap-1 text-sm text-orange-500 hover:text-orange-600 font-medium"
                >
                  View all {label}
                  <ChevronRight size={16} />
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {preview.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>

            {moreCount > 0 && catId && (
              <div className="mt-3 text-center">
                <Link
                  href={`/products?categoryId=${catId}`}
                  className="text-sm text-orange-500 hover:text-orange-600 font-medium"
                >
                  +{moreCount} more — browse all →
                </Link>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
