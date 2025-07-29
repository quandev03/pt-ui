import { axiosClient } from 'apps/Internal/src/service';
import { urlUploadNumber } from '../services/url';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  NotificationError,
  NotificationSuccess,
} from '@react/commons/Notification';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { blobToJson } from '@react/helpers/utils';
import { IErrorResponse } from '@react/commons/types';
import { downloadFile } from '@react/utils/handleFile';
import useFileNameDownloaded from 'apps/Internal/src/components/layouts/store/useFileNameDownloaded';
import { MESSAGE } from '@react/utils/message';

const fetcher = async (values: Record<string, any>) => {
  const { description, numberFile, files } = values;
  const formData = new FormData();
  if (numberFile) {
    formData.set('numberFile', numberFile);
  }
  if (files) {
    const attachmentInfos: { description: string }[] = [];
    files.forEach((fileData: { files: File; desc: string }) => {
      formData.append('attachmentFiles', fileData.files);
      attachmentInfos.push({ description: fileData.desc });
    });
    formData.set(
      'attachmentInfos',
      new Blob([JSON.stringify(attachmentInfos)], {
        type: 'application/json',
      })
    );
  }
  const metadata = {
    description: description,
  };
  formData.set(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  );
  const res = await axiosClient.post<string, Blob>(urlUploadNumber, formData, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res;
};
const useAddUploadNumber = (
  onSuccess: (data: any) => void,
  onError: (data: any) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (data) => {
      NotificationSuccess(MESSAGE.G01);
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_UPLOAD_NUMBER],
      });
      onSuccess(data);
    },
    onError: async (error: Blob) => {
      try {
        const errorJson = await blobToJson<IErrorResponse>(error);
        if (errorJson.errors && errorJson.errors.length > 0) {
          onError(errorJson.errors);
        } else if (errorJson.detail) {
          NotificationError(errorJson.detail);
        } else {
          const fileName = useFileNameDownloaded.getState().name;
          downloadFile(error, fileName ? fileName : 'upload_number');
        }
      } catch (e) {
        const fileName = useFileNameDownloaded.getState().name;
        downloadFile(error, fileName ? fileName : 'upload_number');
      }
    },
  });
};
export default useAddUploadNumber;
