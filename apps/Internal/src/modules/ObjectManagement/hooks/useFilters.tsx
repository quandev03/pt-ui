import { CSelect, FilterItemProps } from '@vissoft-react/common';
import { useMemo } from 'react';

export const useFilters = () => {
  const filters: FilterItemProps[] = useMemo(() => {
    return [
      {
        label: 'Loại web',
        type: 'Select',
        name: 'isPartner',
        stateKey: 'isPartner',
        showDefault: true,
        options: [
          {
            label: 'Nội bộ',
            value: '0',
          },
          {
            label: 'Đối tác',
            value: '1',
          },
        ],
        placeholder: 'Chọn loại web',
      },
    ];
  }, []);

  return { filters };
};
