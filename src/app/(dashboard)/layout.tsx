import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AuthProvider } from "@/components/providers/auth-provider";
// import { DashboardSidebar } from "@/components/dashboard/sidebar";
// import { DashboardHeader } from "@/components/dashboard/header";
import PublicNavbar from "@/components/shared/PublicNavbar";

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
    <AuthProvider user={user}>
      <div className="flex h-screen bg-gray-50 pt-16">
      <PublicNavbar />
        <div className="flex flex-1 flex-col overflow-hidden">
          
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </AuthProvider>
  );
}
