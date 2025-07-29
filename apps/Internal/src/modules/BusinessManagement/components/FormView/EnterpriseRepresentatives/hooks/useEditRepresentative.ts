import { useMutation } from '@tanstack/react-query';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';
import { useNavigate } from 'react-router-dom';

const editRep = (data: any) => {
  const formData = new FormData();
  const request = JSON.stringify({
    status: data.status ? 1 : 0,
  });
  formData.append('data', new Blob([request], { type: 'application/json' }));
  return axiosClient.put<any, any>(
    `${prefixCustomerService}/authorized-person?id=${data.id}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
};
export const useEditRepresentative = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: editRep,
    onSuccess: () => {
      navigate(-1);
    },
  });
};
