import { NextRequest } from "next/server";
import { OrderStatus } from "@prisma/client";
import { requireApiMerchant } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";
import { merchantDashboardService } from "@/modules/merchant-dashboard";

function parseOrderStatus(value: string | null): OrderStatus | undefined {
  if (!value) return undefined;
  const normalized = value.trim().toUpperCase();
  const allowed: OrderStatus[] = [
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "COMPLETED",
    "CANCELLED",
  ];
  return allowed.includes(normalized as OrderStatus) ? (normalized as OrderStatus) : undefined;
}

function parseDate(value: string | null): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function parsePositiveInt(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export async function GET(request: NextRequest) {
  const auth = await requireApiMerchant();
  if (auth instanceof Response) return auth;

  const { searchParams } = new URL(request.url);
  const orderStatus = parseOrderStatus(searchParams.get("orderStatus"));
  const startDate = parseDate(searchParams.get("startDate"));
  const endDate = parseDate(searchParams.get("endDate"));
  const page = parsePositiveInt(searchParams.get("page"), 1);
  const limit = Math.min(parsePositiveInt(searchParams.get("limit"), 20), 100);

  try {
    const data = await merchantDashboardService.listOrders(auth.merchant.id, {
      orderStatus,
      startDate,
      endDate,
      page,
      limit,
    });
    return jsonResponse({ data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch merchant orders";
    return errorResponse(message, 500);
  }
}
