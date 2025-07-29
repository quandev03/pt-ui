import {
  NotificationError,
  NotificationSuccess,
} from '@react/commons/Notification';
import CTooltip from '@react/commons/Tooltip';
import { IErrorResponse, IFieldErrorsItem } from '@react/commons/types';
import { blobToJson } from '@react/helpers/utils';
import { MESSAGE } from '@react/utils/message';
import { useMutation } from '@tanstack/react-query';
import useFileNameDownloaded from 'apps/Internal/src/components/layouts/store/useFileNameDownloaded';
import { NotificationNodeError } from 'apps/Internal/src/components/NotificationNodeError';
import { downloadFile } from '../constants';
import { addTransferNumber } from '../services/service';
import { Text } from '@react/commons/Template/style';

export const useAddTransferNumber = (
  onSuccess: (data: Blob) => void,
  onError: (data: IFieldErrorsItem[]) => void
) => {
  return useMutation({
    mutationFn: addTransferNumber,
    onSuccess: (data) => {
      NotificationSuccess(MESSAGE.G01);
      onSuccess(data);
    },
    onError: async (error: Blob) => {
      const handleError = async (error: Blob) => {
        NotificationError('File tải lên sai thông tin, Vui lòng kiểm tra lại');
        const fileName = useFileNameDownloaded.getState().name;
        downloadFile(error, fileName ? fileName : 'transfer_number');
      };
      try {
        const errorJson = await blobToJson<IErrorResponse>(error);
        if (errorJson.errors && errorJson.errors.length > 0) {
          if (errorJson.code === 'RSRC20401') {
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
          handleError(error);
        }
      } catch (e) {
        handleError(error);
      }
    },
  });
};
