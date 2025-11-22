import { ServiceType } from '../types';

export const ServiceTypeMap: Record<ServiceType, string> = {
  [ServiceType.ELECTRICITY]: 'Điện',
  [ServiceType.WATER]: 'Nước',
  [ServiceType.INTERNET]: 'Mạng',
  [ServiceType.ROOM_RENT]: 'Tiền phòng',
  [ServiceType.OTHER]: 'Khác',
};

export const ServiceTypeOptions = [
  { label: 'Điện', value: ServiceType.ELECTRICITY },
  { label: 'Nước', value: ServiceType.WATER },
  { label: 'Mạng', value: ServiceType.INTERNET },
  { label: 'Tiền phòng', value: ServiceType.ROOM_RENT },
  { label: 'Khác', value: ServiceType.OTHER },
];

