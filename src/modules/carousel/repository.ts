import { prisma } from "@/lib/prisma";
import type { CreateCarouselSlideInput, UpdateCarouselSlideInput } from "./types";

export async function getActiveSlides() {
  return prisma.carouselSlide.findMany({
    where: { isActive: true },
    orderBy: { sort: "asc" },
  });
}

export async function getAllSlides() {
  return prisma.carouselSlide.findMany({
    orderBy: { sort: "asc" },
  });
}

export async function getSlideById(id: string) {
  return prisma.carouselSlide.findUnique({ where: { id } });
}

export async function slideExists(id: string) {
  const count = await prisma.carouselSlide.count({ where: { id } });
  return count > 0;
}

export async function createSlide(data: CreateCarouselSlideInput) {
  return prisma.carouselSlide.create({ data });
}

export async function updateSlide(id: string, data: UpdateCarouselSlideInput) {
  return prisma.carouselSlide.update({ where: { id }, data });
}

export async function deleteSlide(id: string) {
  return prisma.carouselSlide.delete({ where: { id } });
}

export async function approveSlide(id: string) {
  return prisma.carouselSlide.update({
    where: { id },
    data: { isActive: true },
  });
}

export async function rejectSlide(id: string) {
  return prisma.carouselSlide.update({
    where: { id },
    data: { isActive: false },
  });
}