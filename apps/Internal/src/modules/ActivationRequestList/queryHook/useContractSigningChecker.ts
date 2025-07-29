import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { useActiveSubscriptStore } from '../store';
import { NotificationSuccess } from '@react/commons/Notification';
import { FormInstance } from 'antd';
import { ActionType } from '@react/constants/app';

export interface Res {
  signed: boolean;
}

export interface Req {
  contractNo: string;
  key: TypePDF;
}

export enum TypePDF {
  HD = 'HD',
  ND13 = 'ND13',
}

const fetcher = (body: Req) => {
  return axiosClient.get<Req, Res>(
    `/customer-service/private/api/v1/contract-signing-checker/${body.contractNo}`
  );
};

export const useContractSigningChecker = (
  form: FormInstance,
  typeModal?: ActionType
) => {
  const {
    setSignND13Success,
    setSignSuccess,
    setIsDisabledContract,
    interval,
    setIsRefresh,
    setIsShowContract,
    setIsCheckUpdateSuccess,
  } = useActiveSubscriptStore();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (data, variables) => {
      if (data.signed === true) {
        form.setFields([
          {
            name: 'cardContract',
            errors: [],
          },
          {
            name: 'fileND13',
            value: 'Biên_bản_xác_nhận_NĐ13',
            errors: [],
          },
        ]);
        setSignND13Success(true);
        setIsRefresh(false);
        setSignSuccess(true);
        setIsShowContract(true);
        setIsDisabledContract(true);
        NotificationSuccess('Ký thành công');
        clearTimeout(interval);
        if (typeModal === ActionType.EDIT) {
          setIsCheckUpdateSuccess(true);
        }
      }
    },
  });
};
