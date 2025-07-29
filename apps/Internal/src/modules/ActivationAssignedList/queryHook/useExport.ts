import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { downloadFileFn } from '@react/utils/handleFile';
import { IActiveAssignParams } from '../types';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import dayjs from 'dayjs';
import { DateFormat } from '@react/constants/app';

const exportListApi = (params: IActiveAssignParams) => {
  const paramCustom = {
    number: params.number,
    status: params.status,
    'type-date': params['type-date'],
    'type-approve': params['type-approve'],
    fromDate: params.fromDate,
    toDate: params.toDate,
  };
  return axiosClient.get<any, Blob>(
    `${prefixCustomerService}/subscriber-request/export-excel/find-approve`,
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
      downloadFileFn(res, `danh_sach_phan_cong_tien_kiem-${dayjs().format(DateFormat.EXPORT)}`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    },
  });
};
