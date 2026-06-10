"use client";

import {
  Mail,
  MapPin,
  Phone,
  User,
  Copy,
  Check,
} from "lucide-react";
import { AdminCreditDetail } from "@/types/admin-credit-detail";
import { useState } from "react";

interface Props {
  account: AdminCreditDetail;
}

function InfoItem({
  icon,
  label,
  value,
  copyable,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  copyable?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!copyable) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group rounded-xl border border-gray-100 bg-gray-50/30 p-4 transition-all hover:border-orange-200 hover:bg-orange-50/20">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          {icon}
          <span>{label}</span>
        </div>
        {copyable && (
          <button
            onClick={handleCopy}
            className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-orange-500"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        )}
      </div>
      <p className="font-semibold text-gray-900 wrap-break-word">{value || "-"}</p>
    </div>
  );
}

export default function CreditCustomerCard({ account }: Props) {
  const initials = account.customer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-100 bg-linear-to-r from-orange-50/30 to-white px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-orange-400 to-orange-600 text-white font-bold shadow-md">
            {initials}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Customer Information
            </h2>
            <p className="text-sm text-gray-500">Contact and order details</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <InfoItem
            icon={<User className="h-4 w-4" />}
            label="Customer Name"
            value={account.customer.name}
          />
          <InfoItem
            icon={<User className="h-4 w-4" />}
            label="Order ID"
            value={account.order.id}
            copyable
          />
          <InfoItem
            icon={<Mail className="h-4 w-4" />}
            label="Email Address"
            value={account.customer.email}
            copyable
          />
          <InfoItem
            icon={<Phone className="h-4 w-4" />}
            label="Phone Number"
            value={account.customer.phone}
          />
          <div className="md:col-span-2">
            <InfoItem
              icon={<MapPin className="h-4 w-4" />}
              label="Installation Address"
              value={`${account.installation.address ?? "-"}, ${account.installation.city ?? "-"}, ${account.installation.state ?? "-"}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
