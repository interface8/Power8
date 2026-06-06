"use client";

import {
  CalendarDays,
  CreditCard,
  User,
  Copy,
  Check,
} from "lucide-react";
import { AdminCreditDetail } from "@/types/admin-credit-detail";
import CreditStatusBadge from "../credit-overview/CreditStatusBadge";
import { useState } from "react";
import { formatCreditId } from "@/utils/formatId";

interface Props {
  account: AdminCreditDetail;
}

export default function CreditDetailsHeader({ account }: Props) {
  const [copied, setCopied] = useState(false);
  const displayId = formatCreditId(account.id);

  const handleCopyId = async () => {
    await navigator.clipboard.writeText(account.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-green-900 via-green-800 to-green-900 p-5 sm:p-6 shadow-xl">
      {/* Animated Background Patterns */}
      <div className="absolute right-0 top-0 -mr-32 -mt-32 h-64 w-64 rounded-full bg-orange-500/5 blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 -mb-32 -ml-32 h-64 w-64 rounded-full bg-orange-500/5 blur-3xl animate-pulse delay-1000" />
      <div className="absolute right-1/3 top-1/2 -translate-y-1/2 h-48 w-48 rounded-full bg-orange-400/5 blur-3xl" />

      <div className="relative flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        {/* Left Section */}
        <div className="flex flex-1 flex-col sm:flex-row sm:items-start gap-4">
          {/* Icon */}
          <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-linear-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/20">
            <CreditCard className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white truncate">
                {account.customer.name}
              </h1>
              <CreditStatusBadge status={account.status} />
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-gray-300">
              <div className="flex items-center gap-1.5">
                <User className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span>Credit Account</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CalendarDays className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span>
                  Created{" "}
                  {new Date(account.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Account ID Card */}
          <div className="group relative rounded-xl bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-2 text-center transition-all hover:bg-white/15">
            <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">
              Account ID
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <p className="text-xs sm:text-sm font-mono font-semibold text-white">
                {displayId}
              </p>
              <button
                onClick={handleCopyId}
                className="rounded-lg p-1 text-gray-400 transition-all hover:bg-white/10 hover:text-white"
                title="Copy full ID"
              >
                {copied ? (
                  <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-green-400" />
                ) : (
                  <Copy className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
