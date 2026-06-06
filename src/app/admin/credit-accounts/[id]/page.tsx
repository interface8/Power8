import { notFound } from "next/navigation";

import CreditAccountDetailPage from "@/components/admin/credit-accounts/credit-id/CreditAccountDetailPage";


interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  const account = creditAccountDetails.find((item) => item.id === params.id);

  if (!account) {
    notFound();
  }

  return (
    <div className="w-full p-4 md:p-6">
      <CreditAccountDetailPage account={account} />
    </div>
  );
}
