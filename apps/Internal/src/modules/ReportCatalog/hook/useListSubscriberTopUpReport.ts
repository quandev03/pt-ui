import { useMutation, useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { AxiosResponse } from 'axios';
import { prefixReportService } from '@react/url/app';
import dayjs from 'dayjs';
import { formatDateEnglishV2 } from '@react/constants/moment';
import { downloadFile, downloadFileFn } from '@react/utils/handleFile';
import { IParamsRequest } from '@react/commons/types';
import { FILE_TYPE } from '@react/constants/app';
export const SUBSCRIBER_TOPUP_REPORT_QUERY_KEY = {
    LIST: 'query-list-subscriber-topUp-report',
};
interface IParamsReport extends IParamsRequest {
    fromDate?: string;
    toDate?: string;
    saleType?: string;
    paymentType?: string;
    valueSearch?: string;
    format?: 'PDF' | 'HTML' | 'XLSX' | 'CSV';
    orgId?: string
}

const SubscriberTopUpReportService = {
    getList: async (params: IParamsReport) => {
        const res = await axiosClient.get<string, AxiosResponse<string>>(
            `${prefixReportService}/topup-subcriber`,
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
        const { fromDate, toDate, format, valueSearch } = payload;

        const res = await axiosClient.get<string, AxiosResponse<Blob>>(
            `${prefixReportService}/topup-subcriber/export`,
            {
                params: {
                    ...payload,
                    valueSearch,
                    orgId: payload.orgId,
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
        downloadFileFn(res.data, fileName, FILE_TYPE.xlsx);
        return res;
    },
};
export const useListSubscriberTopUpReport = (params: IParamsReport) => {
    return useQuery({
        queryKey: [SUBSCRIBER_TOPUP_REPORT_QUERY_KEY.LIST, params],
        queryFn: () => SubscriberTopUpReportService.getList(params),
        enabled: !!params.fromDate && !!params.toDate,
    });
};

export const useDownloadReport = () => {
    return useMutation({
        mutationFn: SubscriberTopUpReportService.downloadReport,
    });
};