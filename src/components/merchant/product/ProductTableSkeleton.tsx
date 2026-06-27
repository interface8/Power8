"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ProductTableSkeletonProps {
  rows?: number;
}

export function ProductTableSkeleton({ rows = 5 }: ProductTableSkeletonProps) {
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
              {Array.from({ length: rows }).map((_, index) => (
                <TableRow key={index} className="animate-pulse">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-md" />
                      <div className="h-4 bg-gray-200 rounded w-32" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-gray-200 rounded w-24" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-gray-200 rounded w-20" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-gray-200 rounded w-16" />
                  </TableCell>
                  <TableCell>
                    <div className="h-6 bg-gray-200 rounded-full w-20" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-gray-200 rounded w-24" />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 bg-gray-200 rounded" />
                      <div className="w-8 h-8 bg-gray-200 rounded" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="md:hidden space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg border p-4 animate-pulse">
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 bg-gray-200 rounded-md shrink-0" />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="h-5 bg-gray-200 rounded w-32" />
                  <div className="h-6 bg-gray-200 rounded-full w-20" />
                </div>
                <div className="h-4 bg-gray-200 rounded w-24 mt-1" />
                <div className="flex gap-4 mt-2">
                  <div className="h-4 bg-gray-200 rounded w-16" />
                  <div className="h-4 bg-gray-200 rounded w-16" />
                </div>
                <div className="h-3 bg-gray-200 rounded w-20 mt-1" />
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                  <div className="h-8 bg-gray-200 rounded flex-1" />
                  <div className="h-8 bg-gray-200 rounded flex-1" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}