import { prefixCustomerService } from '@react/url/app';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';

const fetcher = ({ id, listPhoneNumber }: { id: string; listPhoneNumber: string[] }) => {
  const phoneListParam = listPhoneNumber && listPhoneNumber.length > 0 
    ? listPhoneNumber.join(',') 
    : '';
  return axiosClient.get<string, boolean>(
    `${prefixCustomerService}/change-information/show-otp-transferee?idNo=${id}&phoneList=${phoneListParam}`
  );
};

export const useGetShowOtpTransferee = () => {
  return useMutation({
    mutationFn: fetcher,
  });
};
