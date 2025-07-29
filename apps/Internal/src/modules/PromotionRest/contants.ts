import { EDateType, EStatusPromotionRest } from './types';

export const optionDateTypePromotionRest = [
  {
    label: 'Ngày tạo',
    value: EDateType.CREATE,
  },
  {
    label: 'Ngày cập nhật',
    value: EDateType.UPDATE,
  },
];

export const optionStatusPromotionRest = [
  {
    label: 'Hoạt động',
    value: EStatusPromotionRest.ACTIVE,
  },
  {
    label: 'Không hoạt động',
    value: EStatusPromotionRest.IN_ACTIVE,
  },
];
