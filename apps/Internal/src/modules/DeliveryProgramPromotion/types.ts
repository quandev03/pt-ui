export interface ICategoryShippingPromotion {
  createdBy: string;
  createdDate: string;
  modifiedBy?: string;
  modifiedDate?: string;
  id: number;
  programName: string;
  promotionMethod: IPromotionMethod;
  channel: string;
  deliveryPaymentMethod: string;
  deliveryMethod: string;
  minPrice: number;
  flatDeliveryPrice?: number;
  percentDiscount?: number;
  startDate: string;
  endDate: string;
}

export enum IPromotionMethod {
  PERCENT = 'PERCENT',
  FLAT_PRICE = 'FLAT_PRICE',
}

export interface FormValuesAddShippingPromotion {
  programName: string;
  promotionMethod: string;
  channel: string[];
  deliveryPaymentMethod: string[];
  deliveryMethod: string[];
  minPrice: number;
  flatDeliveryPrice?: number;
  percentDiscount?: number;
  startDate: string;
  endDate: string;
}

export interface PayloadAddShippingPromotion {
  programName: string;
  promotionMethod: string;
  channel: string;
  deliveryPaymentMethod: string;
  deliveryMethod: string;
  minPrice: number;
  flatDeliveryPrice?: number;
  percentDiscount?: number;
  startDate: string;
  endDate: string;
}

export interface PayloadUpdateShippingPromotion {
  id: string;
  data: PayloadAddShippingPromotion;
}
