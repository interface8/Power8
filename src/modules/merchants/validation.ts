import { z } from "zod";

export const registerMerchantSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(7).max(20),
  password: z.string().min(8, "Password must be at least 8 characters"),
  businessName: z.string().min(2).max(150),
  businessAddress: z.string().min(2).max(255),
  cacNumber: z.string().min(2).max(50),
  cacDocumentUrl: z.string().url(),
  governmentIdUrl: z.string().url(),
  logoUrl: z.string().url().optional(),
});
