import { FilterItemProps, StatusEnum } from '@vissoft-react/common';

export const useFilters = (): FilterItemProps[] => {
  return [
    {
      name: 'status',
      label: 'Trạng thái',
      type: 'Select',
      placeholder: 'Chọn trạng thái',
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
    },
  ];
};
