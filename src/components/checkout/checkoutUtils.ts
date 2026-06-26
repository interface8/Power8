export interface AddressData {
  street: string;
  city: string;
  state: string;
  phoneNumber: string;
}

export interface CreditDetails {
  depositAmount: number;
  durationAmount: number;
}

export interface IdentityData {
  bvn: string;
  nin: string;
}

export const sanitizeInput = (value: string): string => {
  return value.replace(/<script.*?>.*?<\/script>/gi, "").replace(/[<>]/g, "");
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const validateBVN = (bvn: string): boolean => {
  return /^\d{11}$/.test(bvn.trim());
};

export const validateNIN = (nin: string): boolean => {
  return /^\d{11}$/.test(nin.trim());
};

export const calculateCreditBreakdown = (
  totalAmount: number,
  depositAmount: number,
  durationMonths: number,
  interestRate = 0.15,
) => {
  const financedAmount = totalAmount - depositAmount;

  if (durationMonths <= 0 || financedAmount <= 0) {
    return {
      financedAmount: 0,
      monthlyPayment: 0,
      totalPayable: 0,
      interestAmount: 0,
    };
  }

  const monthlyInterest = interestRate / 12;

  const monthlyPayment =
    (financedAmount *
      monthlyInterest *
      Math.pow(1 + monthlyInterest, durationMonths)) /
    (Math.pow(1 + monthlyInterest, durationMonths) - 1);

  const totalPayable = monthlyPayment * durationMonths + depositAmount;

  const interestAmount = totalPayable - totalAmount;

  return {
    financedAmount,
    monthlyPayment: Number.isNaN(monthlyPayment) ? 0 : monthlyPayment,
    totalPayable: Number.isNaN(totalPayable) ? 0 : totalPayable,
    interestAmount: Number.isNaN(interestAmount) ? 0 : interestAmount,
  };
};
