import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { queryKeyListNote } from './useListNote';
import { prefixSaleService } from '@react/url/app';

export const queryKeyConfig = 'query-combine-individual-kits';

export interface RequestAddNote {
  payload: any;
  listFile: any[];
  isImport?: boolean;
}

const fetcher = ({ payload, listFile, isImport }: RequestAddNote) => {
  const formData = new FormData();
  const deliveryNote = new Blob([JSON.stringify(payload)], {
    type: 'application/json',
  });
  formData.append('deliveryNote', deliveryNote);
  listFile?.forEach((file) => {
    formData.append('attachments', file);
  });
  console.log(listFile, 'payload :>> ', payload);
  return axiosClient.post<Request, Response>(
    `${prefixSaleService}/delivery-note/create-ticket-${
      isImport ? 'in' : 'out'
    }`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data ',
      },
    }
  );
};

export const useAddNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [queryKeyConfig],
    mutationFn: fetcher,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeyListNote],
      });
    },
  });
};
