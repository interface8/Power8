import { NextResponse } from "next/server";
import { carouselService } from "@/modules/carousel";

export const dynamic = "force-dynamic";

export async function GET() {
  const slides = await carouselService.listActiveSlides();
  return NextResponse.json(slides);
}
