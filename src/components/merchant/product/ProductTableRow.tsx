"use client";

import Image from "next/image";
import { ProductStatusBadge } from "./ProductStatusBadge";
import { ProductActions } from "./ProductActions";

interface Product {
  id: string;
  name: string;
  categoryName: string;
  price: number;
  stockQuantity: number;
  status: "approved" | "pending" | "rejected";
  primaryImage: string | null;
  createdAt: string;
}

interface ProductTableRowProps {
  product: Product;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewReason: (product: Product) => void;
}

export function ProductTableRow({
  product,
  onEdit,
  onDelete,
  onViewReason,
}: ProductTableRowProps) {
  const date = new Date(product.createdAt);
  const formattedDate = date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          {product.primaryImage ? (
            <Image
              src={product.primaryImage}
              alt={product.name}
              width={40}
              height={40}
              className="w-10 h-10 rounded-md object-cover shrink-0"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center shrink-0">
              <span className="text-gray-400 text-xs">No img</span>
            </div>
          )}
          <span className="font-medium text-sm text-gray-900">{product.name}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{product.categoryName}</td>
      <td className="px-4 py-3 text-sm font-medium text-gray-900">
        N{product.price.toLocaleString()}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {product.stockQuantity} units
      </td>
      <td className="px-4 py-3">
        <ProductStatusBadge
          status={product.status}
          onViewReason={
            product.status === "rejected"
              ? () => onViewReason(product)
              : undefined
          }
        />
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">{formattedDate}</td>
      <td className="px-4 py-3">
        <ProductActions
          productId={product.id}
          productName={product.name}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </td>
    </tr>
  );
}