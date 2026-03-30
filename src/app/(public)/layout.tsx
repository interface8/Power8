import PublicNavbar from "@/components/shared/PublicNavbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
<<<<<<< HEAD
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full ">{children}</div>
=======
    <div className="flex flex-col min-h-screen bg-linear-to-br from-orange-50 via-yellow-50 to-white">
      <PublicNavbar />
      <div className="w-full pt-16">{children}</div>
>>>>>>> sprint-01
    </div>
  );
}
