"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Eye,
  Store,
  CheckCircle2,
  Clock,
  XCircle,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

type MerchantStatus = "PENDING" | "APPROVED" | "SUSPENDED";

interface MerchantRow {
  id: string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  cacNumber: string;
  status: MerchantStatus;
  suspensionReason: string | null;
  createdAt: string;
  productCounts: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StatusBadge({ status }: { status: MerchantStatus }) {
  const map = {
    PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
    APPROVED: "bg-green-100 text-green-700 border-green-200",
    SUSPENDED: "bg-red-100 text-red-700 border-red-200",
  };
  const icons = {
    PENDING: <Clock className="w-3 h-3" />,
    APPROVED: <CheckCircle2 className="w-3 h-3" />,
    SUSPENDED: <XCircle className="w-3 h-3" />,
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${map[status]}`}>
      {icons[status]}
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

const SkeletonRow = () => (
  <TableRow className="animate-pulse">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <TableCell key={i}><div className="h-4 bg-gray-200 rounded w-full" /></TableCell>
    ))}
  </TableRow>
);

export default function AdminMerchantsPage() {
  const [merchants, setMerchants] = useState<MerchantRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusCounts, setStatusCounts] = useState({ pending: 0, approved: 0, suspended: 0 });
  const limit = 15;

  const fetchMerchants = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
      if (search) params.set("search", search);
      if (status !== "all") params.set("status", status);

      // Fetch merchants + overall counts in parallel
      const [res, pendingRes, approvedRes, suspendedRes] = await Promise.all([
        fetch(`/api/admin/merchants?${params}`),
        fetch("/api/admin/merchants?status=PENDING&limit=1"),
        fetch("/api/admin/merchants?status=APPROVED&limit=1"),
        fetch("/api/admin/merchants?status=SUSPENDED&limit=1"),
      ]);

      if (!res.ok) throw new Error("Failed to load merchants");
      const json = await res.json();
      setMerchants(json.data ?? []);
      setTotalPages(json.pagination?.totalPages ?? 1);
      setTotal(json.pagination?.total ?? 0);

      const [pj, aj, sj] = await Promise.all([pendingRes.json(), approvedRes.json(), suspendedRes.json()]);
      setStatusCounts({
        pending: pj.pagination?.total ?? 0,
        approved: aj.pagination?.total ?? 0,
        suspended: sj.pagination?.total ?? 0,
      });
    } catch {
      toast.error("Failed to load merchants");
    } finally {
      setLoading(false);
    }
  }, [search, status, page]);

      useEffect(() => { const timer = setTimeout(fetchMerchants, 300); return () => clearTimeout(timer); }, [fetchMerchants]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Merchants</h1>
          <p className="text-sm text-gray-500 mt-1">
            Review KYC applications and manage merchant accounts
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total", value: total, icon: Store, color: "text-gray-700 bg-gray-100" },
          { label: "Pending", value: statusCounts.pending, icon: Clock, color: "text-yellow-700 bg-yellow-100" },
          { label: "Approved", value: statusCounts.approved, icon: CheckCircle2, color: "text-green-700 bg-green-100" },
          { label: "Suspended", value: statusCounts.suspended, icon: XCircle, color: "text-red-700 bg-red-100" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className={`p-2 rounded-lg ${color}`}><Icon className="w-4 h-4" /></div>
            <div>
              <p className="text-xs text-gray-500">{label}</p>
              <p className="text-xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, email, CAC number…"
            className="pl-9 h-10"
          />
        </div>
        <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-44 h-10">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="SUSPENDED">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Business</TableHead>
              <TableHead className="hidden md:table-cell">Contact</TableHead>
              <TableHead className="hidden lg:table-cell">CAC Number</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden sm:table-cell">Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}
            {!loading && merchants.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-gray-400">
                  <Store className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  No merchants found
                </TableCell>
              </TableRow>
            )}
            {!loading && merchants.map((m) => (
              <TableRow key={m.id} className="hover:bg-gray-50">
                <TableCell>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{m.businessName}</p>
                    <p className="text-xs text-gray-500 md:hidden">{m.email}</p>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div>
                    <p className="text-sm text-gray-700">{m.contactName}</p>
                    <p className="text-xs text-gray-400">{m.email}</p>
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <span className="text-sm font-mono text-gray-600">{m.cacNumber}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-sm text-gray-700">{m.productCounts.total}</span>
                    {m.productCounts.pending > 0 && (
                      <Badge variant="secondary" className="text-xs px-1.5 py-0 bg-yellow-100 text-yellow-700">
                        {m.productCounts.pending} pending
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell><StatusBadge status={m.status} /></TableCell>
                <TableCell className="hidden sm:table-cell text-sm text-gray-500">{formatDate(m.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/admin/merchants/${m.id}`}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page {page} of {totalPages} — {total} merchants
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
