export interface CheckoutAddress {
  street: string;
  city: string;
  state: string;
  phoneNumber: string;
}

export interface CreditApplication {
  depositAmount: number;
  durationMonths: number;
}

export interface IdentityVerification {
  bvn: string;
  nin: string;
}

export type PaymentMethod =
  | "full"
  | "installment";

export type PaymentChannel =
  | "transfer"
  | "card"
  | "paystack";

export interface CheckoutPayload {
  paymentMethod: PaymentMethod;
  paymentChannel?: PaymentChannel;

  address: CheckoutAddress;

  identity?: IdentityVerification;

  creditDetails?: CreditApplication;

  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];

  subtotal: number;
  vat: number;
  total: number;
}