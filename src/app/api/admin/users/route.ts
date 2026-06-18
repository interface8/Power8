import { NextRequest } from "next/server";
import { requireApiPermissionFor, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";
import { adminUsersService, adminUserListFiltersSchema } from "@/modules/admin-users";

export async function GET(request: NextRequest) {
  const guard = await requireApiPermissionFor("users", "view_list");
  if (isErrorResponse(guard)) return guard;

  const { searchParams } = new URL(request.url);
  const parsed = adminUserListFiltersSchema.safeParse(Object.fromEntries(searchParams));
  if (!parsed.success) return errorResponse("Invalid query parameters", 400);

  const result = await adminUsersService.listUsers(parsed.data);
  return jsonResponse(result);
}
