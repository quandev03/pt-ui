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
            value: StatusEnum.ACTIVE,
          },
          {
            label: 'Không hoạt động',
            value: StatusEnum.INACTIVE,
          },
        ],
        placeholder: 'Chọn trạng thái',
      },
    ];
  }, []);
  return { filters };
};
