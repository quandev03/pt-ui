import { useMutation } from '@tanstack/react-query';
import { UploadFile } from 'antd';
import { axiosClient } from 'apps/Internal/src/service';
import useStoreListOfRequestsChangeSim from '../store';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import dayjs from 'dayjs';
import { DateFormat } from '@react/constants/app';
import {
  NotificationError,
  NotificationSuccess,
} from '@react/commons/Notification';
import { IDType } from 'apps/Internal/src/modules/BusinessManagement/components/FormView/EnterpriseRepresentatives/type';
export interface Req {
  front: UploadFile;
  back: UploadFile;
  portrait: UploadFile;
}

interface Res {
  data: any;
}

const fetcher = (files: any) => {
  const formData = new FormData();
  Object.keys(files).forEach((key: string) => {
    if (files[key]) {
      console.log(files[key]);
      formData.append(key, files[key] as Blob);
    }
  });
  return axiosClient.post<Req, Res>(
    `${prefixCustomerService}/enterprise/ocr?cardType=1`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
};

export const useCallOcr = () => {
  const { formAntd } = useStoreListOfRequestsChangeSim();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (data: any) => {
      if (data?.c06_errors) {
        NotificationError(data?.c06_errors);
        formAntd.setFieldsValue({
          isDisableButtonCheck: false,
        });
      } else {
        formAntd.setFieldsValue({
          isDisableButtonCheck: true,
        });
      }

      if (data?.c06SuccessMessage) {
        NotificationSuccess(data?.c06SuccessMessage);
        formAntd.setFieldsValue({
          isDisableButtonCheck: true,
        });
      }
      if (data.documentType === IDType.CMND) {
        NotificationError(
          'Từ ngày 01/01/2025 không thể thêm mới với Giấy tờ tuỳ thân là Chứng minh nhân dân (9 số và 12 số)'
        );
      }
      formAntd.setFieldsValue({
        representativeIdNumber: data.id,
        representativeIdIssueDate: data.issueDate
          ? dayjs(data.issueDate, DateFormat.DEFAULT_V4)
          : undefined,
        representativeGender: data.sex,
        representativeNationality: data.nationality,
        representativeIdType: data.documentType,
        representativeName: data.name,
        representativeBirthDate: data.birthday
          ? dayjs(data.birthday, DateFormat.DEFAULT_V4)
          : undefined,
        representativePermanentAddress: data.address,
        representativeIdIssuePlace: data.issueBy,
        idEkyc: data.idEkyc,
        representativeProvince: data.city,
        representativeDistrict: data.district,
        representativePrecinct: data.ward,
        idExpiryDate: data.expiry
          ? dayjs(data.expiry, DateFormat.DEFAULT_V4)
          : undefined,
      });
    },
  });
};
