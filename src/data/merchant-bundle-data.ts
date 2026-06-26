import { MerchantBundle } from "@/types/merchant-bundles";

export const dummyMerchantBundles: MerchantBundle[] = [
  {
    id: "BUNDLE-001",
    name: "Home Basic Solar Kit 2kW",
    totalPrice: 650000,
    capacity: "2kW",
    itemsCount: 4,
    status: "APPROVED",
    createdAt: "2025-06-10T00:00:00.000Z",
    updatedAt: "2025-06-10T00:00:00.000Z",
  },
  {
    id: "BUNDLE-002",
    name: "Office Power Suite 5kW",
    totalPrice: 1450000,
    capacity: "5kW",
    itemsCount: 6,
    status: "PENDING",
    createdAt: "2025-06-14T00:00:00.000Z",
    updatedAt: "2025-06-14T00:00:00.000Z",
  },
  {
    id: "BUNDLE-003",
    name: "Starter Solar Package",
    totalPrice: 280000,
    capacity: "1kW",
    itemsCount: 3,
    status: "APPROVED",
    createdAt: "2025-06-02T00:00:00.000Z",
    updatedAt: "2025-06-02T00:00:00.000Z",
  },
];

export const dummyMerchantBundleStats = {
  totalBundles: 3,
  approvedBundles: 2,
  pendingBundles: 1,
};