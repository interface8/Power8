"use client";

import { AlertCircle } from "lucide-react";

import { useAdminCreditDetails } from "@/hooks/use-admin-credits";

import CreditDetailsHeader from "./CreditDetailsHeader";
import CreditCustomerCard from "./CreditCustomerCard";
import CreditSummaryCards from "./CreditSummaryCards";
import CreditScheduleTable from "./CreditScheduleTable";
import CreditDetailsSkeleton from "./CreditDetailsSkeleton";
import CreditAnalyticsCards from "./CreditAnalyticsCards";

interface Props {
  id: string;
}

export default function CreditAccountDetailsPage({ id }: Props) {
  const { data, isLoading, error } = useAdminCreditDetails(id);

  if (isLoading) {
    return <CreditDetailsSkeleton />;
  }

  if (error || !data?.data) {
    return (
      <div className="flex min-h-125 flex-col items-center justify-center rounded-2xl border bg-white">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />

        <h3 className="text-lg font-semibold">Credit Account Not Found</h3>

        <p className="mt-2 text-sm text-gray-500">
          Unable to retrieve credit details.
        </p>
      </div>
    );
  }

  const account = data.data;

  return (
    <section className="space-y-6">
      <CreditDetailsHeader account={account} />

      <CreditSummaryCards account={account} />

      <CreditCustomerCard account={account} />

      <CreditAnalyticsCards account={account} />

      <CreditScheduleTable schedules={account.schedules} />
    </section>
  );
}
