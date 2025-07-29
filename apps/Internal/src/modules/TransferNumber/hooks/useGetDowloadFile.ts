import { prefixResourceService } from "@react/url/app"
import { useMutation } from "@tanstack/react-query"
import { axiosClient } from "apps/Internal/src/service"
import { downloadFile } from "../constants";

const queryKey = 'GET_DOWNLOAD_FILE'
interface ExportRequest {
    uri: string;
    filename: string;
    createdDate: string
}
const fetcher = async ({ uri }: ExportRequest) => {
    const res = await axiosClient.get<ExportRequest, Blob>(`${prefixResourceService}/download-file/${uri}`, {
        responseType: 'blob'
    })
    return res
}
const useGetDownloadFile = () => {
    return useMutation({
        mutationKey: [queryKey],
        mutationFn: fetcher,
        onSuccess: (data, { filename, createdDate }) => {
          console.log('data', data)
          return downloadFile(data, filename, createdDate)
        }
    })
}
export default useGetDownloadFile
