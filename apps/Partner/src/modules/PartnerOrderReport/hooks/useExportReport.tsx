import { useMutation } from '@tanstack/react-query';
import { partnerOrderReportServices } from '../services';
import dayjs from 'dayjs';
import { IErrorResponse, NotificationError } from '@vissoft-react/common';

export const useExportReport = () => {
  return useMutation({
    mutationFn: partnerOrderReportServices.exportReport,
    onSuccess: (blobData) => {
      const url = window.URL.createObjectURL(blobData);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.href = url;
      a.download = `Bao_cao_don_hang_${dayjs().format('YYYYMMDD')}.xlsx`;
      a.click();
      URL.revokeObjectURL(a.href);
      a.remove();
    },
    onError(error: Error | IErrorResponse) {
      NotificationError({ message: error.message });
    },
  });
};
