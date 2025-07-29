import { FILE_TYPE } from "@react/constants/app";
import { useMutation } from "@tanstack/react-query";
import { axiosClient } from "apps/Internal/src/service";

const fetcher = async (payload: { id: number; fileName: string }) => {
    const res = await axiosClient.get<string, Blob>(
        `/sale-service/public/api/v1/files/${payload.id}`,
        {
            responseType: 'blob',
        }
    );
    return res;
}
const useGetFileDownload = () => {
    return useMutation({
        mutationFn: fetcher,
        onSuccess(data, payload) {
            const { fileName } = payload;
            const filenameSplit = fileName.split('.');
            const fileType = filenameSplit[
                filenameSplit.length - 1
            ] as keyof typeof FILE_TYPE;

            const blob = new Blob([data], {
                type: FILE_TYPE[fileType],
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.href = url;
            a.download = fileName;
            a.click();
            URL.revokeObjectURL(a.href);
            a.remove();
        },
    });
};
export default useGetFileDownload