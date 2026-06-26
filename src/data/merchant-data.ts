import { MerchantStats, Activity, MonthlyStats } from "@/types/merchant";

export const dummyMerchantStats: MerchantStats = {
  totalProducts: 5,
  pendingApproval: 1,
  approvedLive: 3,
  rejected: 1,
};

export const dummyActivities: Activity[] = [
  {
    id: "1",
    title: "Product Approved",
    description: "Your product Mono Solar Panel 400W was approved and is now live",
    time: "2 hours ago",
    type: "approved",
    actionLabel: "Add new product",
    actionLink: "/merchant/products/new",
  },
  {
    id: "2",
    title: "New Order Received",
    description: "New order ORD-2025-0041 received from Emmanuel Adeyemi",
    time: "5 hours ago",
    type: "order",
    actionLabel: "Create a bundle",
    actionLink: "/merchant/bundles/new",
  },
  {
    id: "3",
    title: "Product Rejected",
    description: "Your product Poly Solar Panel 250W was rejected — see reason",
    time: "1 day ago",
    type: "rejected",
    actionLabel: "View pending products",
    actionLink: "/merchant/products/pending",
  },
  {
    id: "4",
    title: "Product Submitted",
    description: "You submitted Lithium Battery 200Ah for review",
    time: "1 day ago",
    type: "submitted",
    actionLabel: "View all orders",
    actionLink: "/merchant/orders",
  },
  {
    id: "5",
    title: "Product Approved",
    description: "Your product 5kVA Hybrid Inverter was approved and is now live",
    time: "3 days ago",
    type: "approved",
    actionLabel: "View all orders",
    actionLink: "/merchant/orders",
  },
  {
    id: "6",
    title: "New Order Received",
    description: "New order ORD-2025-0038 received from Ngozi Okonkwo",
    time: "3 days ago",
    type: "order",
    actionLabel: "View all orders",
    actionLink: "/merchant/orders",
  },
  {
    id: "7",
    title: "Bundle Approved",
    description: "Your bundle Home Basic Solar Kit 2kW was approved and is now live",
    time: "5 days ago",
    type: "bundle",
    actionLabel: "View all orders",
    actionLink: "/merchant/orders",
  },
];

export const dummyMonthlyStats: MonthlyStats = {
  ordersReceived: 5,
  productsActive: 3,
  bundlesLive: 2,
};