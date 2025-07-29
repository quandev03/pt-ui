import { useMutation, useQuery } from '@tanstack/react-query';
import { notification } from 'antd';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { Inventory } from '../services';
import { ParamsInventoryDetail } from '../types';
import useFileNameDownloaded from 'apps/Internal/src/components/layouts/store/useFileNameDownloaded';

export const useListInventoryDetail = (param: ParamsInventoryDetail) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.INVENTORY_DETAIL, param],
    queryFn: () => Inventory.getInventoryList(param),
    enabled: !!param.inventoryCode,
  });
};

export const useGetListOrgUser = () => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_LIST_ORG_USE],
    queryFn: Inventory.getListOrgUser,
  });
};

export const useExportSerialReport = () => {
  return useMutation({
    mutationFn: Inventory.exportSerial,
    onSuccess: (res) => {
      const blob = new Blob([res], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.href = url;
      a.download = `xem-chi-tiet-serial.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
      a.remove();
      notification.success({
        message: 'Xuất file thành công',
      });
    },
    onError(error: any) {
      notification.error({
        message: 'Thất bại',
        description: error?.response?.data?.detail,
      });
    },
  });
};

export const useExportReport = () => {
  return useMutation({
    mutationFn: Inventory.exportInventory,
    onSuccess: (res) => {
      const blob = new Blob([res], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.href = url;
      const fileName = useFileNameDownloaded.getState().name;
      a.download = fileName ? fileName : `xem-thong-tin-kho.xlsx`;
      a.click();
      URL.revokeObjectURL(a.href);
      a.remove();
      notification.success({
        message: 'Xuất file thành công',
      });
    },
    onError(error: any) {
      notification.error({
        message: 'Thất bại',
        description: error?.response?.data?.detail,
      });
    },
  });
};
