import { FilterItemProps, formatDateTime } from '@vissoft-react/common';
import dayjs from 'dayjs';

export const useFilters = (): FilterItemProps[] => {
  return [
    {
      name: 'date',
      label: 'Ngày tạo',
      type: 'DateRange',
      placeholder: ['Từ ngày', 'Đến ngày'],
      keySearch: ['from', 'to'],
      formatSearch: formatDateTime,
      showDefault: true,
      defaultValue: [dayjs().subtract(29, 'day'), dayjs()],
    },
  ];
};
