import { CSelect, FilterItemProps } from '@vissoft-react/common';
import { useMemo } from 'react';
import useConfigAppStore from '../../Layouts/stores';

export const useFilters = () => {
  const {
    params: { STOCK_ISDN_STATUS = [], STOCK_ISDN_TRANSFER_STATUS = [] },
  } = useConfigAppStore();
  const filters: FilterItemProps[] = useMemo(() => {
    return [
      {
        label: 'Kho',
        type: 'Select',
        name: 'stockId',
        stateKey: 'stockId',
        showDefault: true,
        options: [],
        placeholder: 'Chọn kho',
      },
      {
        label: 'Trạng thái số',
        type: 'Select',
        name: 'status',
        stateKey: 'status',
        showDefault: true,
        options: STOCK_ISDN_STATUS,
        placeholder: 'Chọn trạng thái số',
      },
      {
        label: 'Trạng thái điều chuyển',
        type: 'Select',
        name: 'transferStatus',
        stateKey: 'transferStatus',
        showDefault: true,
        options: STOCK_ISDN_TRANSFER_STATUS,
        placeholder: 'Chọn trạng thái điều chuyển',
      },
    ];
  }, [STOCK_ISDN_STATUS, STOCK_ISDN_TRANSFER_STATUS]);

  return { filters };
};
