import { NextRequest } from "next/server";
import { requireApiPermissionFor, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";
import { adminCreditService } from "@/modules/admin-credits";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireApiPermissionFor("credit_accounts", "view_detail");
  if (isErrorResponse(guard)) return guard;

  try {
    const { id } = await params;
    const data = await adminCreditService.getCreditAccountDetailsById(id);
    return jsonResponse({ data });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch credit details";
    if (message === "Credit not found") return errorResponse(message, 404);
    return errorResponse(message, 500);
  }
}