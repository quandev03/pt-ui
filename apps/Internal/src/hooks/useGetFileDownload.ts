import { FILE_TYPE } from '@react/constants/app';
import { useMutation } from '@tanstack/react-query';
import useFileNameDownloaded from '../components/layouts/store/useFileNameDownloaded';
import {
  prefixCatalogService,
  prefixCustomerService,
  prefixResourceService,
  prefixSaleService,
} from '@react/url/app';
import { axiosClient } from '../service';

interface ExportRequest {
  uri: string;
  filename?: string;
  createdDate?: string;
}

type ParameterResquest = { id: number; fileName: string };

const openSaveDialog = (data: Blob, filename?: string) => {
  const url = window.URL.createObjectURL(data);
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.href = url;
  a.download = filename ?? useFileNameDownloaded.getState().name;
  a.click();
  URL.revokeObjectURL(a.href);
  a.remove();
};

const getFileBlob = (data: Blob, payload: ParameterResquest) => {
  console.log(
    '💩💩💩💩💩🙏🏿🙏🏿🙏🏿🙏🏿🙈🙈🙊🙊💋💋😝😝 ~ getFileBlob ~ payload:',
    payload
  );
  const { fileName } = payload;
  const filenameSplit = fileName.split('.');
  const fileType = filenameSplit[
    filenameSplit.length - 1
  ] as keyof typeof FILE_TYPE;
  const blob = new Blob([data], {
    type: FILE_TYPE[fileType],
  });
  return blob;
};

const fetcher = async (payload: ParameterResquest) => {
  const res = await axiosClient.get<string, Blob>(
    `${prefixSaleService}/files/${payload.id}`,
    {
      responseType: 'blob',
    }
  );
  return res;
};

export const useGetFileDownload = () => {
  return useMutation({
    mutationFn: fetcher,
    onSuccess(data, payload) {
      const { fileName } = payload;
      const blob = getFileBlob(data, payload);
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

export const useGetFile = () => {
  return useMutation({
    mutationFn: async (payload: ParameterResquest) => {
      const res = await fetcher(payload);
      const blob = getFileBlob(res, payload);
      return new File([blob], payload.fileName);
    },
  });
};

export const useDownloadCatalogFile = () => {
  return useMutation({
    mutationFn: async (payload: ExportRequest) => {
      return await axiosClient.post<string, Blob>(
        `${prefixCatalogService}/files`,
        {
          fileUrl: payload.uri,
        },
        {
          responseType: 'blob',
        }
      );
    },
    onSuccess(data, payload) {
      openSaveDialog(data, payload.filename);
    },
  });
};

export const useDownloadCustomerFile = () => {
  return useMutation({
    mutationFn: async (payload: ExportRequest) => {
      return await axiosClient.post<string, Blob>(
        `${prefixCustomerService}/files`,
        {
          fileUrl: payload.uri,
        },
        {
          responseType: 'blob',
        }
      );
    },
    onSuccess(data, payload) {
      openSaveDialog(data, payload.filename);
    },
  });
};

export const useDownloadSaleFile = () => {
  return useMutation({
    mutationFn: async (payload: ExportRequest) => {
      return await axiosClient.post<string, Blob>(
        `${prefixSaleService}/files`,
        {
          fileUrl: payload.uri,
        },
        {
          responseType: 'blob',
        }
      );
    },
    onSuccess(data, payload) {
      openSaveDialog(data, payload.filename);
    },
  });
};

export const useDownloadResourceFile = () => {
  return useMutation({
    mutationFn: async (payload: ExportRequest) => {
      return await axiosClient.post<string, Blob>(
        `${prefixResourceService}/files`,
        {
          fileUrl: payload.uri,
        },
        {
          responseType: 'blob',
        }
      );
    },
    onSuccess(data, payload) {
      openSaveDialog(data, payload.filename);
    },
  });
};
