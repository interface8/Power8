"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/dashboard/AdminSidebar";
import AdminHeader from "@/components/admin/dashboard/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main Content - Proper margin on desktop to prevent overlap */}
      <div className="lg:ml-20 xl:ml-20 transition-all duration-300">
        <AdminHeader setOpen={setSidebarOpen} />

        {/* Main content */}
        <main className="overflow-x-hidden">
          <div className="w-full px-3 sm:px-4 md:px-6 py-4 sm:py-6">
            <div className="w-full max-w-400 mx-auto">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
