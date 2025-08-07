import { FilterItemProps, StatusEnum } from '@vissoft-react/common';
import { useMemo } from 'react';

export const useFilters = () => {
  const filters: FilterItemProps[] = useMemo(() => {
    return [
      {
        label: 'Trạng thái',
        name: 'status',
        type: 'Select',
        options: [
          {
            label: 'Tất cả',
            value: '',
          },
          {
            label: 'Hoạt động',
            value: String(StatusEnum.ACTIVE),
          },
          {
            label: 'Không hoạt động',
            value: String(StatusEnum.INACTIVE),
          },
        ],
        placeholder: 'Chọn trạng thái',
      },
    ];
  }, []);
  return { filters };
};
