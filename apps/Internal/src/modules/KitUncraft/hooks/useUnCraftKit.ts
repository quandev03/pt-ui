import { NotificationSuccess } from '@react/commons/index';
import { MESSAGE } from '@react/utils/message';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { queryKeyListKitUnCraft } from './useListKit';
import { prefixResourceService } from '@react/url/app';

export const queryKeyConfig = 'query-combine-pack-kits';

const fetcher = ({ payload, file }: any) => {
  const formData = new FormData();
  const request = new Blob([JSON.stringify(payload)], {
    type: 'application/json',
  });
  formData.append('request', request);
  formData.append('uploadFile', file);
  return axiosClient.post<Request, Response>(
    `${prefixResourceService}/sim-registrations/cancel-sim-registration-tran`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data ',
      },
    }
  );
};

export const useUnCraftKit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [queryKeyConfig],
    mutationFn: fetcher,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeyListKitUnCraft],
      });
      NotificationSuccess(MESSAGE.G01);
    },
  });
};
