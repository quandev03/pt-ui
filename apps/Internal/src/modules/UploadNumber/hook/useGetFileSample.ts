import { downloadFileFn } from "@react/utils/handleFile";
import { useMutation } from "@tanstack/react-query";
import { axiosClient } from "apps/Internal/src/service";
interface ExportRequest {
    uri: string;
    filename?: string;
}

const fetcher = ({ uri }: ExportRequest) => {
    return axiosClient.get<ExportRequest, Blob>(uri, {
        responseType: 'blob',
    });
};
export const useGetFileSample = () => {
    return useMutation({
        mutationFn: fetcher,
        onSuccess: (res: Blob) => {
            downloadFileFn(res, 'Danh sách tài nguyên số', 'text/csv');
        },
    });
};
