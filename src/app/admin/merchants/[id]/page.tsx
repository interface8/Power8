"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  User,
  Mail,
  Phone,
  FileText,
  Package,
  Layers3,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Loader2,
  MapPin,
  Calendar,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Link from "next/link";

type MerchantStatus = "PENDING" | "APPROVED" | "SUSPENDED";
type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

interface MerchantDetails {
  merchant: {
    id: string;
    userId: string;
    businessName: string;
    businessAddress: string;
    cacNumber: string;
    status: MerchantStatus;
    suspensionReason: string | null;
    contactName: string;
    email: string;
    phone: string;
    createdAt: string;
    updatedAt: string;
  };
  kyc: {
    cacDocumentUrl: string;
    governmentIdUrl: string;
    logoUrl: string | null;
  };
  productCounts: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  products: {
    id: string;
    name: string;
    price: number;
    approvalStatus: ApprovalStatus;
    category: { name: string };
    images: string[];
  }[];
  bundles: {
    id: string;
    name: string;
    totalPrice: number;
    approvalStatus: ApprovalStatus;
  }[];
  ordersSummary: {
    totalOrders: number;
    recentOrders: {
      id: string;
      orderDate: string;
      orderStatus: string;
      customerName: string;
      itemCount: number;
    }[];
  };
}

function StatusBadge({ status }: { status: MerchantStatus }) {
  const map: Record<MerchantStatus, string> = {
    PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
    APPROVED: "bg-green-100 text-green-700 border-green-200",
    SUSPENDED: "bg-red-100 text-red-700 border-red-200",
  };
  const icons: Record<MerchantStatus, React.ReactNode> = {
    PENDING: <Clock className="w-3 h-3" />,
    APPROVED: <CheckCircle2 className="w-3 h-3" />,
    SUSPENDED: <XCircle className="w-3 h-3" />,
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${map[status]}`}>
      {icons[status]}
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

function ApprovalBadge({ status }: { status: ApprovalStatus }) {
  const map: Record<ApprovalStatus, string> = {
    PENDING: "bg-yellow-50 text-yellow-600",
    APPROVED: "bg-green-50 text-green-600",
    REJECTED: "bg-red-50 text-red-600",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${map[status]}`}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

function DocLink({ label, url }: { label: string; url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700 group"
    >
      <FileText className="w-4 h-4 text-gray-400 group-hover:text-orange-500" />
      {label}
      <ExternalLink className="w-3.5 h-3.5 ml-auto text-gray-400 group-hover:text-orange-500" />
    </a>
  );
}

export default function AdminMerchantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const merchantId = params.id as string;

  const [data, setData] = useState<MerchantDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // modals
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [suspendReason, setSuspendReason] = useState("");

  const fetchDetails = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/merchants/${merchantId}`);
      if (!res.ok) {
        toast.error("Merchant not found");
        router.push("/admin/merchants");
        return;
      }
      const json = await res.json();
      setData(json.data);
    } catch {
      toast.error("Failed to load merchant details");
    } finally {
      setLoading(false);
    }
  }, [merchantId, router]);

  useEffect(() => { fetchDetails(); }, [fetchDetails]);

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/merchants/${merchantId}/approve`, { method: "PATCH" });
      const json = await res.json();
      if (!res.ok) { toast.error(json.message || "Failed to approve"); return; }
      toast.success("Merchant approved successfully");
      fetchDetails();
    } catch { toast.error("Failed to approve merchant"); }
    finally { setActionLoading(false); }
  };

  const handleSuspend = async () => {
    if (!suspendReason.trim()) { toast.error("Suspension reason is required"); return; }
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/merchants/${merchantId}/suspend`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: suspendReason.trim() }),
      });
      const json = await res.json();
      if (!res.ok) { toast.error(json.message || "Failed to suspend"); return; }
      toast.success("Merchant suspended");
      setShowSuspendModal(false);
      setSuspendReason("");
      fetchDetails();
    } catch { toast.error("Failed to suspend merchant"); }
    finally { setActionLoading(false); }
  };

  const handleReinstate = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/merchants/${merchantId}/reinstate`, { method: "PATCH" });
      const json = await res.json();
      if (!res.ok) { toast.error(json.message || "Failed to reinstate"); return; }
      toast.success("Merchant reinstated");
      fetchDetails();
    } catch { toast.error("Failed to reinstate merchant"); }
    finally { setActionLoading(false); }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-64 bg-gray-200 rounded-xl" />
            <div className="h-40 bg-gray-200 rounded-xl" />
          </div>
          <div className="h-80 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { merchant, kyc, productCounts, products, bundles, ordersSummary } = data;
  const canApprove = merchant.status === "PENDING";
  const canSuspend = merchant.status === "APPROVED";
  const canReinstate = merchant.status === "SUSPENDED";

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/admin/merchants")} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Merchants
          </button>
        </div>
        <div className="flex items-center gap-2">
          {canApprove && (
            <Button onClick={handleApprove} disabled={actionLoading} className="bg-green-600 hover:bg-green-700 text-white gap-2">
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Approve Merchant
            </Button>
          )}
          {canSuspend && (
            <Button variant="destructive" onClick={() => setShowSuspendModal(true)} disabled={actionLoading} className="gap-2">
              <XCircle className="w-4 h-4" />
              Suspend
            </Button>
          )}
          {canReinstate && (
            <Button onClick={handleReinstate} disabled={actionLoading} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Reinstate
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Business info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-green-100 rounded-xl">
                  <Building2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{merchant.businessName}</h2>
                  <p className="text-sm text-gray-500">CAC: {merchant.cacNumber}</p>
                </div>
              </div>
              <StatusBadge status={merchant.status} />
            </div>

            {merchant.status === "SUSPENDED" && merchant.suspensionReason && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-red-700 mb-0.5">Suspension reason</p>
                  <p className="text-sm text-red-600">{merchant.suspensionReason}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <User className="w-4 h-4 text-gray-400" />
                <span>{merchant.contactName}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>{merchant.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{merchant.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>Joined {new Date(merchant.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</span>
              </div>
              <div className="flex items-start gap-2 text-gray-600 sm:col-span-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                <span>{merchant.businessAddress}</span>
              </div>
            </div>
          </div>

          {/* KYC Documents */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-4">KYC Documents</h3>
            <div className="space-y-3">
              <DocLink label="CAC Certificate / Business Registration" url={kyc.cacDocumentUrl} />
              <DocLink label="Government-Issued ID" url={kyc.governmentIdUrl} />
              {kyc.logoUrl && <DocLink label="Business Logo" url={kyc.logoUrl} />}
            </div>
          </div>

          {/* Products */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2"><Package className="w-4 h-4" />Products ({productCounts.total})</h3>
              <div className="flex gap-2 text-xs">
                <span className="px-2 py-0.5 rounded bg-yellow-100 text-yellow-700">{productCounts.pending} pending</span>
                <span className="px-2 py-0.5 rounded bg-green-100 text-green-700">{productCounts.approved} approved</span>
                <span className="px-2 py-0.5 rounded bg-red-100 text-red-700">{productCounts.rejected} rejected</span>
              </div>
            </div>
            {products.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No products yet</p>
            ) : (
              <div className="space-y-2">
                {products.slice(0, 8).map((p) => (
                  <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{p.name}</p>
                      <p className="text-xs text-gray-400">{p.category.name} · ₦{Number(p.price).toLocaleString()}</p>
                    </div>
                    <ApprovalBadge status={p.approvalStatus} />
                  </div>
                ))}
                {products.length > 8 && <p className="text-xs text-gray-400 text-center pt-2">+{products.length - 8} more products</p>}
              </div>
            )}
          </div>

          {/* Bundles */}
          {bundles.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4"><Layers3 className="w-4 h-4" />Bundles ({bundles.length})</h3>
              <div className="space-y-2">
                {bundles.map((b) => (
                  <div key={b.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{b.name}</p>
                      <p className="text-xs text-gray-400">₦{Number(b.totalPrice).toLocaleString()}</p>
                    </div>
                    <ApprovalBadge status={b.approvalStatus} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column — Orders summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4"><ShoppingCart className="w-4 h-4" />Orders</h3>
            <p className="text-3xl font-bold text-gray-900 mb-1">{ordersSummary.totalOrders}</p>
            <p className="text-xs text-gray-400 mb-4">Total orders containing this merchant's items</p>
            {ordersSummary.recentOrders.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Recent</p>
                {ordersSummary.recentOrders.map((o) => (
                  <div key={o.id} className="flex items-center justify-between text-sm py-1.5 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium text-gray-700 truncate max-w-[120px]">{o.customerName}</p>
                      <p className="text-xs text-gray-400">{o.itemCount} item{o.itemCount !== 1 ? "s" : ""}</p>
                    </div>
                    <Link href={`/admin/orders/${o.id}`} className="text-orange-500 hover:underline text-xs">
                      View →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Suspend Modal */}
      <Dialog open={showSuspendModal} onOpenChange={setShowSuspendModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspend Merchant Account</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <p className="text-sm text-gray-600 mb-3">
              The merchant will be notified and will not be able to log in while suspended.
              Provide a clear reason.
            </p>
            <Textarea
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              placeholder="e.g. KYC documents could not be verified…"
              rows={3}
              className="resize-none"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowSuspendModal(false); setSuspendReason(""); }}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleSuspend} disabled={actionLoading || !suspendReason.trim()}>
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Suspend"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
