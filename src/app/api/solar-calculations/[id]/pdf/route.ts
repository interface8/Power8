import { NextRequest, NextResponse } from "next/server";
import { solarCalculationsService } from "@/modules/solar-calculations";
import { generateSolarPDF } from "@/lib/pdf-generator";
import type { Appliance, SolarConfig, SolarResults } from "@/types/solar";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const calculation = await solarCalculationsService.getById(id);

    if (!calculation) {
      return NextResponse.json({ message: "Calculation not found" }, { status: 404 });
    }

    const appliances = calculation.appliances as unknown as Appliance[];
    const config = calculation.config as unknown as SolarConfig;
    const results = calculation.results as unknown as SolarResults;

    const pdfBytes = generateSolarPDF(appliances, config, results);

    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="power8-solar-report-${id}.pdf"`,
      },
    });
  } catch {
    return NextResponse.json({ message: "Failed to generate PDF" }, { status: 500 });
  }
}
