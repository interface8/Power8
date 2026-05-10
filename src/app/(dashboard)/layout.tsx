import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { QueryProvider } from "@/components/providers/query-provider";
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <QueryProvider>
      <div className="flex h-screen flex-col overflow-hidden">
        <DashboardNavbar />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </QueryProvider>
  );
}
