export interface BundleItemDto {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface BundleDto {
  id: string;
  name: string;
  totalPrice: number;
  systemCapacityKw: number | null;
  items: BundleItemDto[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBundleItemInput {
  productId: string;
  quantity: number;
}

export interface CreateBundleInput {
  name: string;
  totalPrice: number;
  systemCapacityKw?: number;
  items: CreateBundleItemInput[];
}

export interface UpdateBundleInput {
  name?: string;
  totalPrice?: number;
  systemCapacityKw?: number;
  items?: CreateBundleItemInput[];
}
