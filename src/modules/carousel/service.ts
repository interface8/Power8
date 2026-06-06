import * as carouselRepository from "./repository";
import type { CreateCarouselSlideInput, UpdateCarouselSlideInput } from "./types";

export async function listActiveSlides() {
  return carouselRepository.getActiveSlides();
}

export async function listAllSlides() {
  return carouselRepository.getAllSlides();
}

export async function getSlide(id: string) {
  const slide = await carouselRepository.getSlideById(id);
  if (!slide) throw new Error("Carousel slide not found");
  return slide;
}

export async function createSlide(data: CreateCarouselSlideInput) {
  return carouselRepository.createSlide(data);
}

export async function updateSlide(id: string, data: UpdateCarouselSlideInput) {
  const exists = await carouselRepository.slideExists(id);
  if (!exists) throw new Error("Carousel slide not found");
  return carouselRepository.updateSlide(id, data);
}

export async function deleteSlide(id: string) {
  const exists = await carouselRepository.slideExists(id);
  if (!exists) throw new Error("Carousel slide not found");
  return carouselRepository.deleteSlide(id);
}

export async function approveSlide(id: string) {
  const exists = await carouselRepository.slideExists(id);
  if (!exists) throw new Error("Carousel slide not found");
  return carouselRepository.approveSlide(id);
}

export async function rejectSlide(id: string) {
  const exists = await carouselRepository.slideExists(id);
  if (!exists) throw new Error("Carousel slide not found");
  return carouselRepository.rejectSlide(id);
}