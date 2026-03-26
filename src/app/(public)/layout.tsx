import PublicNavbar from "@/components/shared/PublicNavbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-linear-to-br from-orange-50 via-yellow-50 to-white">
      <PublicNavbar />
      <div className="w-full pt-16">{children}</div>
    </div>
  );
}
