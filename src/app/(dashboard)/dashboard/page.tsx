"use client";

import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { SystemInfoCard } from "@/components/dashboard/SystemInfoCard";
import { PaymentStatusCard } from "@/components/dashboard/PaymentStatusCard";
import { QuickActionsCard } from "@/components/dashboard/QuickActionCard";
import { PaymentProgressCard } from "@/components/dashboard/PaymentProgressCard";
import { UpcomingPaymentsCard } from "@/components/dashboard/UpcomingPaymentCard";

import { useUserSystems } from "@/hooks/use-system";
import { usePaymentSummary } from "@/hooks/use-dashboard";
import { useAuth } from "@/components/providers/auth-provider";

export default function SolarDashboardPage() {
  const user = useAuth();
  const { data: systemsData = [], isLoading: systemsLoading } =
    useUserSystems();
  const { data: paymentData, isLoading: paymentLoading } = usePaymentSummary();

  const currentSystem = systemsData[0];

  const products = currentSystem?.bundleName
    ? [{ name: currentSystem.bundleName, qty: 1 }]
    : [
        { name: "Solar Panel 300W", qty: 4 },
        { name: "Inverter 2000W", qty: 1 },
        { name: "Battery 150Ah", qty: 2 },
      ];



  return (
    <div className="space-y-10 px-4 md:px-0">
      <WelcomeHeader name={user?.name} />

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <SystemInfoCard
            systemId={currentSystem?.id || "SYS-000"}
            installDate={
              currentSystem?.createdAt
                ? new Date(currentSystem.createdAt).toISOString().split("T")[0]
                : "0000-00-00"
            }
            address="45 Lekki Phase 1, Lagos"
            products={products}
            systemStatus={currentSystem?.status}
            isLoading={systemsLoading}
          />
        </div>

        <div className="lg:col-span-4 space-y-6">
          <PaymentStatusCard
            paymentData={paymentData}
            systemStatus={currentSystem?.status}
            isLoading={paymentLoading}
          />
          <QuickActionsCard />
        </div>
      </div>

      <PaymentProgressCard
        paymentProgress={paymentData}
        isLoading={paymentLoading}
      />
      <UpcomingPaymentsCard />
    </div>
  );
}
