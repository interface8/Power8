// import { NextResponse } from "next/server";
// import { testimonialsService } from "@/modules/testimonials";

// export async function GET() {
//   const testimonials = await testimonialsService.listTestimonials();
//   return NextResponse.json(testimonials);
// }

import { NextResponse } from "next/server";
import { testimonialsService } from "@/modules/testimonials";

export async function GET() {
  try {
    const testimonials = await testimonialsService.listTestimonials();
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error);  // ← This will now appear in your terminal
    return NextResponse.json(
      { 
        error: "Failed to fetch testimonials",
        message: process.env.NODE_ENV === "development" ?(error as Error).message : undefined 
      },
      { status: 500 }
    );
  }
}