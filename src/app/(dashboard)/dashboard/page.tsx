import { PaymentProgressCard } from "@/components/dashboard/PaymentProgressCard";
import { PaymentStatusCard } from "@/components/dashboard/PaymentStatusCard";
import { QuickActionsCard } from "@/components/dashboard/QuickActionCard";
import { SystemInfoCard } from "@/components/dashboard/SystemInfoCard";
import { UpcomingPaymentsCard } from "@/components/dashboard/UpcomingPaymentCard";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { getCurrentUser } from "@/lib/auth";



export default async function SolarDashboardPage() {
  const user = await getCurrentUser();

  const systemData = {
    systemId: "SYS-001",
    installDate: "2026-01-15",
    address: "45 Lekki Phase 1, Lagos",
  };

  const products = [
    {
      name: "Solar Panel 300W",
      qty: 4,
    },
    {
      name: "Inverter 2000W",
      qty: 1,
    },
    {
      name: "Battery 150Ah",
      qty: 2,
    },
  ];

  return (
    <div className="space-y-10">
      <WelcomeHeader name={user?.name} />

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-6">
          <SystemInfoCard
            systemId={systemData.systemId}
            installDate={systemData.installDate}
            address={systemData.address}
            products={products}
          />
        </div>
        <div className="lg:col-span-4 space-y-6">
          <PaymentStatusCard />
          <QuickActionsCard/>
        </div>
      </div>

      <PaymentProgressCard />
      <UpcomingPaymentsCard />
    </div>
  );
}
