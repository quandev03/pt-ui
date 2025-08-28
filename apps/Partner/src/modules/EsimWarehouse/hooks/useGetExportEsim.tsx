import { useMutation } from '@tanstack/react-query';
import { esimWarehouseServices } from '../services';
import dayjs from 'dayjs';
import { IErrorResponse, NotificationError } from '@vissoft-react/common';

export const useGetExportEsim = () => {
  return useMutation({
    mutationFn: esimWarehouseServices.getExportReport,
    onSuccess: (blobData) => {
      const url = window.URL.createObjectURL(blobData);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.href = url;
      a.download = `Danh_sach_esim_${dayjs().format('YYYYMMDD')}.xlsx`;
      a.click();
      URL.revokeObjectURL(a.href);
      a.remove();
    },
    onError(error: Error | IErrorResponse) {
      NotificationError({ message: error.message });
    },
  });
};
