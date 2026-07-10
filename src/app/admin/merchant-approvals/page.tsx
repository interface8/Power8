"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ClipboardCheck,
  Package,
  Layers3,
  CheckCircle2,
  XCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ImageIcon,
  AlertTriangle,
  Building2,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

// ─── Types ──────────────────────────────────────────────

interface MerchantRef {
  id: string;
  businessName: string;
  contactName: string;
  email: string;
}

interface PendingProduct {
  id: string;
  merchant: MerchantRef;
  name: string;
  description: string | null;
  category: { id: string; name: string };
  price: number;
  warranty: number;
  capacity: number;
  stockQuantity: number;
  images: string[];
  createdAt: string;
}

interface PendingBundle {
  id: string;
  merchant: MerchantRef;
  name: string;
  totalPrice: number;
  systemCapacityKw: number | null;
  description: string | null;
  items: {
    id: string;
    quantity: number;
    merchantProduct: { id: string; name: string; images: string[] };
  }[];
  createdAt: string;
}

// ─── Helper: thumbnail ──────────────────────────────────
function Thumbnail({ images }: { images: string[] }) {
  if (!images.length) {
    return (
      <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
        <ImageIcon className="w-5 h-5 text-gray-300" />
      </div>
    );
  }
  return (
    <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-gray-200 bg-gray-50">
      <Image src={images[0]} alt="" width={56} height={56} className="w-full h-full object-cover" />
    </div>
  );
}

// ─── Reject modal ──────────────────────────────────────
function RejectModal({
  open,
  onClose,
  onConfirm,
  loading,
  name,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  loading: boolean;
  name: string;
}) {
  const [reason, setReason] = useState("");
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject "{name}"</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <p className="text-sm text-gray-600 mb-3">
            Provide a clear reason for rejection. The merchant will see this.
          </p>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Product images are unclear, price is not in NGN…"
            rows={3}
            className="resize-none"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" disabled={loading || !reason.trim()} onClick={() => onConfirm(reason.trim())}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Reject"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Products tab ───────────────────────────────────────
function ProductsQueue() {
  const [products, setProducts] = useState<PendingProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [rejectTarget, setRejectTarget] = useState<PendingProduct | null>(null);
  const limit = 10;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/merchant-products/pending?${params}`);
      const json = await res.json();
      setProducts(json.data ?? []);
      setTotalPages(json.pagination?.totalPages ?? 1);
      setTotal(json.pagination?.total ?? 0);
    } catch { toast.error("Failed to load pending products"); }
    finally { setLoading(false); }
  }, [search, page]);

  useEffect(() => { const t = setTimeout(fetchProducts, 300); return () => clearTimeout(t); }, [fetchProducts]);

  const handleApprove = async (id: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/merchant-products/${id}/approve`, { method: "PATCH" });
      const json = await res.json();
      if (!res.ok) { toast.error(json.message || "Failed"); return; }
      toast.success("Product approved");
      fetchProducts();
    } catch { toast.error("Failed to approve"); }
    finally { setActionLoading(false); }
  };

  const handleReject = async (id: string, reason: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/merchant-products/${id}/reject`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      const json = await res.json();
      if (!res.ok) { toast.error(json.message || "Failed"); return; }
      toast.success("Product rejected");
      setRejectTarget(null);
      fetchProducts();
    } catch { toast.error("Failed to reject"); }
    finally { setActionLoading(false); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search products or merchants…" className="pl-9 h-10" />
        </div>
        <span className="text-sm text-gray-500 shrink-0">{total} pending</span>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <CheckCircle2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No pending products</p>
          <p className="text-sm mt-1">All product submissions have been reviewed</p>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row sm:items-start gap-4">
              <Thumbnail images={p.images} />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <p className="font-semibold text-gray-900">{p.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Building2 className="w-3 h-3 text-gray-400" />
                      <Link href={`/admin/merchants/${p.merchant.id}`} className="text-xs text-orange-600 hover:underline">{p.merchant.businessName}</Link>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" onClick={() => handleApprove(p.id)} disabled={actionLoading} className="bg-green-600 hover:bg-green-700 text-white h-8 px-3">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />Approve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => setRejectTarget(p)} disabled={actionLoading} className="h-8 px-3">
                      <XCircle className="w-3.5 h-3.5 mr-1" />Reject
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                  <span>Category: {p.category.name}</span>
                  <span>₦{Number(p.price).toLocaleString()}</span>
                  <span>Capacity: {p.capacity}W</span>
                  <span>Warranty: {p.warranty} yr</span>
                  <span>Stock: {p.stockQuantity}</span>
                  <span>Submitted: {new Date(p.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</span>
                </div>
                {p.description && (
                  <p className="text-xs text-gray-400 mt-1.5 line-clamp-2">{p.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft className="w-4 h-4" /></Button>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}><ChevronRight className="w-4 h-4" /></Button>
          </div>
        </div>
      )}

      {rejectTarget && (
        <RejectModal
          open={!!rejectTarget}
          onClose={() => setRejectTarget(null)}
          onConfirm={(reason) => handleReject(rejectTarget.id, reason)}
          loading={actionLoading}
          name={rejectTarget.name}
        />
      )}
    </div>
  );
}

// ─── Bundles tab ────────────────────────────────────────
function BundlesQueue() {
  const [bundles, setBundles] = useState<PendingBundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [rejectTarget, setRejectTarget] = useState<PendingBundle | null>(null);
  const limit = 10;

  const fetchBundles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
      const res = await fetch(`/api/admin/merchant-bundles/pending?${params}`);
      const json = await res.json();
      setBundles(json.data ?? []);
      setTotalPages(json.pagination?.totalPages ?? 1);
      setTotal(json.pagination?.total ?? 0);
    } catch { toast.error("Failed to load pending bundles"); }
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { fetchBundles(); }, [fetchBundles]);

  const handleApprove = async (id: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/merchant-bundles/${id}/approve`, { method: "PATCH" });
      const json = await res.json();
      if (!res.ok) { toast.error(json.message || "Failed"); return; }
      toast.success("Bundle approved");
      fetchBundles();
    } catch { toast.error("Failed to approve"); }
    finally { setActionLoading(false); }
  };

  const handleReject = async (id: string, reason: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/merchant-bundles/${id}/reject`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      const json = await res.json();
      if (!res.ok) { toast.error(json.message || "Failed"); return; }
      toast.success("Bundle rejected");
      setRejectTarget(null);
      fetchBundles();
    } catch { toast.error("Failed to reject"); }
    finally { setActionLoading(false); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{total} pending</span>
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />)}</div>
      ) : bundles.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <CheckCircle2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No pending bundles</p>
          <p className="text-sm mt-1">All bundle submissions have been reviewed</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bundles.map((b) => (
            <div key={b.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div>
                  <p className="font-semibold text-gray-900">{b.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Building2 className="w-3 h-3 text-gray-400" />
                    <Link href={`/admin/merchants/${b.merchant.id}`} className="text-xs text-orange-600 hover:underline">{b.merchant.businessName}</Link>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" onClick={() => handleApprove(b.id)} disabled={actionLoading} className="bg-green-600 hover:bg-green-700 text-white h-8 px-3">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />Approve
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => setRejectTarget(b)} disabled={actionLoading} className="h-8 px-3">
                    <XCircle className="w-3.5 h-3.5 mr-1" />Reject
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                <span>₦{Number(b.totalPrice).toLocaleString()}</span>
                {b.systemCapacityKw && <span>{b.systemCapacityKw} kW</span>}
                <span>{b.items.length} product{b.items.length !== 1 ? "s" : ""}</span>
                <span>Submitted: {new Date(b.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</span>
              </div>
              {b.items.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {b.items.map((item) => (
                    <span key={item.id} className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                      {item.merchantProduct.name} ×{item.quantity}
                    </span>
                  ))}
                </div>
              )}
              {b.description && <p className="text-xs text-gray-400 mt-2 line-clamp-2">{b.description}</p>}
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft className="w-4 h-4" /></Button>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}><ChevronRight className="w-4 h-4" /></Button>
          </div>
        </div>
      )}

      {rejectTarget && (
        <RejectModal
          open={!!rejectTarget}
          onClose={() => setRejectTarget(null)}
          onConfirm={(reason) => handleReject(rejectTarget.id, reason)}
          loading={actionLoading}
          name={rejectTarget.name}
        />
      )}
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────
export default function AdminMerchantApprovalsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Product Approvals</h1>
        <p className="text-sm text-gray-500 mt-1">
          Review and approve or reject merchant product and bundle submissions
        </p>
      </div>

      <Tabs defaultValue="products">
        <TabsList className="mb-4">
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Products
          </TabsTrigger>
          <TabsTrigger value="bundles" className="flex items-center gap-2">
            <Layers3 className="w-4 h-4" />
            Bundles
          </TabsTrigger>
        </TabsList>
        <TabsContent value="products"><ProductsQueue /></TabsContent>
        <TabsContent value="bundles"><BundlesQueue /></TabsContent>
      </Tabs>
    </div>
  );
}
