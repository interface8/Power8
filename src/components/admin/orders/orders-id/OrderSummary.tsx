"use client";

import {
  User2,
  Wallet,
  MapPin,
  Calendar,
  Receipt,
  Truck,
  Mail,
  Phone,
  CreditCard,
  Package,
  CheckCircle2,
  Clock,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { StatusBadge } from "./StatusBadge";

interface OrderSummaryProps {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  totalAmount: number;
  paymentType: string;
  paymentStatus: string;
  orderStatus: string;
  orderDate: string;
  orderId: string;
  installationAddress?: string | null;
  city?: string | null;
  state?: string | null;
  shippingStatus?: string;
  trackingNumber?: string | null;
  shippingProvider?: string | null;
  totalPaid?: number;
  remainingBalance?: number;
  itemCount?: number;
  paymentMethod?: string;
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
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

interface InfoCardProps {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  value?: string | React.ReactNode;
  badge?: React.ReactNode;
  trend?: string;
}

function InfoCard({
  icon,
  iconBg,
  iconColor,
  label,
  value,
  badge,
  trend,
}: InfoCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-4 transition-all duration-300 hover:border-orange-200 hover:shadow-md hover:-translate-y-0.5">
      {/* Decorative gradient bar */}
      <div className="absolute top-0 left-0 h-1 w-0 bg-linear-to-r from-orange-400 to-orange-500 transition-all duration-300 group-hover:w-full" />

      <div className="relative">
        <div
          className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${iconBg} transition-all duration-300 group-hover:scale-110 group-hover:shadow-md`}
        >
          <div className={iconColor}>{icon}</div>
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          {label}
        </p>
        {badge ? (
          <div className="mt-2">{badge}</div>
        ) : (
          <p className="mt-1 text-sm font-semibold text-gray-900 wrap-break-word">
            {value}
          </p>
        )}
        {trend && <p className="mt-1 text-xs text-gray-400">{trend}</p>}
      </div>
    </div>
  );
}

function StatusIndicator({ status }: { status: string }) {
  const config: Record<string, { icon: React.ReactNode; color: string }> = {
    PAID: {
      icon: <CheckCircle2 className="h-4 w-4" />,
      color: "text-green-500",
    },
    PENDING: { icon: <Clock className="h-4 w-4" />, color: "text-yellow-500" },
    FAILED: {
      icon: <AlertCircle className="h-4 w-4" />,
      color: "text-red-500",
    },
    REFUNDED: {
      icon: <CheckCircle2 className="h-4 w-4" />,
      color: "text-gray-400",
    },
  };

  const { icon, color } = config[status] || config.PENDING;
  return (
    <span className={`inline-flex items-center gap-1 ${color}`}>{icon}</span>
  );
}

export function OrderSummary({
  customerName,
  customerEmail,
  customerPhone,
  totalAmount,
  paymentType,
  paymentStatus,
  orderStatus,
  orderDate,
  orderId,
  installationAddress,
  city,
  state,
  shippingStatus,
  trackingNumber,
  shippingProvider,
  totalPaid,
  remainingBalance,
  itemCount,
}: OrderSummaryProps) {
  const isCreditOrder = paymentType === "CREDIT";
  const displayPaid = totalPaid ?? (paymentStatus === "PAID" ? totalAmount : 0);
  const displayRemaining =
    remainingBalance ?? (paymentStatus === "PAID" ? 0 : totalAmount);

  const [copiedOrderId, setCopiedOrderId] = useState(false);
  const [copiedTrackingNumber, setCopiedTrackingNumber] = useState(false);

  const handleCopyOrderId = async () => {
    try {
      await navigator.clipboard.writeText(orderId);

      setCopiedOrderId(true);
      toast.success("Order ID copied");
      setTimeout(() => {
        setCopiedOrderId(false);
      }, 2000);
    } catch {
      toast.error("Failed to copy Order ID");
    }
  };

  const handleCopyTracking = async () => {
    if (!trackingNumber) return;

    try {
      await navigator.clipboard.writeText(trackingNumber);
      setCopiedTrackingNumber(true);
      toast.success("Tracking number copied");

      setTimeout(() => {
        setCopiedTrackingNumber(false);
      }, 2000);
    } catch {
      toast.error("Failed to copy tracking number");
    }
  };

  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Header with gradient */}
      <div className="border-b border-gray-100 bg-linear-to-r from-orange-50/80 via-amber-50/40 to-white px-6 py-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(orderDate)}
              <span className="w-px h-4 bg-gray-200" />
              <StatusIndicator status={paymentStatus} />
              <span className="capitalize">
                {paymentStatus.toLowerCase().replace("_", " ")}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative overflow-hidden rounded-xl bg-linear-to-br from-orange-500 to-orange-600 px-5 py-3 min-w-35 shadow-lg shadow-orange-200/50">
              <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-white/10" />
              <div className="absolute -bottom-6 -left-6 h-12 w-12 rounded-full bg-white/5" />
              <p className="text-[11px] font-medium text-orange-100 uppercase tracking-wider">
                Total Amount
              </p>
              <p className="text-xl font-bold text-white">
                {formatCurrency(totalAmount)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Main Grid - 4 columns with better spacing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Customer Card */}
          <InfoCard
            icon={<User2 className="h-4 w-4" />}
            iconBg="bg-orange-100"
            iconColor="text-orange-600"
            label="Customer"
            value={
              <div className="space-y-3">
                <div>
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {customerName}
                  </p>

                  <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{customerEmail}</span>
                  </div>

                  {customerPhone && (
                    <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                      <Phone className="h-3 w-3" />
                      <span>{customerPhone}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Order ID
                  </p>

                  <div className="mt-1 flex items-center gap-2">
                    <span className="flex-1 break-all font-mono text-xs text-gray-700">
                      {orderId}
                    </span>

                    <button
                      type="button"
                      onClick={handleCopyOrderId}
                      className="rounded-md border border-gray-200 p-1.5 transition-all hover:border-orange-300 hover:bg-orange-50"
                    >
                      {copiedOrderId ? (
                        <Check className="h-3.5 w-3.5 text-green-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            }
          />

          {/* Order Info Card */}
          <InfoCard
            icon={<Receipt className="h-4 w-4" />}
            iconBg="bg-indigo-100"
            iconColor="text-indigo-600"
            label="Order Details"
            value={
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">
                    {itemCount || 0} items
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <StatusBadge status={orderStatus} size="sm" />
                </div>
                <p className="text-xs text-gray-500">
                  {paymentType === "CREDIT" ? "Credit Payment" : "Full Payment"}
                </p>
              </div>
            }
          />

          {/* Payment Card */}
          <InfoCard
            icon={<Wallet className="h-4 w-4" />}
            iconBg="bg-green-100"
            iconColor="text-green-600"
            label="Payment"
            value={
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <StatusBadge status={paymentStatus} size="sm" />
                  <StatusBadge status={paymentType} size="sm" />
                </div>
                {isCreditOrder && (
                  <div className="mt-1.5 space-y-0.5 text-xs">
                    <div className="flex justify-between text-gray-500">
                      <span>Paid:</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(displayPaid)}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Remaining:</span>
                      <span className="font-medium text-orange-500">
                        {formatCurrency(displayRemaining)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            }
          />

          {/* Shipping Card */}
          <InfoCard
            icon={<Truck className="h-4 w-4" />}
            iconBg="bg-purple-100"
            iconColor="text-purple-600"
            label="Shipping"
            value={
              <div className="space-y-1.5">
                <StatusBadge status={shippingStatus || "PENDING"} size="sm" />
                {trackingNumber && (
                  <div className="mt-1.5">
                    <p className="text-[11px] font-medium text-gray-500">
                      Tracking Number
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="flex-1 truncate font-mono text-xs text-gray-700">
                        {trackingNumber}
                      </p>

                        <button
                      type="button"
                      onClick={handleCopyTracking}
                      className="rounded-md border border-gray-200 p-1.5 transition-all hover:border-orange-300 hover:bg-orange-50"
                    >
                      {copiedTrackingNumber ? (
                        <Check className="h-3.5 w-3.5 text-green-600" />
                      ) : (  
                        <Copy className="h-3.5 w-3.5 text-gray-500" />
                      )}
                    </button>
                    </div>
                  </div>
                )}
                {shippingProvider && (
                  <p className="text-xs text-gray-400">{shippingProvider}</p>
                )}
              </div>
            }
          />
        </div>

        {/* Installation Address - More prominent design */}
        {(installationAddress || city || state) && (
          <div className="mt-5 rounded-xl border border-blue-100 bg-linear-to-r from-blue-50/50 to-white p-4 transition-all hover:border-blue-200 hover:shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 shadow-sm">
                <MapPin className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  Installation Address
                  <span className="text-xs font-normal text-gray-400">
                    • Delivery Location
                  </span>
                </p>
                <p className="text-sm text-gray-600 mt-0.5">
                  {installationAddress && `${installationAddress}, `}
                  {city && `${city}, `}
                  {state && state}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer Timeline */}
        <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-gray-400 border-t border-gray-100 pt-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-orange-500"  />
            <span className="font-medium text-gray-600">
              Order placed:{" "}
              <span className="text-gray-600">{formatDate(orderDate)}</span>
            </span>
          </div>
          <span className="text-gray-500">|</span>
          <div className="flex items-center gap-1.5">
            <CreditCard className="h-3.5 w-3.5 text-green-500" />
            <span className="capitalize text-gray-600 font-medium">
              {paymentType === "CREDIT"
                ? `Credit • ${paymentStatus.toLowerCase().replace("_", " ")}`
                : `Full Payment • ${paymentStatus.toLowerCase().replace("_", " ") }`}
            </span>
          </div>
          {trackingNumber && (
            <>
              <span className="text-gray-500">|</span>
              <div className="flex items-center gap-1.5">
                <Package className="h-3.5 w-3.5 text-blue-500" />
                <span className="text-gray-600 font-medium">
                  Tracking:{" "}
                  <span className="text-gray-600 font-medium">
                    {trackingNumber}
                  </span>
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
