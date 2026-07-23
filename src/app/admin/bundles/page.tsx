"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  Plus,
  BoxesIcon,
} from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

import type { BundleDto } from "@/modules/bundles/types";
import BundleModal from "@/components/admin/bundles/BundleModal";

export default function AdminBundlesPage() {
  const [bundles, setBundles] = useState<BundleDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState<BundleDto | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bundleToDelete, setBundleToDelete] = useState<{ id: string; name: string } | null>(null);
  const itemsPerPage = 8;

  const fetchBundles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/bundles");
      const json = await res.json();
      if (res.ok) {
        setBundles(json.data ?? []);
      } else {
        toast.error(json.message || "Failed to fetch bundles");
      }
    } catch {
      toast.error("Failed to fetch bundles");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBundles();
  }, [fetchBundles]);

  const filteredBundles = bundles.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredBundles.length / itemsPerPage);
  const paginatedBundles = filteredBundles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleDeleteConfirm = async () => {
    if (!bundleToDelete) return;
    try {
      const res = await fetch(`/api/admin/bundles/${bundleToDelete.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Bundle deleted");
        fetchBundles();
      } else {
        toast.error("Failed to delete bundle");
      }
    } catch {
      toast.error("Failed to delete bundle");
    } finally {
      setDeleteDialogOpen(false);
      setBundleToDelete(null);
    }
  };

  const SkeletonRow = () => (
    <TableRow className="animate-pulse">
      {[...Array(5)].map((_, i) => (
        <TableCell key={i}>
          <div className="h-5 bg-gray-200 rounded w-full" />
        </TableCell>
      ))}
    </TableRow>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Bundles</h1>

      {/* Filters Row */}
      <div className="flex flex-col md:flex-row gap-3 mb-6 items-start md:items-center">
        <div className="flex-1 w-full bg-white rounded-lg border p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search bundles..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 h-11 text-base"
            />
          </div>
        </div>
        <div className="shrink-0 w-full md:w-auto">
          <Button
            onClick={() => {
              setEditingBundle(null);
              setModalOpen(true);
            }}
            className="bg-orange-500 hover:bg-orange-600 h-11 text-base px-6 w-full md:w-auto"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Bundle
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">BUNDLE NAME</TableHead>
                <TableHead className="font-semibold">TOTAL PRICE</TableHead>
                <TableHead className="font-semibold">CAPACITY (KW)</TableHead>
                <TableHead className="font-semibold">ITEMS</TableHead>
                <TableHead className="font-semibold">SOURCE</TableHead>
                <TableHead className="font-semibold w-24">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
              ) : paginatedBundles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <BoxesIcon className="w-12 h-12" />
                      <p className="font-medium text-base">No bundles found</p>
                      <p className="text-sm">
                        {searchTerm
                          ? "Try a different search term"
                          : "Create your first bundle using the button above"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedBundles.map((bundle) => (
                  <TableRow key={bundle.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{bundle.name}</TableCell>
                    <TableCell>₦{bundle.totalPrice.toLocaleString()}</TableCell>
                    <TableCell>
                      {bundle.systemCapacityKw != null
                        ? `${bundle.systemCapacityKw} kW`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {bundle.items.slice(0, 2).map((item) => (
                          <span
                            key={item.id}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                          >
                            {item.productName} ×{item.quantity}
                          </span>
                        ))}
                        {bundle.items.length > 2 && (
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                            +{bundle.items.length - 2} more
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        bundle.merchantBundleId
                          ? "bg-purple-50 text-purple-700"
                          : "bg-green-50 text-green-700"
                              }`}>
                        {bundle.merchantBundleId ? "Merchant" : "In-house"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingBundle(bundle);
                            setModalOpen(true);
                          }}
                          className="h-9 w-9 p-0 hover:bg-orange-100"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setBundleToDelete({ id: bundle.id, name: bundle.name });
                            setDeleteDialogOpen(true);
                          }}
                          className="h-9 w-9 p-0 hover:bg-red-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
          <p className="text-sm text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredBundles.length)} of{" "}
            {filteredBundles.length} bundles
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <span className="flex items-center px-3 text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <BundleModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        bundle={editingBundle}
        onSuccess={() => {
          fetchBundles();
          setEditingBundle(null);
        }}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Bundle"
        description={`Are you sure you want to delete "${bundleToDelete?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}