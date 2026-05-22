import { NextRequest, NextResponse } from "next/server";
import { testimonialsService } from "@/modules/testimonials";
import { requireApiAuth, isErrorResponse } from "@/lib/auth";

export async function GET() {
  try {
    const testimonials = await testimonialsService.listTestimonials();
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch testimonials",
        message: process.env.NODE_ENV === "development" ? (error as Error).message : undefined 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Get logged-in user
  const guard = await requireApiAuth();
  if (isErrorResponse(guard)) return guard;

  try {
    const body = await request.json();
    const { name, role, rating, message, imageUrl } = body;

    // Validation
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Full name is required (minimum 2 characters)" },
        { status: 400 }
      );
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating is required (1-5 stars)" },
        { status: 400 }
      );
    }

    if (!message || message.trim().length < 20) {
      return NextResponse.json(
        { error: "Message must be at least 20 characters" },
        { status: 400 }
      );
    }

    // Create testimonial with logged-in user's ID
    const newTestimonial = await testimonialsService.createTestimonial({
      title: name,
      description: message,
      role: role || null,
      rating: rating,
      imageUrl: imageUrl || null,  // ← ADD THIS
      userId: guard.id,
    });

    return NextResponse.json(
      { message: "Testimonial submitted for review", data: newTestimonial },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting testimonial:", error);
    return NextResponse.json(
      { error: "Failed to submit testimonial" },
      { status: 500 }
    );
  }
}