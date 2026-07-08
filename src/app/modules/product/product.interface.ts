export interface ICreateProductVariantPayload {
  name: string;
  price: number;
  stock: number;
  subscriptionEligible?: boolean;
  subscriptionDiscount?: number;
  stripePriceId?: string | null;
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

export interface IUpdateProductVariantPayload extends Partial<ICreateProductVariantPayload> {
  id?: string;
}

export interface IUpdateProductPayload {
  name?: string;
  description?: string;
  images?: string[];
  accordionDetails?: any;
  isFeatured?: boolean;
  categoryIds?: string[];
  tagIds?: string[];
  variants?: IUpdateProductVariantPayload[];
}
