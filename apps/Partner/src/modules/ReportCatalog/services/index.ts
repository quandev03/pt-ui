import { formatDateEnglishV2 } from '@react/constants/moment';
import { prefixReportServicePublic } from '@react/url/app';
import { downloadFile } from '@react/utils/handleFile';
import { axiosClient } from 'apps/Partner/src/service';
import { AxiosResponse } from 'axios';
import dayjs from 'dayjs';
import { IParamsReport } from '../types';
export const SubscriberTopUpReportService = {
  getList: async (params: IParamsReport) => {
    const res = await axiosClient.get<string, AxiosResponse<string>>(
      `${prefixReportServicePublic}/topup-subcriber`,
      { params },
    );
    const data = {
      data: res.data,
      pagination: {
        total: res.headers['x-total-elements'] ?? 0,
        current: res.headers['x-page-number'] ?? 0,
        pageSize: res.headers['x-page-size'] ?? 0,
      },
    };
    return data;
  },
  downloadReport: async (payload: IParamsReport) => {
    const { fromDate, toDate, format,valueSearch } = payload;
    
    const res = await axiosClient.get<string, AxiosResponse<Blob>>(
      `${prefixReportServicePublic}/topup-subcriber/export`,
      {
        params: {
          ...payload,
          valueSearch,
          fromDate: fromDate
            ? dayjs(fromDate).format(formatDateEnglishV2)
            : dayjs().subtract(29, 'day').format(formatDateEnglishV2),
          toDate: toDate
            ? dayjs(toDate).format(formatDateEnglishV2)
            : dayjs().format(formatDateEnglishV2),
          format,
        },
        responseType: 'blob',
      }
    );
    const fileName =
      res.headers['content-disposition']
        .split(';')[1]
        .split('=')[1]
        .replace(/"/g, '') ?? 'Baocao_naptien_cho_thuebao.xlsx';
    downloadFile(res.data, fileName);
    return res;
  },
};

export const PackageSalesReportService = {
  getList: async (params: IParamsReport) => {
    const res = await axiosClient.get<string, AxiosResponse<string>>(
      `${prefixReportServicePublic}/sale-package`,
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
      `${prefixReportServicePublic}/sale-package/export`,
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
