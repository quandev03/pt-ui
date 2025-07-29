import { prefixCatalogService } from '@react/url/app';
import { axiosClient } from 'apps/Internal/src/service';
import { ICoverageAreaItem } from '../../GeographicCoverageManagement/types';
import { useMutation } from '@tanstack/react-query';
import { AnyElement } from '@react/commons/types';

const fetch = async (id: string | undefined) => {
  return await axiosClient.get<string, ICoverageAreaItem>(
    `${prefixCatalogService}/coverage-range/${id}`
  );
};

export const useSupportGetCoverageArea = (
  onSuccess?: (data: AnyElement) => void
) => {
  return useMutation({
    mutationFn: fetch,
    onSuccess: (data) => {
      onSuccess && onSuccess(data);
    },
  });
};
