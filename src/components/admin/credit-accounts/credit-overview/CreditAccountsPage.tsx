"use client";

import { useState } from "react";
import { CreditStatus } from "@/types/admin-credit";
import { useAdminCredits } from "@/hooks/use-admin-credits";
import CreditAccountsTableSkeleton from "./CreditAccountsTableSkeleton";
import CreditAccountsEmptyState from "./CreditAccountsEmptyState";
import CreditAccountsTabs from "./CreditAccountsTabs";
import CreditAccountsTable from "./CreditAccountTable";

type Filter = "ALL" | CreditStatus;

export default function CreditAccountsPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>("ALL");

  const { data, isLoading, error } = useAdminCredits({
    status: activeFilter === "ALL" ? undefined : activeFilter,
    page: 1,
    limit: 20,
  });

  if (isLoading && !data) {
    return (
      <section className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Credit Accounts</h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage all customer credit accounts.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <CreditAccountsTabs
            activeFilter={activeFilter}
            onChange={setActiveFilter}
          />

          <CreditAccountsTableSkeleton />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <div className="flex h-80 items-center justify-center text-red-500">
        Failed to load credit accounts.
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Credit Accounts</h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage all customer credit accounts.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <CreditAccountsTabs
          activeFilter={activeFilter}
          onChange={setActiveFilter}
        />

        {data?.data?.length ? (
          <CreditAccountsTable accounts={data.data} />
        ) : (
          <CreditAccountsEmptyState
            status={activeFilter === "ALL" ? undefined : activeFilter}
          />
        )}
      </div>
    </section>
  );
}
