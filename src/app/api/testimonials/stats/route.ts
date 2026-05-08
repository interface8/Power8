// import { NextResponse } from "next/server";
// import { testimonialsService } from "@/modules/testimonials";

// export async function GET() {
//   const stats = await testimonialsService.getTestimonialStats();
//   console.log("API Stats:", stats);
//   return NextResponse.json(stats);
// }

import { NextResponse } from "next/server";
import { testimonialsService } from "@/modules/testimonials";

export async function GET() {
  try {
    const stats = await testimonialsService.getTestimonialStats();
    console.log("API Stats:", stats);
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching testimonial stats:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch testimonial stats",
        message:
          process.env.NODE_ENV === "development"
            ? (error as Error).message
            : undefined,
      },
      { status: 500 },
    );
  }
}
