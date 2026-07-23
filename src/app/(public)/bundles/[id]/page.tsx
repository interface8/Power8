import BundleDetail from "@/components/bundle/BundleDetails";

export default function BundleDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <BundleDetail id={params.id} />;
}