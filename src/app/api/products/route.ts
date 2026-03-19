import { NextRequest } from "next/server";
import { productService, productFiltersSchema } from "@/modules/products";
import { jsonResponse, errorResponse } from "@/lib/http";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = productFiltersSchema.parse(Object.fromEntries(searchParams));
    const products = await productService.listProducts(filters);
    return jsonResponse({ data: products });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch products";
    return errorResponse(message, 500);
  }
}
