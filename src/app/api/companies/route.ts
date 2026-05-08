import { NextRequest } from "next/server";
import { companyService, createCompanySchema } from "@/modules/companies";
import { requireApiPermission, isErrorResponse } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/http";

// GET /api/companies — list all ()
export async function GET() {
  try {
    const companies = await companyService.listCompanies();
    return jsonResponse({ data: companies });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch companies";
    return errorResponse(message, 500);
  }
}

// POST /api/companies — create (admin)
export async function POST(request: NextRequest) {
  const guard = await requireApiPermission("companies.create");
  if (isErrorResponse(guard)) return guard;

  try {
    const body = await request.json();
    const parsed = createCompanySchema.safeParse(body);

    if (!parsed.success) {
      const firstError =
        Object.values(parsed.error.flatten().fieldErrors).flat()[0] ?? "Validation failed";
      return Response.json({ message: firstError }, { status: 400 });
    }

    const company = await companyService.createCompany(parsed.data);
    return jsonResponse(company, 201);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Company already exists") {
      return errorResponse("Company already exists", 409);
    }
    const message = error instanceof Error ? error.message : "Failed to create company";
    return errorResponse(message, 500);
  }
}
