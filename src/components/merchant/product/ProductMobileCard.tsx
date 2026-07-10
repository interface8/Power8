"use client";

import Image from "next/image";
import { ProductStatusBadge } from "./ProductStatusBadge";
import { ProductActions } from "./ProductActions";
import type { MerchantProduct } from "@/types/merchant-product";

type Product = MerchantProduct & { rejectionReason?: string | null };

interface ProductMobileCardProps {
  product: Product;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewReason: (product: Product) => void;
}

export function ProductMobileCard({
  product,
  onEdit,
  onDelete,
  onViewReason,
}: ProductMobileCardProps) {
  const date = new Date(product.createdAt);
  const formattedDate = date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-lg border p-4 shadow-sm">
      <div className="flex items-start gap-3">
        {product.primaryImage ? (
          <Image
            src={product.primaryImage}
            alt={product.name}
            width={56}
            height={56}
            className="w-14 h-14 rounded-md object-cover shrink-0"
          />
        ) : (
          <div className="w-14 h-14 bg-gray-100 rounded-md flex items-center justify-center shrink-0">
            <span className="text-gray-400 text-xs">No img</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-base text-gray-900 truncate">
              {product.name}
            </h3>
            <ProductStatusBadge
              status={product.status}
              onViewReason={
                product.status === "REJECTED"
                  ? () => onViewReason(product)
                  : undefined
              }
            />
          </div>
          <p className="text-sm text-gray-500">{product.categoryName}</p>
          <div className="flex items-center gap-4 mt-1 text-sm">
            <span className="font-medium text-gray-900">
              N{product.price.toLocaleString()}
            </span>
            <span className="text-gray-500">{product.stockQuantity} units</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">{formattedDate}</p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <ProductActions
              productId={product.id}
              productName={product.name}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
}