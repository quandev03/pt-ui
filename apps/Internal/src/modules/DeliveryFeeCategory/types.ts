export interface ICategoryDeliveryFee {
  createdBy: string;
  createdDate: string;
  modifiedBy?: string;
  modifiedDate?: string;
  id: number;
  locationName: string;
  fromProvince: string;
  toProvinces: any[];
  deliveryFees: IDeliveryFees[];
  deliveryCodFees?: IDeliveryCodFees[];
  saleChannels: string;
}

export interface IDeliveryFees {
  deliveryMethod: string;
  paymentMethod: string;
  fee: string;
}
export interface IDeliveryCodFees {
  fromAmount: string;
  toAmount: string;
  fee: string;
}

export interface PayloadAddDeliveryFee {
  id?: number;
  locationName: string;
  fromProvince: string;
  toProvinces: any[];
  deliveryFees: IDeliveryFees[];
  deliveryCodFees: IDeliveryCodFees[];
  saleChannels: string | string[];
}

export interface PayloadUpdateDeliveryFee {
  id: string;
  data: PayloadAddDeliveryFee;
}
export interface ISaleChannels {
  channelCode: string;
  channelName: string;
  status: boolean;
}