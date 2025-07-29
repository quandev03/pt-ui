import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { downloadFileFn } from '@react/utils/handleFile';
import { ICategoryProductParams } from '../types';
import { prefixCatalogService } from 'apps/Internal/src/constants/app';
import dayjs from 'dayjs';

const exportListApi = (params: ICategoryProductParams) => {
  const paramCustom = {
    status: params.status,
    'search-string': params.q ?? '',
    page: params.page ?? '',
    size: params.size ?? '',
  };
  return axiosClient.get<any, Blob>(
    `${prefixCatalogService}/product-category/action/export`,
    {
      params: paramCustom,
      responseType: 'blob',
    }
  );
};

export const useExportList = () => {
  const date = dayjs().format('DDMMYYYYHHmmss');
  const nameFile = `Danh_muc_loai_san_pham-${date}`
  return useMutation({
    mutationFn: exportListApi,
    onSuccess: (res: Blob) => {
      downloadFileFn(res, nameFile, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    },
  });
};
