import * as carouselRepository from "./repository";
import type { CreateCarouselSlideInput, UpdateCarouselSlideInput } from "./types";

export async function listActiveSlides() {
  return carouselRepository.getActiveSlides();
}

export async function listAllSlides() {
  return carouselRepository.getAllSlides();
}

export async function getSlide(id: string) {
  return carouselRepository.getSlideById(id);
}

export async function createSlide(data: CreateCarouselSlideInput) {
  return carouselRepository.createSlide(data);
}

export async function updateSlide(id: string, data: UpdateCarouselSlideInput) {
  return carouselRepository.updateSlide(id, data);
}

export async function deleteSlide(id: string) {
  return carouselRepository.deleteSlide(id);
}
