import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { downloadFile, downloadFileFn } from '@react/utils/handleFile';
import { Req } from './useListOrder';
import { DateFormat, DeliveryOrderType, FILE_TYPE } from '@react/constants/app';
import dayjs from 'dayjs';
import { prefixSaleService } from '@react/url/app';

const exportListApi = (body: Req) => {
  return axiosClient.post<Req, Blob>(
    `${prefixSaleService}/delivery-order/export-excel-ncc`,
    { ...body, deliveryOrderType: DeliveryOrderType.NCC },
    { responseType: 'blob' }
  );
};

export const useExportOrder = () => {
  return useMutation({
    mutationFn: exportListApi,
    onSuccess: (res: Blob) => {
      downloadFileFn(
        res,
        `Danh_sach_don_mua_hang_tu_NCC_${dayjs().format(DateFormat.DEFAULT)}`,
        FILE_TYPE.xlsx
      );
    },
  });
};
