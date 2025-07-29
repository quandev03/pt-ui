import { useMutation } from '@tanstack/react-query';
import { addDistributeNumber } from '../services';
import {
  CTooltip,
  NotificationError,
  NotificationSuccess,
} from '@react/commons/index';
import { MESSAGE } from '@react/utils/message';
import { IErrorResponse, IFieldErrorsItem } from '@react/commons/types';
import { blobToJson } from '@react/helpers/utils';
import { NotificationNodeError } from 'apps/Internal/src/components/NotificationNodeError';
import { Text } from '@react/commons/Template/style';

export const useAddDistributeNumber = (
  onSuccess: (data: any) => void,
  onError: (data: IFieldErrorsItem[]) => void
) => {
  return useMutation({
    mutationFn: addDistributeNumber,
    onSuccess: (data: any) => {
      NotificationSuccess(MESSAGE.G01);
      onSuccess(data);
    },
    onError: async (error: any) => {
      if (error instanceof Blob) {
        const parsedError = await blobToJson<IErrorResponse>(error);
        if (parsedError?.errors && parsedError?.errors.length > 0) {
          if (parsedError.code === 'RSRC15147') {
            NotificationNodeError(
              <div className="flex flex-col gap-2">
                {parsedError.errors.map((item) => (
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
            onError(parsedError.errors);
          }
        } else {
          NotificationError(parsedError?.errors[0]?.detail);
        }
      } else {
        NotificationError(error?.errors[0]?.detail);
      }
    },
  });
};
