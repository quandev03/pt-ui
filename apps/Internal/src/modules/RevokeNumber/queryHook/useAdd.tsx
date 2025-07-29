import {
  NotificationError,
  NotificationSuccess,
} from '@react/commons/Notification';
import { IErrorResponse, IFieldErrorsItem } from '@react/commons/types';
import { blobToJson } from '@react/helpers/utils';
import { downloadFile } from '@react/utils/handleFile';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useFileNameDownloaded from 'apps/Internal/src/components/layouts/store/useFileNameDownloaded';
import { NumberProcessType } from 'apps/Internal/src/constants/constants';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import { urlRevokeNumber } from '../services';
import { IStockIsdn } from '../types';
import { MESSAGE } from '@react/utils/message';
import { NotificationNodeError } from 'apps/Internal/src/components/NotificationNodeError';
import CTooltip from '@react/commons/Tooltip';
import { Text } from '@react/commons/Template/style';

const fetcher = async (values: Record<string, any | any[]>) => {
  const {
    stockId,
    ieStockId,
    reasonId,
    description,
    processType,
    files,
    numberFile,
    listNumberSelected,
  } = values;
  const metadata = {
    stockId: stockId,
    ieStockId: ieStockId,
    reasonId: reasonId,
    description: description,
    processType: processType,
    numbers: listNumberSelected.map((item: IStockIsdn) => `${item.isdn}`) ?? [],
  };
  const formData = new FormData();
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
  formData.set(
    'metadata',
    new Blob([JSON.stringify(metadata)], {
      type: 'application/json',
    })
  );
  const res = await axiosClient.post<Blob, any>(
    `${urlRevokeNumber}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'blob',
    }
  );
  return res;
};

export const useAddRevokeNumberMutation = (
  onSuccess: (data: Blob) => void,
  onError: (data: IFieldErrorsItem[]) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (data) => {
      NotificationSuccess(MESSAGE.G01);
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.GET_LIST_REVOKE_NUMBER],
      });
      onSuccess && onSuccess(data);
    },
    onError: async (error: Blob) => {
      try {
        const errorJson = await blobToJson<IErrorResponse>(error);
        if (errorJson.errors && errorJson.errors.length > 0) {
          if (errorJson.code === 'RSRC15148') {
            NotificationNodeError(
              <div className="flex flex-col gap-2">
                {errorJson.errors.map((item) => (
                  <CTooltip
                    title={item.detail}
                    key={item.detail}
                    className="truncate"
                  >
                    <Text>
                      {item.detail} - {item.field}
                    </Text>
                  </CTooltip>
                ))}
              </div>
            );
          } else {
            onError(errorJson.errors);
          }
        } else if (errorJson.detail) {
          NotificationError(errorJson.detail);
        } else {
          const fileName = useFileNameDownloaded.getState().name;
          downloadFile(error, fileName ? fileName : 'transfer_number');
        }
      } catch (e) {
        const fileName = useFileNameDownloaded.getState().name;
        downloadFile(error, fileName ? fileName : 'transfer_number');
      }
    },
  });
};
