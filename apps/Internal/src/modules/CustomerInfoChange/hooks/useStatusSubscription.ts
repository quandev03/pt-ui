import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import useActiveSubscriptStore from '../store';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import {
  CommonError,
  FieldErrorsType,
  ParamsOption,
} from '@react/commons/types';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { formatDateTime } from '@react/constants/moment';
import dayjs from 'dayjs';
import { ParamSerialSim } from './useCheckSerialSim';

interface Res {
  otpStatus: number;
  videoCallStatus: number;
  approveStatus: number;
  approveNumber: number;
  approveNote: string;
  auditStatus: number;
  videoCallUser: string;
  assignUserName: string;
  approveReason: string;
  auditReason: string;
  approveDate: string;
  otpReason: string;
}

const fetcher = (body: ParamSerialSim) => {
  return axiosClient.get<ParamSerialSim, Res>(
    `${prefixCustomerService}/change-information/get-info/${body.isdn}`
  );
};

export const useFetchStatusSubscription = () => {
  const { formAntd: form, setSuccessIsdn } = useActiveSubscriptStore();
  const { SUB_DOCUMENT_APPROVAL_STATUS = [] } =
    useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);
  const { SUB_DOCUMENT_AUDIT_STATUS = [] } =
    useGetDataFromQueryKey<ParamsOption>([REACT_QUERY_KEYS.GET_PARAMS]);
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (data) => {
      setSuccessIsdn(true);

      form.setFieldsValue({
        otpStatus:
          data.otpStatus === 0
            ? 'Chưa xác thực'
            : data.otpStatus === 1
            ? 'Đã xác thực'
            : '',
        videoCallStatus:
          data.videoCallStatus === 0
            ? 'Chưa xác thực'
            : data.videoCallStatus === 1
            ? 'Đã xác thực'
            : '',
        approveStatus: SUB_DOCUMENT_APPROVAL_STATUS?.find(
          (item: any) => parseInt(item.value) === data.approveStatus
        )?.label,
        approveNumber: data.approveNumber,
        approveNote: data.approveNote,
        auditStatus: SUB_DOCUMENT_AUDIT_STATUS?.find(
          (item: any) => parseInt(item.value) === data.auditStatus
        )?.label,
        videoCallUser: data.videoCallUser,
        assignUserName: data.assignUserName,
        approveReason: data.approveReason,
        auditReason: data.auditReason,
        approveDate: data.approveDate
          ? dayjs(data.approveDate).format(formatDateTime)
          : '',
        otpReason: data.otpReason,
      });
    },
    onError: (err: CommonError) => {
      if (err?.errors?.length > 0) {
        form.setFields(
          err?.errors?.map((item: FieldErrorsType) => ({
            name: item.field !== 'isdn' ? item.field : 'phone',
            errors: [item.detail],
          }))
        );
      }
      setSuccessIsdn(false);
      form.resetFields([
        'cardFront',
        'cardBack',
        'portrait',
        'cardContract',
        'otpStatus',
        'videoCallStatus',
        'videoCallUser',
        'approveStatus',
        'assignUserName',
        'approveNumber',
        'approveReason',
        'approveNote',
        'approveDate',
        'auditStatus',
        'auditReason',
      ]);
      form.setFieldsValue({
        pkName: '',
        checkSimError: err?.detail,
      });
    },
  });
};
