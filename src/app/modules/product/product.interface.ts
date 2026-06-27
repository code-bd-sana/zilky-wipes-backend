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
  categoryId: string;
  tags?: string[];
  variants: ICreateProductVariantPayload[];
}

export interface IUpdateProductVariantPayload extends Partial<ICreateProductVariantPayload> {}

export interface IUpdateProductPayload {
  name?: string;
  description?: string;
  categoryId?: string;
  tags?: string[];
}
