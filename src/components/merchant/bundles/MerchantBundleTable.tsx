"use client";

import { Trash2, Package, CheckCircle2, Clock, XCircle } from "lucide-react";
import { MerchantBundle } from "@/types/merchant-bundles";

interface MerchantBundleTableProps {
  bundles: MerchantBundle[];
  onDelete?: (id: string) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
    APPROVED: {
      color: "bg-green-100 text-green-700",
      icon: <CheckCircle2 className="h-3 w-3" />,
      label: "Approved",
    },
    PENDING: {
      color: "bg-yellow-100 text-yellow-700",
      icon: <Clock className="h-3 w-3" />,
      label: "Pending",
    },
    REJECTED: {
      color: "bg-red-100 text-red-700",
      icon: <XCircle className="h-3 w-3" />,
      label: "Rejected",
    },
  };

  const { color, icon, label } = config[status] || config.PENDING;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
      {icon}
      {label}
    </span>
  );
};

const TableHeader = () => (
  <thead className="border-b border-gray-200 bg-gray-50">
    <tr>
      {["Bundle Name", "Total Price", "Capacity", "Items", "Status", "Date Created", "Actions"].map((header) => (
        <th key={header} className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">
          {header}
        </th>
      ))}
    </tr>
  </thead>
);

const TableRow = ({ bundle, onDelete }: { bundle: MerchantBundle; onDelete?: (id: string) => void }) => (
  <tr className="border-b border-gray-100 transition-colors hover:bg-orange-50/30">
    <td className="px-3 sm:px-4 py-4">
      <div className="flex items-center gap-2">
        <Package className="h-4 w-4 text-gray-400" />
        <span className="text-sm font-medium text-gray-900">{bundle.name}</span>
      </div>
    </td>
    <td className="px-3 sm:px-4 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">
      {formatCurrency(bundle.totalPrice)}
    </td>
    <td className="px-3 sm:px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
      {bundle.capacity}
    </td>
    <td className="px-3 sm:px-4 py-4 text-sm text-gray-600">
      {bundle.itemsCount} products
    </td>
    <td className="px-3 sm:px-4 py-4">
      <StatusBadge status={bundle.status} />
    </td>
    <td className="px-3 sm:px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
      {formatDate(bundle.createdAt)}
    </td>
    <td className="px-3 sm:px-4 py-4">
      <button
        onClick={() => onDelete?.(bundle.id)}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 hover:scale-105 active:scale-95"
        aria-label="Delete bundle"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </td>
  </tr>
);

export function MerchantBundleTable({ bundles, onDelete }: MerchantBundleTableProps) {
  if (bundles.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-gray-100 p-3 mb-3">
            <Package className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-gray-500">No bundles found</p>
          <p className="text-sm text-gray-400 mt-1">Create your first bundle to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl sm:rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full">
          <TableHeader />
          <tbody>
            {bundles.map((bundle) => (
              <TableRow key={bundle.id} bundle={bundle} onDelete={onDelete} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}