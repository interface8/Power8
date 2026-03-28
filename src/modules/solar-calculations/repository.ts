import { prisma } from "@/lib/prisma";

export async function create(data: {
  userId?: string;
  appliances: unknown;
  config: unknown;
  results: unknown;
  location?: string;
  totalDailyWh: number;
  inverterSize: number;
  solarPanelWatts: number;
  batteryAh: number;
}) {
  return prisma.solarCalculation.create({
    data: {
      userId: data.userId ?? null,
      appliances: data.appliances as object,
      config: data.config as object,
      results: data.results as object,
      location: data.location ?? null,
      totalDailyWh: data.totalDailyWh,
      inverterSize: data.inverterSize,
      solarPanelWatts: data.solarPanelWatts,
      batteryAh: data.batteryAh,
    },
  });
}

export async function getByUser(userId: string) {
  return prisma.solarCalculation.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getById(id: string) {
  return prisma.solarCalculation.findUnique({
    where: { id },
  });
}
