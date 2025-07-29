import { PriorityEnum } from '../type';

export const LIST_PRIORITY_STATUS: { label: string; value: string }[] = [
  {
    label: 'Khẩn cấp',
    value: PriorityEnum.URGENT,
  },
  {
    label: 'Bình thường',
    value: PriorityEnum.NORMAL,
  },
];
