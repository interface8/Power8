// "use client";

// import React from "react";
// import ProductCard from "./ProductCard";
// import { Product } from "@/types/products";
// import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";

// interface ProductListProps {
//   products: Product[];
//   loading?: boolean;
//   onAddToCart: (productId: string, quantity?: number) => Promise<boolean>;
//   page: number;
//   totalPages: number;
//   total: number;
//   onPageChange: (page: number) => void;
// }

// const ProductList = ({ products, loading, onAddToCart, page, totalPages, total, onPageChange }: ProductListProps) => {
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center py-20">
//         <Loader2 className="animate-spin text-orange-500" size={36} />
//       </div>
//     );
//   }

//   if (products.length === 0) {
//     return (
//       <div className="text-center py-20 text-gray-500">
//         <p className="text-lg font-medium">No products found</p>
//         <p className="text-sm mt-1">Try adjusting your search or filters</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4">
//       <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//         {products.map((product) => (
//           <div
//             key={product.id}
//             className="transform transition-transform duration-300 hover:scale-105"
//           >
//             <ProductCard product={product} onAddToCart={onAddToCart} />
//           </div>
//         ))}
//       </div>

//       {totalPages > 1 && (
//         <div className="flex items-center justify-between mt-8 px-2">
//           <p className="text-sm text-gray-500">
//             Page {page} of {totalPages} &mdash; {total} product{total !== 1 ? "s" : ""}
//           </p>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => onPageChange(page - 1)}
//               disabled={page <= 1}
//               className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
//             >
//               <ChevronLeft size={16} />
//               Previous
//             </button>

//             <div className="flex items-center gap-1">
//               {Array.from({ length: totalPages }, (_, i) => i + 1)
//                 .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
//                 .reduce<(number | "...")[]>((acc, p, idx, arr) => {
//                   if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
//                   acc.push(p);
//                   return acc;
//                 }, [])
//                 .map((item, idx) =>
//                   item === "..." ? (
//                     <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 select-none">
//                       &hellip;
//                     </span>
//                   ) : (
//                     <button
//                       key={item}
//                       onClick={() => onPageChange(item as number)}
//                       className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
//                         item === page
//                           ? "bg-orange-500 text-white"
//                           : "border border-gray-200 text-gray-700 hover:bg-gray-50"
//                       }`}
//                     >
//                       {item}
//                     </button>
//                   ),
//                 )}
//             </div>

//             <button
//               onClick={() => onPageChange(page + 1)}
//               disabled={page >= totalPages}
//               className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
//             >
//               Next
//               <ChevronRight size={16} />
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductList;


"use client";

import React from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/types/products";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductListProps {
  products: Product[];
  loading?: boolean;
  error?: string;
  onAddToCart: (productId: string, quantity?: number) => Promise<boolean>;
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  onRetry?: () => void;
}

const ProductList = ({ 
  products, 
  loading, 
  error, 
  onAddToCart, 
  page, 
  totalPages, 
  total, 
  onPageChange,
  onRetry 
}: ProductListProps) => {
  // Show loading only when actually loading AND no products yet
  if (loading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-orange-500" size={48} />
        <p className="text-gray-500 mt-4 text-sm">Loading products...</p>
      </div>
    );
  }

  // Show error only when there's an error AND no products to show
  if (error && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="text-red-500 text-lg font-medium mb-2">Failed to load products</div>
        <p className="text-gray-500 text-sm mb-4">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  // Show empty state
  if (!loading && !error && products.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="text-lg font-medium">No products found</p>
        <p className="text-sm mt-1">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Show loading indicator on top when refreshing */}
      {loading && products.length > 0 && (
        <div className="flex justify-center mb-4">
          <Loader2 className="animate-spin text-orange-500" size={24} />
          <span className="text-gray-500 text-sm ml-2">Refreshing...</span>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="transform transition-transform duration-300 hover:scale-105"
          >
            <ProductCard product={product} onAddToCart={onAddToCart} />
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8 px-2">
          <p className="text-sm text-gray-500">
            Page {page} of {totalPages} &mdash; {total} product{total !== 1 ? "s" : ""}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                  if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((item, idx) =>
                  item === "..." ? (
                    <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 select-none">
                      &hellip;
                    </span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => onPageChange(item as number)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                        item === page
                          ? "bg-orange-500 text-white"
                          : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {item}
                    </button>
                  ),
                )}
            </div>

            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;