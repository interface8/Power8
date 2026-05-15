import { prisma } from "@/lib/prisma";
import type { Testimonial, User } from "@prisma/client";

export async function getTestimonials(): Promise<
  Array<Testimonial & { user: Pick<User, "id" | "name"> }>
> {
  return prisma.testimonial.findMany({
    where: {
  status: "approved"
},
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}
export async function createTestimonial(data: {
  title: string;
  description: string;
  role?: string | null;
  rating?: number;
  userId: string;
}) {
  return prisma.testimonial.create({
    data: {
      title: data.title,
      description: data.description,
      role: data.role || null,
      rating: data.rating || null, 
      status: "pending",
      userId: data.userId,
    },
  });
}