export interface ICreateProductVariantPayload {
  name: string;
  price: number;
  stock: number;
  subscriptionEligible?: boolean;
  subscriptionDiscount?: number;
}

export interface ICreateProductPayload {
  name: string;
  description: string;
  images: string[];
  accordionDetails?: any;
  isFeatured?: boolean;
  categoryIds: string[];
  tagIds?: string[];
  variants: ICreateProductVariantPayload[];
}

export interface IUpdateProductVariantPayload extends Partial<ICreateProductVariantPayload> {}

export interface IUpdateProductPayload {
  name?: string;
  description?: string;
  images?: string[];
  accordionDetails?: any;
  isFeatured?: boolean;
  categoryIds?: string[];
  tagIds?: string[];
}
