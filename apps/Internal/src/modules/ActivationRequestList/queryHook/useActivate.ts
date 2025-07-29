import { NotificationSuccess } from '@react/commons/index';
import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import dayjs from 'dayjs';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { useNavigate } from 'react-router-dom';
import { CommonError, FieldErrorsType } from '@react/commons/types';
import { FormInstance } from 'antd';

export interface FilterConfirmOtp {
  isdn: string;
  idEkyc: string;
  id: string;
  otp: string;
  transactionId: string;
}

const fetcher = ({ id, files, form }: any) => {
  const formData = new FormData();
  if (files) {
    Object.keys(files).forEach((key: string) => {
      if (files[key]) {
        console.log(files[key]);
        formData.append(key, files[key] as Blob);
      }
    });
  }
  const details = JSON.stringify(
    {
      request: {
        strSex: form.sex,
        strSubName: form.name,
        strIdNo: form.id,
        strIdIssueDate: dayjs(form.issue_date, 'DD-MM-YYYY').format(
          'DD/MM/YYYY'
        ),
        strIdIssuePlace: form.issue_by,
        strBirthday: dayjs(form.birthday, 'DD-MM-YYYY').format('DD/MM/YYYY'),
        strProvince: form.city,
        strDistrict: form.district,
        strPrecinct: form.ward,
        strHome: form.address,
        strAddress: form.address,
        strContractNo: form.contractNo,
        strIsdn: form.phone,
        strSerial: form.serialSim,
      },
      idExpiryDateNote: form.idExpireDateNote,
      idExpiryDate: dayjs(form.expiry, 'YYYY-MM-DD').format('DD/MM/YYYY'),
      idType: form.document,
      idEkyc: form.id_ekyc,
      customerCode: form.customerCode,
      contractDate: dayjs().format('DD/MM/YYYY'),
      decree13Accept: form.codeDecree13?.toString(),
    },
    null,
    2
  );

  formData.append('data', details);
  formData.append('contractNo', form.contractNo);
  return axiosClient.put<any>(
    `${prefixCustomerService}/subscriber-request` + `/${id}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data ',
      },
    }
  );
};

export const useActivate = (form: FormInstance) => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: () => {
      NotificationSuccess('Chỉnh sửa yêu cầu kích hoạt thành công!');
      navigate(-1);
    },
    onError: (err: CommonError) => {
      if (err?.errors?.length > 0) {
        form?.setFields(
          err?.errors?.map((item: FieldErrorsType) => ({
            name: item.field,
            errors: [item.detail],
          }))
        );
      }
    },
  });
};
