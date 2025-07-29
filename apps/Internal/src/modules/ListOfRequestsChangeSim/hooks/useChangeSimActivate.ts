import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import useStoreListOfRequestsChangeSim from '../store';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { useNavigate } from 'react-router-dom';
import { NotificationSuccess } from '@react/commons/Notification';

export interface Req {
  requestId: string;
}

interface Res {
  data: any;
}

const fetcher = (files: any) => {
  const formData = new FormData();
  Object.keys(files).forEach((key: string) => {
    if (files[key]) {
      console.log(files[key]);
      formData.append(key, files[key] as Blob);
    }
  });
  return axiosClient.post<Req, Res>(
    `${prefixCustomerService}/change-sim/activate`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
};

export const useChangeSimActivate = () => {
  const { formAntd, resetGroupStore, setChangeSimCode } =
    useStoreListOfRequestsChangeSim();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: () => {
      resetGroupStore();
      setChangeSimCode();
      NotificationSuccess(
        `Đổi SIM thành công với Serial mới là ${formAntd.getFieldValue(
          'serial'
        )}`
      );
      formAntd.resetFields();
      navigate(-1);
    },
  });
};
