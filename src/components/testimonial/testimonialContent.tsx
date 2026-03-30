"use client";
import { LucideArrowLeft } from "lucide-react";
import Link from "next/link";
import StatsSummary from "./StatsSummary";
import TestimonialCard from "./testimonialCard";
import CTASection from "./CTASection";
import type { Testimonial } from "@/hooks/use-testimonials";

interface TestimonialContentProps {
  testimonials: Testimonial[];
  loading: boolean;
  error: string;
  stats: { totalTestimonials: number; averageRating: number };
  statsLoading: boolean;
  statsError: string;
}

export default function TestimonialContent({
  testimonials,
  loading,
  error,
  stats,
  statsLoading,
  statsError,
}: TestimonialContentProps) {

  return (
    <div className="bg-[#fffbf6] py-10 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      {/* Reduced top padding */}
      <div className="w-[97%] mx-auto pt-8 py-4">
        {/* Back to Home */}
        <Link
          href="/"
          className="flex items-center space-x-2 pl-6 whitespace-nowrap"
        >
          <span>
            <LucideArrowLeft size={18} />
          </span>
          <p className="text-gray-800 font-semibold text-base md:text-lg whitespace-nowrap">
            Back to Home
          </p>
        </Link>
      </div>

      {/* Reduced section padding */}
      <section className="py-2 px-4">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Reduced bottom margin */}
          <div className="text-center mb-6">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-medium text-gray-900 md:mb-8 tracking-wider">
              Stories from Our
              <div className="pb-2"></div>
              <span className="block text-orange-600 leading-none whitespace-nowrap md:text-5xl lg:text-7xl mb-4">
                Happy Customers
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-700 max-w-6xl mx-auto tracking-wide ">
              Real experiences from real people who&apos;ve{" "}
              <br className="block sm:hidden" />
              transformed their lives with solar energy
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-[90%] sm:w-{80%} mx-auto mt-8"></div>
        </div>
      </section>

      <div className="px-4 sm:px-6 lg:px-8">
        <StatsSummary stats={stats} loading={statsLoading} error={statsError} />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-24">
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex justify-center items-center py-24">
          <p className="text-xl text-red-600">Error: {error}</p>
        </div>
      )}

      {/* Testimonials Grid */}
      {!loading && !error && testimonials.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-18 px-2 my-2 md:my-24">
          {testimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              rating={String(testimonial.rating)}
              quote={testimonial.description}
              name={testimonial.user.name}
              role="Small Business Owner"
              location="Lagos, Nigeria"
              system=""
              savings=""
              imageUrl={
                testimonial.imageUrl || "/images/images-removebg-preview.png"
              }
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && testimonials.length === 0 && (
        <div className="flex justify-center items-center py-24">
          <p className="text-xl text-gray-600">No testimonials yet.</p>
        </div>
      )}

      <div className="flex justify-center items-center pb-24 mt-16">
        <CTASection />
      </div>
    </div>
  );
}
