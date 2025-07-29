import { prefixSaleService } from '@react/url/app';
import { handlePrintPdf } from '@react/utils/handleFile';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';

interface PrintRequest {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  position: string;
  receiver: string;
}

const fetcher = (body: PrintRequest) => {
  return axiosClient.post<PrintRequest, Blob>(
    `${prefixSaleService}/delivery-note/create-ticket-report`,
    body,
    { responseType: 'blob' }
  );
};

export const usePrintReport = () => {
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (res) => handlePrintPdf(res),
  });
};
