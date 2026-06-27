import { hash } from "bcryptjs";
import * as merchantRepo from "./repository";
import type { RegisterMerchantInput } from "./types";

export async function registerMerchant(input: RegisterMerchantInput) {
  if (await merchantRepo.emailExists(input.email)) throw new Error("Email already in use");
  if (await merchantRepo.phoneExists(input.phone)) throw new Error("Phone already in use");
  if (await merchantRepo.cacNumberExists(input.cacNumber)) throw new Error("CAC number already in use");

  const hashedPassword = await hash(input.password, 12);
  return merchantRepo.createMerchantWithUser({ ...input, hashedPassword });
}
