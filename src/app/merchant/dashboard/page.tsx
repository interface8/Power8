"use client";

import { useState, useEffect } from "react";
import { MerchantStatsCards } from "@/components/merchant/dashboard/MerchantStatsCards";
import { RecentActivity } from "@/components/merchant/dashboard/RecentActivity";
import { QuickActions } from "@/components/merchant/dashboard/QucikActions";
import { MonthlyStats } from "@/components/merchant/dashboard/MonthlyStats";
import type {
  MerchantStats,
  Activity,
  MonthlyStats as MonthlyStatsType,
} from "@/types/merchant";
import {
  Copy,
  ExternalLink,
  CheckCheck,
  Store,
} from "lucide-react";

const ACTIVITY_TYPE_MAP: Record<string, Activity["type"]> = {
  PRODUCT_SUBMITTED: "submitted",
  PRODUCT_APPROVED: "approved",
  PRODUCT_REJECTED: "rejected",
  BUNDLE_SUBMITTED: "bundle",
  BUNDLE_APPROVED: "bundle",
  BUNDLE_REJECTED: "bundle",
  NEW_ORDER: "order",
  MERCHANT_APPROVED: "approved",
  MERCHANT_SUSPENDED: "rejected",
  MERCHANT_REINSTATED: "approved",
};

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);

  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;

  const hrs = Math.floor(mins / 60);

  if (hrs < 24) return `${hrs}h ago`;

  const days = Math.floor(hrs / 24);

  return `${days}d ago`;
}

export default function MerchantDashboardPage() {
  const [stats, setStats] = useState<MerchantStats>({
    totalProducts: 0,
    pendingApproval: 0,
    approvedLive: 0,
    rejected: 0,
  });

  const [activities, setActivities] = useState<Activity[]>([]);

  const [monthlyStats, setMonthlyStats] =
    useState<MonthlyStatsType>({
      ordersReceived: 0,
      productsActive: 0,
      bundlesLive: 0,
    });

  const [loading, setLoading] = useState(true);

  // Storefront link state
  const [storefrontLink, setStorefrontLink] =
    useState<string | null>(null);

  // Copy button state
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/merchants/stats");

        if (!res.ok) return;

        const json = await res.json();
        const d = json.data;

        setStats({
          totalProducts: d.totalProducts ?? 0,
          pendingApproval: d.pendingProducts ?? 0,
          approvedLive: d.approvedProducts ?? 0,
          rejected: d.rejectedProducts ?? 0,
        });

        const mappedActivities: Activity[] = (
          d.recentActivity ?? []
        ).map(
          (a: {
            id: string;
            type: string;
            message: string;
            createdAt: string;
          }) => ({
            id: a.id,
            title: a.type
              .replace(/_/g, " ")
              .replace(/\b\w/g, (c: string) =>
                c.toUpperCase()
              ),
            description: a.message,
            time: timeAgo(a.createdAt),
            type:
              ACTIVITY_TYPE_MAP[a.type] ?? "submitted",
          })
        );

        setActivities(mappedActivities);

        setMonthlyStats({
          ordersReceived: d.totalOrders ?? 0,
          productsActive: d.approvedProducts ?? 0,
          bundlesLive: 0,
        });
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };

    const fetchStorefrontLink = async () => {
      try {
        const res = await fetch(
          "/api/merchants/storefront-link"
        );

        const json = await res.json();

        if (res.ok) {
          setStorefrontLink(json.data.link);
        }
      } catch {
        // silently fail
      }
    };

    fetchDashboard();
    fetchStorefrontLink();
  }, []);

  return (
    <div className="space-y-6">
      {/* Dashboard heading */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Welcome back! Here&apos;s an overview of your store
        </p>
      </div>

      {/* Shareable store link */}
      {storefrontLink && (
        <div className="bg-gradient-to-r from-green-800 to-green-700 rounded-xl p-4 text-white">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold mb-1 flex items-center gap-2">
                <Store size={14} />
                Your store link
              </p>

              <p className="text-xs text-white/70 mb-2">
                Share this link with customers to visit your
                store directly
              </p>

              <div className="bg-white/10 rounded-lg px-3 py-2 text-xs text-white/90 font-mono truncate">
                {storefrontLink}
              </div>
            </div>

            <div className="flex flex-col gap-2 shrink-0">
              {/* Copy button */}
              <button
                onClick={async () => {
                  await navigator.clipboard.writeText(
                    storefrontLink
                  );

                  setCopied(true);

                  setTimeout(
                    () => setCopied(false),
                    2000
                  );
                }}
                className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-1.5 rounded-lg transition font-medium"
              >
                {copied ? (
                  <CheckCheck size={13} />
                ) : (
                  <Copy size={13} />
                )}

                {copied ? "Copied!" : "Copy"}
              </button>

              {/* Preview button */}
              <a
                href={storefrontLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1.5 rounded-lg transition font-medium"
              >
                <ExternalLink size={13} />
                Preview
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Merchant statistics */}
      <MerchantStatsCards stats={stats} />

      {/* Recent activity and quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {loading ? (
            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3 animate-pulse">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-14 bg-gray-100 rounded"
                />
              ))}
            </div>
          ) : (
            <RecentActivity activities={activities} />
          )}
        </div>

        <div className="lg:col-span-1">
          <QuickActions />
        </div>
      </div>

      {/* Monthly statistics */}
      <MonthlyStats stats={monthlyStats} />
    </div>
  );
}
