// "use client";
// import PublicNavbar from "@/components/shared/PublicNavbar";
// import { usePathname } from "next/navigation";

// export default function PublicLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const pathname = usePathname();
//   const hideNavbar = pathname === "/login" || pathname === "/register";

//   return (
//     <div className="flex flex-col min-h-screen">
//       {!hideNavbar && <PublicNavbar />}
//       <main className={`!hideNavbar || "pt-16"`}>{children}</main>
//     </div>
//   );
// }

"use client";

import PublicNavbar from "@/components/shared/PublicNavbar";
import { usePathname } from "next/navigation";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideNavbar = pathname === "/login" || pathname === "/register" || pathname === "/forgot-password" || pathname === "/reset-password";

  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavbar && <PublicNavbar />}

      {/* Only push content down when navbar exists */}
      <main className={!hideNavbar ? "pt-10" : ""}>{children}</main>
    </div>
  );
}
