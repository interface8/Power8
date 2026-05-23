import { NextRequest } from "next/server";
import { requireApiAuth, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";
import { productService, adminProductFiltersSchema, createProductSchema } from "@/modules/products";

export async function GET(request: NextRequest) {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;
  if (!guard.roles.includes("admin")) return errorResponse("Forbidden", 403);

  const { searchParams } = new URL(request.url);
  const parsed = adminProductFiltersSchema.safeParse(Object.fromEntries(searchParams));
  if (!parsed.success) return errorResponse("Invalid query parameters", 400);

  const result = await productService.listProductsAdmin(parsed.data);

  return jsonResponse({
    data: result.products,
    pagination: {
      page: result.page,
      limit: parsed.data.limit,
      total: result.total,
      totalPages: result.totalPages,
    },
  });
}

export async function POST(request: NextRequest) {
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;
  if (!guard.roles.includes("admin")) return errorResponse("Forbidden", 403);

  try {
    const body = await request.json();
    const parsed = createProductSchema.safeParse(body);

    if (!parsed.success) {
      const firstError =
        Object.values(parsed.error.flatten().fieldErrors).flat()[0] ??
        "Validation failed";
      return errorResponse(firstError, 400);
    }

    const product = await productService.createProduct(parsed.data);
    return jsonResponse({ data: product }, 201);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Product already exists") {
      return errorResponse("Product already exists", 409);
    }
    const message =
      error instanceof Error ? error.message : "Failed to create product";
    return errorResponse(message, 500);
  }
}