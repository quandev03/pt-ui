import { NotificationSuccess } from '@react/commons/index';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import dayjs from 'dayjs';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { CommonError } from '@react/commons/types';
import { groupBy } from 'lodash';
import useActivateM2M from '../store';
import { useGenContractNo } from './useGenContractNo';

export interface FilterConfirmOtp {
  isdn: string;
  idEkyc: string;
  id: string;
  otp: string;
  transactionId: string;
}

const fetcher = ({ files, form }: any) => {
  console.log('VÀO FETCHER ', form);

  const formData = new FormData();
  Object.keys(files).forEach((key: string) => {
    if (files[key]) {
      formData.append(key, files[key] as Blob);
    }
  });
  const details = JSON.stringify(
    {
      contractDate: dayjs(form.contractDate).format('DD/MM/YYYY'),
      enterpriseId: form.enterpriseId,
      startDate: form.startDate !== ' ' ? form.startDate : null,
      endDate: form.endDate !== ' ' ? form.endDate : null,
      contractSignerType: form.contractSignerType,
      contractNoM2M: form.contractNoM2M,
      authorizedFilePath: form.authorizedFilePath,
      subType: form.subType,
      deviceName: form.deviceName,
      frontFilePath: form.idFrontPath,
      backFilePath: form.idBackPath,
      portraitFilePath: form.portraitPath,
      activeNote: form.note,
      enterpriseName: form.enterpriseName,
      userEnterpriseId:
        form.contractSignerType === 1
          ? form.responsiblePerson
          : form.supervisorId,
      idExpiryDate: form.idExpiry,
      idExpiryDateNote: form.idExpiryDateNote,
      strUserSubName: form.name,
      strUserBirthday: form.birthday,
      strUserSex: form.sex,
      strUserAddress: form.address,
      idType: form.idType,
      strUserIdOrPpNo: form.idNo,
      strUserIdOrPpIssueDate: form.idIssueDate,
      strUserIdOrPpIssuePlace: form.idIssuePlace,
      strUserProvince: form.province,
      strUserDistrict: form.district,
      strUserPrecinct: form.precinct,
    },
    null,
    2
  );

  formData.append('data', details);

  return axiosClient.post<any>(
    `${prefixCustomerService}/active-m2m`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data ',
      },
    }
  );
};

export const useActivate = () => {
  const { formAntd, resetGroupStore, setIsGenCode } = useActivateM2M();
  const { mutate: genContractNo } = useGenContractNo();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: () => {
      NotificationSuccess(
        'Hệ thống đang xử lý kích hoạt cho thuê bao. Vui lòng theo dõi trạng thái và kết quả tại màn hình Báo cáo tác động thuê bao theo file KH doanh nghiệp'
      );
      formAntd.resetFields();
      resetGroupStore();
      genContractNo();
      setIsGenCode(false);
      formAntd.setFieldValue({ contractDate: dayjs() });
    },
    onError: (err: CommonError) => {
      if (err?.errors?.length > 0) {
        const newObj = groupBy(err?.errors, 'field');
        const res = Object.entries(newObj).map(([field, obj]) => ({
          field,
          detail: obj?.map((item) => item.detail),
        }));
        formAntd.setFields(
          res?.map((item: any) => ({
            name: item.field,
            errors: item.detail,
          }))
        );
      }
    },
  });
};
