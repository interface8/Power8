import { CreditAccountDetail } from "@/types/credit-account-detail";

export const creditAccountDetails: CreditAccountDetail[] = [
  {
    id: "1",
    customerName: "Kwame Asante",
    email: "kwame@example.com",
    phone: "+233 55 123 4567",
    totalAmount: 18500,
    balanceRemaining: 14800,
    durationMonths: 24,
    startDate: "2025-01-15",
    endDate: "2027-01-15",
    creditStatus: "ACTIVE",
    repaymentPercentage: 20,
    paymentSchedule: [
      {
        id: "1",
        dueDate: "2025-01-15",
        amountDue: 1000,
        status: "PAID",
      },
      {
        id: "2",
        dueDate: "2025-02-15",
        amountDue: 1000,
        status: "PAID",
      },
      {
        id: "3",
        dueDate: "2025-03-15",
        amountDue: 1000,
        status: "PENDING",
      },
      {
        id: "4",
        dueDate: "2025-04-15",
        amountDue: 1000,
        status: "OVERDUE",
      },
    ],
  },

  {
    id: "2",
    customerName: "Kofi Boateng",
    email: "kofi@example.com",
    phone: "+233 55 999 1111",
    totalAmount: 25000,
    balanceRemaining: 12000,
    durationMonths: 36,
    startDate: "2025-02-01",
    endDate: "2028-02-01",
    creditStatus: "ACTIVE",
    repaymentPercentage: 52,
    paymentSchedule: [],
  },

  {
    id: "3",
    customerName: "Ama Mensah",
    email: "ama@example.com",
    phone: "+233 55 888 2222",
    totalAmount: 15000,
    balanceRemaining: 0,
    durationMonths: 12,
    startDate: "2024-01-01",
    endDate: "2025-01-01",
    creditStatus: "COMPLETED",
    repaymentPercentage: 100,
    paymentSchedule: [],
  },
];