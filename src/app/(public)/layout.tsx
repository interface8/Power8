"use client"
import PublicNavbar from "@/components/shared/PublicNavbar";
import { usePathname } from "next/navigation";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
   const pathname = usePathname();
   const hideNavbar =  pathname === "/login" || pathname === "/register";

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-br from-orange-50 via-yellow-50 to-white">
  
       {!hideNavbar && <PublicNavbar />}
      <div className={`w-full ${!hideNavbar ? "pt-16" : ""}`}>{children}</div>
    </div>
  );
}
