"use client";

import { useMemo, useState } from "react";

import { creditAccounts } from "@/data/creditAccount";
import {
  CreditStatus,
} from "@/types/credit-account";

import CreditAccountsTabs from "./CreditAccountsTabs";
import CreditAccountsTable from "./CreditAccountTable";

type Filter =
  | "ALL"
  | CreditStatus;

export default function CreditAccountsPage() {
  const [activeFilter, setActiveFilter] =
    useState<Filter>("ALL");

  const filteredAccounts = useMemo(() => {
    if (activeFilter === "ALL") {
      return creditAccounts;
    }

    return creditAccounts.filter(
      (account) =>
        account.status === activeFilter
    );
  }, [activeFilter]);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Credit Accounts
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage all customer credit
          accounts.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <CreditAccountsTabs
          activeFilter={activeFilter}
          onChange={setActiveFilter}
        />

        <CreditAccountsTable
          accounts={filteredAccounts}
        />
      </div>
    </section>
  );
}