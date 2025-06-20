export interface ShopAttributes {
  priceRange?: string;
  openingHours?: string;
  deliveryAvailable?: boolean;
  petFriendly?: boolean;
  wifi?: boolean;
  parking?: boolean;
  acceptsCreditCards?: boolean;
  reservationRequired?: boolean;
  halalFriendly?: boolean;
  veganFriendly?: boolean;
  covidSafe?: boolean;
}

export interface ShopType {
  id: string;
  name: string;
  attributes?: ShopAttributes;
  children?: ShopType[];
}
