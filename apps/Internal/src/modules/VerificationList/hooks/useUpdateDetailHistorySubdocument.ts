import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { axiosClient } from 'apps/Internal/src/service';
import { NotificationSuccess } from '@react/commons/Notification';
import { CommonError, FieldErrorsType } from '@react/commons/types';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import useCensorshipStore from '../store';
import { IPayloadConfirm } from '../types';

export interface ItemEdit {
  id?: string;
  name: string;
  birthDate: string;
  sex: string;
  address: string;
  province: string;
  district: string;
  precinct: string;
  idNo: string;
  idType: string;
  idIssueDate: string;
  idIssuePlace: string;
  idIssueDateExpire: string;
}

const editApi = (data: IPayloadConfirm) => {
    const { id, ...payload } = data;
    return axiosClient.post<any>(
      `${prefixCustomerService}/doc-update/save?subDocumentId=${id}`,
    payload
  );
};

export const useUpdateDetailHistorySubdocument = (form: any) => {
  const navigate = useNavigate();
  const { setIsDisableSync, resetGroupStore } = useCensorshipStore();
  return useMutation({
    mutationFn: editApi,
    onSuccess: () => {
      NotificationSuccess('Cập nhật thành công');
      resetGroupStore();
      navigate(-1);
    },
    onError: (err: CommonError) => {
      if (err?.errors?.length > 0) {
        form.setFields(
          err?.errors?.map((item: FieldErrorsType) => ({
            name: ['new', item.field],
            errors: [item.detail],
          }))
        );
      }
      if (err.code === 'CUS00116') {
        setIsDisableSync(false);
      }
    },
  });
};
