export interface ICreateAddressPayload {
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

export interface IUpdateAddressPayload extends Partial<ICreateAddressPayload> {}
