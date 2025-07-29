import {
  NotificationError,
  NotificationSuccess,
} from '@react/commons/Notification';
import { FILE_TYPE } from '@react/constants/app';
import { MODE_METHOD } from '@react/constants/eximTransaction';
import { downloadFileFn } from '@react/utils/handleFile';
import { useMutation } from '@tanstack/react-query';
import { createExportTransactionApi } from '../services';
import { IErrorResponse } from '@react/commons/types';
import useFileNameDownloaded from 'apps/Internal/src/components/layouts/store/useFileNameDownloaded';
import { log } from 'console';

const blobToObject = (blob: Blob): Promise<any> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const result = JSON.parse(reader.result as string);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => {
      reject(reader.error);
    };
    reader.readAsText(blob);
  });
};

export const useCreateExportTransaction = (
  onSuccess: () => void,
  onError: (error: any) => void
) => {
  return useMutation({
    mutationFn: createExportTransactionApi,
    async onSuccess(data: Blob, variables) {
      const nameFile =
        variables.stockMoveDTO.moveMethod === MODE_METHOD.EXPORT
          ? 'export_transaction.xlsx'
          : 'import_transaction.xlsx';
      try {
        const payload = await blobToObject(data);
        if (payload.id) {
          onSuccess();
          NotificationSuccess('Thêm mới thành công !');
        } else {
          downloadFileFn(data, nameFile, FILE_TYPE.xlsx);
        }
      } catch (error) {
        downloadFileFn(data, nameFile, FILE_TYPE.xlsx);
      }
    },
    async onError(error: Blob) {
      const nameFile = useFileNameDownloaded.getState().name ?? '';

      try {
        const errorObject: IErrorResponse = await blobToObject(error);
        if (errorObject.status) {
          if (errorObject?.errors && errorObject?.errors.length > 0) {
            onError(errorObject?.errors);
          } else {
            NotificationError(errorObject.detail);
          }
        } else {
          downloadFileFn(error, nameFile, FILE_TYPE.xlsx);
        }
      } catch {
        NotificationError('File tải lên sai thông tin, Vui lòng kiểm tra lại');
        downloadFileFn(error, nameFile, FILE_TYPE.xlsx);
      } finally {
        useFileNameDownloaded.getState().setName('');
      }
    },
  });
};
