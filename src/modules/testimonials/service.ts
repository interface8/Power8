import * as testimonialsRepository from './repository';

export async function listTestimonials(){
  return testimonialsRepository.getTestimonials();
}

export async function getTestimonialStats() {
  const testimonials = await testimonialsRepository.getTestimonials();
  const totalTestimonials = testimonials.length;
  if (totalTestimonials === 0) {
    return {
      totalTestimonials: 0,
      averageRating: 0,
    };
  }

  const averageRating =
    testimonials.reduce((sum, testimonial) => sum + (testimonial.rating ?? 0), 0) /
    totalTestimonials;

  return {
    totalTestimonials,
    averageRating,
  }}