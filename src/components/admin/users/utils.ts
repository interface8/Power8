export type OrderType = {
  id: string;
  totalAmount: number;
  paymentType: string;
  status: string;
  createdAt: string;
};

export type SolarSystemType = {
  id: string;
  bundleName: string;
  status: string;
  createdAt: string;
};

export type CreditAccountType = {
  id: string;
  totalAmount: number;
  balanceRemaining: number;
  status: string;
  createdAt: string;
};

export type SavingType = {
  id: string;
  systemId: string;
  estimatedAnnualSavings: number | null;
  createdAt: string;
};

export function getInitialsFromName(fullName: string): string {
  return fullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function formatDateForDisplay(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatCurrency(amount: number): string {
  return `₦${amount.toLocaleString()}`;
}

// Mock data that shows up when there are no real orders in the database yet
export const placeholderOrders: OrderType[] = [
  {
    id: "ORD-0001",
    totalAmount: 18500,
    paymentType: "Credit",
    status: "Active",
    createdAt: "2024-05-15T00:00:00.000Z",
  },
  {
    id: "ORD-0002",
    totalAmount: 9200,
    paymentType: "Bank Transfer",
    status: "Completed",
    createdAt: "2024-04-10T00:00:00.000Z",
  },
  {
    id: "ORD-0003",
    totalAmount: 4500,
    paymentType: "Cash",
    status: "Pending",
    createdAt: "2024-06-01T00:00:00.000Z",
  },
];

// Mock solar systems data for preview when database is empty
export const placeholderSolarSystems: SolarSystemType[] = [
  {
    id: "PS8-001-GH",
    bundleName: "8KVA Hybrid Bundle",
    status: "Enabled",
    createdAt: "2024-05-15T00:00:00.000Z",
  },
  {
    id: "PS5-002-GH",
    bundleName: "5KVA Off-Grid Bundle",
    status: "Installed",
    createdAt: "2024-03-20T00:00:00.000Z",
  },
];

// Mock credit account data for preview when database is empty
export const placeholderCreditAccounts: CreditAccountType[] = [
  {
    id: "CA-001",
    totalAmount: 18500,
    balanceRemaining: 14800,
    status: "Active",
    createdAt: "2024-05-15T00:00:00.000Z",
  },
  {
    id: "CA-002",
    totalAmount: 9200,
    balanceRemaining: 3200,
    status: "In Progress",
    createdAt: "2024-04-10T00:00:00.000Z",
  },
];

// Mock savings data for preview when database is empty
export const placeholderSavings: SavingType[] = [
  {
    id: "SAV-001",
    systemId: "PS8-001-GH",
    estimatedAnnualSavings: 125000,
    createdAt: "2024-05-15T00:00:00.000Z",
  },
  {
    id: "SAV-002",
    systemId: "PS5-002-GH",
    estimatedAnnualSavings: 85000,
    createdAt: "2024-03-20T00:00:00.000Z",
  },
];