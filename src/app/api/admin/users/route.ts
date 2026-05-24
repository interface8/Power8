import { NextRequest } from "next/server";
import { requireApiAuth, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";
import { adminUsersService, adminUserListFiltersSchema } from "@/modules/admin-users";

export async function GET(request: NextRequest) {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;
  if (!guard.roles.includes("admin")) return errorResponse("Forbidden", 403);

  const { searchParams } = new URL(request.url);
  const parsed = adminUserListFiltersSchema.safeParse(Object.fromEntries(searchParams));
  if (!parsed.success) return errorResponse("Invalid query parameters", 400);

  const result = await adminUsersService.listUsers(parsed.data);
  return jsonResponse(result);
}