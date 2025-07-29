import { prefixResourceService } from '@react/url/app';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { IColumnExportNumberPartner } from '../types';

const fetcher = (id: string) => {
  return axiosClient.get<string, IColumnExportNumberPartner>(
    `${prefixResourceService}/export-number-for-partner/${id}`
  );
};

export const useGetDetailExportNumberPartner = (
  onSuccess: (data: IColumnExportNumberPartner) => void
) => {
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (data) => {
      onSuccess(data);
    },
  });
};
