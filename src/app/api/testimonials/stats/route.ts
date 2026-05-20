// import { NextResponse } from "next/server";
// import { testimonialsService } from "@/modules/testimonials";

// export async function GET() {
//   const stats = await testimonialsService.getTestimonialStats();
//   console.log("API Stats:", stats);
//   return NextResponse.json(stats);
// }

import { NextResponse } from "next/server";
import { testimonialsService } from "@/modules/testimonials";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const stats = await testimonialsService.getTestimonialStats();
    return NextResponse.json(stats);
  } catch {
    return NextResponse.json(
      {
        totalTestimonials: 0,
        averageRating: 0,
      },
      { status: 200 },
    );
  }
}
