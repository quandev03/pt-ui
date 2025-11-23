import { AdvertisementStatus } from '../types';

export const AdvertisementStatusMap: Record<AdvertisementStatus, string> = {
  [AdvertisementStatus.ACTIVE]: 'Hoạt động',
  [AdvertisementStatus.INACTIVE]: 'Không hoạt động',
  [AdvertisementStatus.PUBLISHED]: 'Đã xuất bản',
  [AdvertisementStatus.DRAFT]: 'Bản nháp',
};

export const AdvertisementStatusOptions = [
  {
    label: AdvertisementStatusMap[AdvertisementStatus.ACTIVE],
    value: AdvertisementStatus.ACTIVE,
  },
  {
    label: AdvertisementStatusMap[AdvertisementStatus.INACTIVE],
    value: AdvertisementStatus.INACTIVE,
  },
  {
    label: AdvertisementStatusMap[AdvertisementStatus.PUBLISHED],
    value: AdvertisementStatus.PUBLISHED,
  },
  {
    label: AdvertisementStatusMap[AdvertisementStatus.DRAFT],
    value: AdvertisementStatus.DRAFT,
  },
];

