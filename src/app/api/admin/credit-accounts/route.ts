import { NextRequest } from "next/server";
import { requireApiPermissionFor, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";
import { adminCreditAccountFiltersSchema, adminCreditService } from "@/modules/admin-credits";


export async function GET(request: NextRequest) {
  const guard = await requireApiPermissionFor("credit_accounts", "view_list");
  if (isErrorResponse(guard)) return guard;

  const { searchParams } = new URL(request.url);
  const parsed = adminCreditAccountFiltersSchema.safeParse(
    Object.fromEntries(searchParams),
  );

  if (!parsed.success) return errorResponse("Invalid query parameters", 400);

  try {
    const result = await adminCreditService.listCreditAccounts(parsed.data);
    return jsonResponse(result);
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch credit accounts";
    return errorResponse(message, 500);
  }
}