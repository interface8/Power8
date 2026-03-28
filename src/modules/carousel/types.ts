export interface CarouselSlideDto {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  linkUrl: string | null;
  sort: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCarouselSlideInput {
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  sort?: number;
  isActive?: boolean;
}

export interface UpdateCarouselSlideInput {
  title?: string;
  description?: string;
  imageUrl?: string;
  linkUrl?: string;
  sort?: number;
  isActive?: boolean;
}
