import type { MerchantActivityType } from "@prisma/client";

export type MerchantActivityLogDto = {
  id: string;
  merchantId: string;
  type: MerchantActivityType;
  message: string;
  createdAt: Date;
};

export type CreateMerchantActivityInput = {
  merchantId: string;
  type: MerchantActivityType;
  message: string;
};
