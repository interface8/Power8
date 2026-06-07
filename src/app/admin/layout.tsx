"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/dashboard/AdminSidebar";
import AdminHeader from "@/components/admin/dashboard/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsExpanded(document.body.getAttribute("data-sidebar-expanded") === "true");
    });
    
    observer.observe(document.body, { attributes: true });
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main Content - dynamic margin based on sidebar expansion */}
      <div className={`transition-all duration-300 ${isExpanded ? "lg:ml-64" : "lg:ml-20"}`}>
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