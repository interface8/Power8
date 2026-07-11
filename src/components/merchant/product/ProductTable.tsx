"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductTableRow } from "./ProductTableRow";
import { ProductMobileCard } from "./ProductMobileCard";
import type { MerchantProduct } from "@/types/merchant-product";

type Product = MerchantProduct & { rejectionReason?: string | null };

interface ProductTableProps {
  products: Product[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewReason: (product: Product) => void;
}

export function ProductTable({
  products,
  onEdit,
  onDelete,
  onViewReason,
}: ProductTableProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <>
      <div className="hidden md:block border rounded-lg overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-sm font-semibold">PRODUCT</TableHead>
                <TableHead className="text-sm font-semibold">CATEGORY</TableHead>
                <TableHead className="text-sm font-semibold">PRICE</TableHead>
                <TableHead className="text-sm font-semibold">STOCK</TableHead>
                <TableHead className="text-sm font-semibold">STATUS</TableHead>
                <TableHead className="text-sm font-semibold">DATE ADDED</TableHead>
                <TableHead className="text-sm font-semibold w-24">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <ProductTableRow
                  key={product.id}
                  product={product}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onViewReason={onViewReason}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="md:hidden space-y-4">
        {products.map((product) => (
          <ProductMobileCard
            key={product.id}
            product={product}
            onEdit={onEdit}
            onDelete={onDelete}
            onViewReason={onViewReason}
          />
        ))}
      </div>
    </>
  );
}