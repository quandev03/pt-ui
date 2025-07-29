import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormInstance } from 'antd';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import {
  NotificationSuccess,
  NotificationError,
} from '@react/commons/Notification';
import { MESSAGE } from '@react/utils/message';
import { prefixResourceService } from '@react/url/app';
import { NumberProcessType } from 'apps/Internal/src/constants/constants';
import { IErrorResponse, IFieldErrorsItem } from '@react/commons/types';
import { downloadFile } from '../constant';
import useFileNameDownloaded from 'apps/Internal/src/components/layouts/store/useFileNameDownloaded';
import { blobToJson } from '@react/helpers/utils';

const fetcher = (values: Record<string, any>) => {
  const formData = new FormData();
  const {
    numberFile,
    files,
    description,
    processType,
    productId,
    stockId,
    number,
  } = values;

  if (NumberProcessType.BATCH === processType && numberFile) {
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
    description,
    processType,
    productId,
    stockId,
    number,
  };
  formData.set(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  );
  return axiosClient.post<string, Blob>(
    `${prefixResourceService}/classify-special-number`,
    formData,
    {
      responseType: 'blob',
    }
  );
};

export const useAddClassifySpecialNumberMutation = (
  onSuccess: (data: Blob) => void,
  onError: (data: IFieldErrorsItem[]) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_CLASSIFY_SPECIAL_NUMBER],
      });
      NotificationSuccess(MESSAGE.G01);
      onSuccess(data);
    },
    onError: async (data: Blob, values: Record<string, any>) => {
      const handleDownloadFile = () => {
        NotificationError('File tải lên sai thông tin, Vui lòng kiểm tra lại');
        setTimeout(() => {
          downloadFile(
            data,
            useFileNameDownloaded.getState().name
              ? useFileNameDownloaded.getState().name
              : 'Ket qua gan so dac biet.xlsx'
          );
        }, 2000);
      };
      try {
        const errorJson = await blobToJson<IErrorResponse>(data);
        if (errorJson.errors) {
          onError(errorJson.errors);
        } else {
          handleDownloadFile();
        }
      } catch (e) {
        handleDownloadFile();
      }
    },
  });
};
