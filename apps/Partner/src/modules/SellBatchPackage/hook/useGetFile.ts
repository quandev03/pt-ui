import {  downloadFileFn } from "@react/utils/handleFile";
import { useMutation } from "@tanstack/react-query";
import { urlSellBatchPackage } from "../service/url";
import { axiosClient } from "apps/Partner/src/service";
import useFileNameDownloaded from "apps/Partner/src/hooks/useFileNameDownloaded";
import { FILE_TYPE } from "@react/constants/app";
interface ExportRequest {
    uri: string;
}

const fetcher = () => {
    return axiosClient.get<ExportRequest, Blob>(`${urlSellBatchPackage}/action/get-excel`, {
        responseType: 'blob',
    });
};
export const useGetFile = () => {
    return useMutation({
        mutationFn: fetcher,
        onSuccess: (res: Blob) => {
            const name = useFileNameDownloaded.getState().name;
            downloadFileFn(res,name ? name : "danh-sach-thue-bao-nap-goi-mau",FILE_TYPE.xlsx)
        },
    });
};
