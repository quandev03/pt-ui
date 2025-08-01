import { FilterItemProps } from '@vissoft-react/common';

export const useFilters = (): FilterItemProps[] => {
  return [
    {
      name: 'status',
      label: 'Trạng thái',
      type: 'Select',
      placeholder: 'Chọn trạng thái',
      options: [
        {
          label: 'Hoạt động',
          value: 1,
        },
        {
          label: 'Không hoạt động',
          value: 0,
        },
      ],
    },
  ];
};
