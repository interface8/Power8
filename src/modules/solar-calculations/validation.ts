import { z } from "zod";

export const createSolarCalculationSchema = z.object({
  appliances: z.array(z.object({
    id: z.string(),
    name: z.string(),
    watts: z.number().positive(),
    hoursPerDay: z.number().min(0).max(24),
    quantity: z.number().int().positive(),
    surgeMultiplier: z.number().positive(),
  })).min(1, "At least one appliance is required"),
  config: z.object({
    peakSunHours: z.number().positive(),
    daysOfAutonomy: z.number().int().positive(),
    systemVoltage: z.union([z.literal(12), z.literal(24), z.literal(48)]),
    batteryType: z.enum(["lead-acid", "lithium"]),
    safetyFactor: z.number().positive(),
    efficiencyLoss: z.number().positive(),
    panelRating: z.number().positive(),
    batteryUnitAh: z.number().positive(),
    electricityRate: z.number().positive(),
    location: z.string(),
    usageProfile: z.enum(["home", "business", "school", "restaurant"]),
  }),
});
