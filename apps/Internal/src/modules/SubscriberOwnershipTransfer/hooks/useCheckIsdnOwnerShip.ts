import { queryKey } from './../../LockPeriod/hook/useList';
import { IErrorResponse, IFieldErrorsItem } from '@react/commons/types';
import { useMutation } from '@tanstack/react-query';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';
import useOwnershipTransferStore from '../store';

export interface IsdnOwnerShipChecked {
  checkIsdn: boolean;
  cusType: string;
  isShowOTP: boolean;
  front: string;
  back: string;
  portrait: string;
  inforSub: any;
  idEkyc: string;
}

export const queryKeyIsdnOwnerShip = 'query-key-isdn-ownership';

const fetcher = (isdn: string) => {
  return axiosClient.get<string, IsdnOwnerShipChecked>(
    `${prefixCustomerService}/change-information/check-isdn-ownership-transfer?isdn=${isdn}`
  );
};

export const useCheckIsdnOwnerShip = (
  onSuccess: (data: IsdnOwnerShipChecked) => void,
  onError: (errorField: IFieldErrorsItem[]) => void
) => {
  const {
    setCheckIsSuccessGetOTPCustomer,
  } = useOwnershipTransferStore(); 
  return useMutation({
    mutationFn: fetcher,
    mutationKey: [queryKeyIsdnOwnerShip],
    onSuccess: (res) => {
      setCheckIsSuccessGetOTPCustomer(false);
      onSuccess(res);
    },
    onError(error: IErrorResponse & { fieldErrors?: IFieldErrorsItem[] }) {
      if (error?.errors) {
        onError(error?.errors);
      }
    },
  });
};
