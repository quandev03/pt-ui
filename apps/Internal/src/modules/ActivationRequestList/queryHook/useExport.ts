import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { downloadFileFn } from '@react/utils/handleFile';
import { IActiveRequestParams } from '../types';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import dayjs from 'dayjs';
import { DateFormat } from '@react/constants/app';

const exportListApi = (params: IActiveRequestParams) => {
  const paramCustom = {
    number: params.number,
    status: params.status,
    type: params.type,
    fromDate: params.fromDate,
    toDate: params.toDate,
  };
  return axiosClient.get<any, Blob>(
    `${prefixCustomerService}/subscriber-request/export-excel/find`,
    {
      params: paramCustom,
      responseType: 'blob',
    }
  );
};

export const useExportList = () => {
  return useMutation({
    mutationFn: exportListApi,
    onSuccess: (res: Blob) => {
      downloadFileFn(res, `danh_sach_yeu_cau_kich_hoat-${dayjs().format(DateFormat.EXPORT)}`,'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    },
  });
};
