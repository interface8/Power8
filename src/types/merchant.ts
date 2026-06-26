export interface MerchantStats {
  totalProducts: number;
  pendingApproval: number;
  approvedLive: number;
  rejected: number;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "approved" | "rejected" | "order" | "submitted" | "bundle";
  actionLabel?: string;
  actionLink?: string;
}

export interface MonthlyStats {
  ordersReceived: number;
  productsActive: number;
  bundlesLive: number;
}

export interface MerchantSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}