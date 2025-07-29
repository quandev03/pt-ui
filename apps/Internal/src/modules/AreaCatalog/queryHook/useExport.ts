import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { downloadFileFn } from '@react/utils/handleFile';
import { IAreaParams } from '../types';
import { prefixCatalogService } from '@react/url/app';
import { DateFormat } from '@react/constants/app';
import dayjs from 'dayjs';

const exportListApi = (params: IAreaParams) => {
  const paramCustom = {
    provinceId: params.provinceId,
    districtId: params.districtId
  };
  return axiosClient.get<any, Blob>(
    `${prefixCatalogService}/area/export`,
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
      downloadFileFn(res, `danh_sach_dia_ban_${dayjs().format(DateFormat.EXPORT)}`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    },
  });
};
