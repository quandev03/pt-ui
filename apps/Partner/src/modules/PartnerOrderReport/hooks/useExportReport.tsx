import { useMutation } from '@tanstack/react-query';
import { partnerOrderReportServices } from '../services';
import dayjs from 'dayjs';
import { IErrorResponse, NotificationError } from '@vissoft-react/common';

export const useExportReport = () => {
  return useMutation({
    mutationFn: partnerOrderReportServices.exportReport,
    onSuccess: (res) => {
      const url = window.URL.createObjectURL(res);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.href = url;
      a.download = `Bao_cao_don_hang${dayjs().format('DDMMYYYY')}`;
      a.click();
      URL.revokeObjectURL(a.href);
      a.remove();
    },
    onError(error: IErrorResponse) {
      NotificationError(error);
    },
  });
};
