import { formatDateEnglishV2 } from '@react/constants/moment';
import { prefixReportService } from '@react/url/app';
import { downloadFile } from '@react/utils/handleFile';
import { useMutation, useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { AxiosResponse } from 'axios';
import dayjs from 'dayjs';
import { IParamsReport } from '../type';

import { prefixCatalogServicePublic } from '@react/url/app';
import { useInfiniteQuery } from '@tanstack/react-query';
import { IParamsOrgPartner } from '../type';
const PackageSalesReportService = {
  getList: async (params: IParamsReport) => {
    const res = await axiosClient.get<string, AxiosResponse<string>>(
      `${prefixReportService}/sale-package`,
      { params }
    );

    const data = {
      data: res.data,
      pagination: {
        total: res.headers['x-total-elements'],
        current: res.headers['x-page-number'],
        pageSize: res.headers['x-page-size'],
      },
    };
    return data;
  },
  downloadReport: async (payload: IParamsReport) => {
    const { fromDate, toDate, saleType, paymentType, format } = payload;
    const res = await axiosClient.get<string, AxiosResponse<Blob>>(
      `${prefixReportService}/sale-package/export`,
      {
        params: {
          ...payload,
          filters: undefined,
          fromDate: fromDate
            ? dayjs(fromDate).format(formatDateEnglishV2)
            : dayjs().subtract(29, 'day').format(formatDateEnglishV2),
          toDate: toDate
            ? dayjs(toDate).format(formatDateEnglishV2)
            : dayjs().format(formatDateEnglishV2),
          saleType,
          paymentType,
          format,
        },
        responseType: 'blob',
      }
    );
    const fileName =
      res.headers['content-disposition']
        .split(';')[1]
        .split('=')[1]
        .replace(/"/g, '') ?? 'Baocao_bangoi_cho_thuebao.xlsx';
    downloadFile(res.data, fileName);
    return res;
  },
};

export const PACKAGE_SALES_REPORT_QUERY_KEY = {
  LIST: 'query-list-package-sales-report',
  GET_TYPE: 'query-get-type',
};

export const useListPackageSalesReport = (params: IParamsReport) => {
  return useQuery({
    queryKey: [PACKAGE_SALES_REPORT_QUERY_KEY.LIST, params],
    queryFn: () => PackageSalesReportService.getList(params),
    enabled: !!params.fromDate && !!params.toDate,
  });
};

export const useDownloadReport = () => {
  return useMutation({
    mutationFn: PackageSalesReportService.downloadReport,
  });
};

const queryKeyList = 'list-partners';
const fetcher = async (params: IParamsOrgPartner) => {
  const res = await axiosClient.get<any, any>(
    `${prefixCatalogServicePublic}/organization-partner`, {
    params: params
  }
  );
  return res;
};
// list parter
export const useListPartner = (params: IParamsOrgPartner) => {
  return useInfiniteQuery({
    queryKey: [queryKeyList, params],
    initialPageParam: 0,
    queryFn: ({ pageParam = 0 }) => {
      return fetcher({ ...params, page: pageParam });
    },
    select: (data) => {
      const { pages } = data;
      const result: any[] = [];
      pages.forEach((item) => {
        item.content.forEach((product: any) => {
          result.push(product);
        });
      });
      return result;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.last) {
        return undefined;
      }
      return lastPage.number + 1;
    },
  });
};
