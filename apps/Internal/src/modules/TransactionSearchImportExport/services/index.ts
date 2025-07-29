import { axiosClient } from 'apps/Internal/src/service';
import { prefixSaleService } from '@react/url/app';
import { IPage } from '@react/commons/types';
import {
  IParamsPage,
  TransactionSearchImportExportItem,
} from 'apps/Internal/src/modules/TransactionSearchImportExport/types';
import { getParamsString } from '@react/helpers/utils';

export const TransactionSearchImportExportService = {
  async searchList(params: IParamsPage) {
    const { page, size, ...payload } = params;
    const paramsString = getParamsString({ page, size });
    const res = await axiosClient.post<
      string,
      IPage<TransactionSearchImportExportItem>
    >(
      `${prefixSaleService}/stock-move/look-up-stock-move/export-and-import?${paramsString}`,
      payload
    );
    if (!res) throw new Error('Opps');
    return res;
  },
  cancelTransaction(id: number) {
    const paramsString = getParamsString({ status: 3 });
    return axiosClient.put(
      `${prefixSaleService}/stock-move/${id}?${paramsString}`
    );
  },
};
