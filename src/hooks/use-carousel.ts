import { useQuery } from "./use-api";
import { useEffect } from "react";

export interface CarouselSlide {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  linkUrl: string | null;
  sort: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useCarouselSlides() {
  const { data, loading, error, refetch, clearError } = useQuery<CarouselSlide[]>("/api/carousel", {
    onSuccess: () => {
      console.log("Carousel slides fetched successfully");
    },
    onError: (error) => {
      console.error("Failed to fetch carousel slides:", error);
    },
  });

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    slides: data ?? [],
    loading,
    error,
    refetch,
    clearError,
  };
}
