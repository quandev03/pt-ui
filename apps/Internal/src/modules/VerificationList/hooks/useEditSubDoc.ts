import { NotificationSuccess } from '@react/commons/Notification';
import { IErrorResponse } from '@react/commons/types';
import { useMutation } from '@tanstack/react-query';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import useCensorshipStore from '../store';

const fetcher = ({ files, form, id, idEkyc = '', contractUploadType }: any) => {
  const formData = new FormData();
  Object.keys(files).forEach((key: string) => {
    if (files[key]) {
      formData.append(key, files[key] as Blob);
    }
  });
  const details = JSON.stringify({
    contractNo: form.contractNo,
    isdn: form.phoneNumber + '',
    sex: form.sex,
    nationality: 'VNM',
    name: form.name,
    id: form.id,
    issue_date: dayjs(form.issue_date, 'DD-MM-YYYY').format('DD/MM/YYYY'),
    issue_by: form.issue_by,
    birthday: dayjs(form.birthday, 'DD-MM-YYYY').format('DD/MM/YYYY'),
    city: form.city,
    district: form.district,
    ward: form.ward,
    address: form.address,
    expiry: form.expiry
      ? dayjs(form.expiry, 'YYYY-MM-DD').format('DD/MM/YYYY')
      : null,
    otpStatus: form.otpStatus,
    videoCallStatus: form.videoCallStatus,
    videoCallUser: form.videoCallUser,
    approveStatus: form.approveStatus,
    assignUserName: form.assignUserName,
    approveNumber: form.approveNumber,
    approveRejectReasonCode: form.approveRejectReasonCode,
    approveNote: form.approveNote,
    approveDate: form.approveDate,
    auditStatus: form.auditStatus,
    auditRejectReasonCode: form.auditRejectReasonCode,
    document: form.document,
    serialSim: form.serialSim,
    ...(idEkyc && { idEkyc: idEkyc }),
    providerAreaCode: form.ccdvvt,
    packagePlan: form.packagePlan,
    uploadDocumentDate: form.uploadDocumentDate,
    idExpireDateNote: form.idExpireDateNote,
    createdContractDate: form.createdContractDate,
    uploadContractType: Number(contractUploadType)
  });

  formData.append('data', details);

  return axiosClient.put<any>(
    `${prefixCustomerService}/update-require-subdocument/${id}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data ',
      },
    }
  );
};
export const useEditSubDoc = (setIsShowSignLink?: (value: boolean) => void) => {
  const navigate = useNavigate();
  const { resetGroupStore, formAntd, setCriteriaErrList, setIsDisableSync } =
    useCensorshipStore();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: () => {
      NotificationSuccess('Cập nhật thành công');
      resetGroupStore();
      formAntd.resetFields();
      navigate(-1);
    },
    onError: (err: IErrorResponse) => {
      setCriteriaErrList(err.errors || []);
      if (err.code === 'CUS00116') {
        setIsDisableSync(false);
      }
      else if (
        ['CUS24012', 'CUS04042431', 'CUS04042432', 'CUS00124'].includes(err.code ?? '')
      ) {
        setIsShowSignLink?.(true); // safer call
      }
    },
  });
};
