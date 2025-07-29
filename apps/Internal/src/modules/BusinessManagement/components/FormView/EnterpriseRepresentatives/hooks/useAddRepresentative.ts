import { NotificationSuccess } from '@react/commons/Notification';
import { formatDateEnglishV2 } from '@react/constants/moment';
import { MESSAGE } from '@react/utils/message';
import { useMutation } from '@tanstack/react-query';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';

const addRepresentative = ({ files, form, id }: any) => {
  const formData = new FormData();
  Object.keys(files).forEach((key: string) => {
    if (files[key]) {
      formData.append(key, files[key] as Blob);
    }
  });
  const data = JSON.stringify({
    ...form,
    enterpriseId: id,
    startDate: form.startDate.format(formatDateEnglishV2),
    endDate: form.endDate.format(formatDateEnglishV2),
    idIssueDate: form.idIssueDate.format(formatDateEnglishV2),
    birthday: form.birthday.format(formatDateEnglishV2),
    idExpiry: form.idExpiry
      ? form.idExpiry.format(formatDateEnglishV2)
      : undefined,
    status: form.status ? 1 : 0,
  });
  formData.append('data', data);
  return axiosClient.post<any>(
    `${prefixCustomerService}/authorized-person`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
};
export const useAddRepresentative = (onSuccess: () => void) => {
  return useMutation({
    mutationFn: addRepresentative,
    onSuccess: () => {
      NotificationSuccess(MESSAGE.G01);
      onSuccess();
    },
  });
};
