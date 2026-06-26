import { z } from "zod";
import { registerMerchantSchema } from "./validation";

export type RegisterMerchantInput = z.infer<typeof registerMerchantSchema>;
