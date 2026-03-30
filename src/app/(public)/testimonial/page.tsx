"use client";

import TestimonialContent from "@/components/testimonial/testimonialContent";
import { useTestimonials, useTestimonialStats } from "@/hooks/use-testimonials";

export default function TestimonialPage() {
  const { testimonials, loading, error } = useTestimonials();
  const { stats, loading: statsLoading, error: statsError } = useTestimonialStats();

  return (
    <TestimonialContent
      testimonials={testimonials}
      loading={loading}
      error={error}
      stats={stats}
      statsLoading={statsLoading}
      statsError={statsError}
    />
  );
}
