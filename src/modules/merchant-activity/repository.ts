import { prisma } from "@/lib/prisma";
import type { CreateMerchantActivityInput, MerchantActivityLogDto } from "./types";

export async function createActivity(
  input: CreateMerchantActivityInput,
): Promise<MerchantActivityLogDto> {
  return prisma.merchantActivityLog.create({
    data: input,
  });
}

export async function createActivities(inputs: CreateMerchantActivityInput[]) {
  if (inputs.length === 0) return [];
  return prisma.merchantActivityLog.createMany({
    data: inputs,
  });
}

export async function findRecentActivitiesByMerchant(
  merchantId: string,
  limit = 10,
): Promise<MerchantActivityLogDto[]> {
  return prisma.merchantActivityLog.findMany({
    where: { merchantId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
