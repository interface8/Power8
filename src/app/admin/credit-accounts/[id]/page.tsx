import CreditAccountDetailPage from "@/components/admin/credit-accounts/credit-id/CreditAccountDetailPage";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  return <CreditAccountDetailPage id={id} />;
}
