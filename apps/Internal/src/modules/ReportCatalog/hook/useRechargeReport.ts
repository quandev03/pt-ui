import { AnyElement } from '@react/commons/types';
import { formatDateEnglishV2 } from '@react/constants/moment';
import { prefixSaleServicePrivate } from '@react/url/app';
import { downloadFileFn } from '@react/utils/handleFile';
import { useMutation, useQuery } from '@tanstack/react-query';
import useFileNameDownloaded from 'apps/Internal/src/components/layouts/store/useFileNameDownloaded';
import { axiosClient } from 'apps/Internal/src/service';
import dayjs from 'dayjs';
import { IParamsReport } from '../type';
import { FILE_TYPE } from '@react/constants/app';
export interface IParamsReportRecharge {
    fromDate?: string;
    toDate?: string;
    valueSearch?: string;
    format?: 'PDF' | 'HTML' | 'XLSX' | 'CSV';
    paymentStatus?: string;
}
const RechargeReportServices = {
    getList: async (params: IParamsReportRecharge) => {
        const res = await axiosClient.get<string, AnyElement>(
            `${prefixSaleServicePrivate}/topup-transaction`,
            {
                params: {
                    ...params,
                    paymentStatus: params.paymentStatus === "ALL" ? undefined : params.paymentStatus,
                },
            }
        );
        return res;
    },
    downloadReport: async (payload: IParamsReportRecharge) => {
        const { fromDate, toDate, format, paymentStatus } = payload;
        const res = await axiosClient.get<string, AnyElement>(
            `${prefixSaleServicePrivate}/topup-transaction/export`,
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
                    paymentStatus: paymentStatus === "ALL" ? undefined : paymentStatus,
                    format,
                },
                responseType: 'blob',
            }
        );
        return res;
    },
};
export const RECHARGE__REPORT_QUERY_KEY = {
    LIST: 'query-list-recharge-report',
};

export const useRechargeReport = (params: IParamsReport) => {
    return useQuery({
        queryKey: [RECHARGE__REPORT_QUERY_KEY.LIST, params],
        queryFn: () => RechargeReportServices.getList(params),
        enabled: !!params.fromDate && !!params.toDate,
    });
};

export const useDownloadReport = () => {
    return useMutation({
        mutationFn: RechargeReportServices.downloadReport,
        onSuccess: (res) => {
            const fileStore = useFileNameDownloaded.getState().name;
            downloadFileFn(res, fileStore, FILE_TYPE.xlsx);
        },
    });
};