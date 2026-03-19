import { NextResponse, NextRequest } from "next/server";
import { testimonialsService } from "@/modules/testimonials";

export async function GET(request: NextRequest) {
  const testimonials = await testimonialsService.listTestimonials();
  return NextResponse.json(testimonials);
}
