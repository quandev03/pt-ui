import { useMutation } from '@tanstack/react-query';
import { UploadFile } from 'antd';
import { axiosClient } from 'apps/Internal/src/service';
import useStoreListOfRequestsChangeSim from '../store';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import { useVerifyDataOcr } from './useVerifyDataOcr';
import dayjs from 'dayjs';
import { DateFormat } from '@react/constants/app';
import { DocumentTypeEnum } from '../types';
import { NotificationError } from '@react/commons/Notification';
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
    `${prefixCustomerService}/call-ocr-and-face-check?cardType=1`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
};

export const useCallOcr = () => {
  const { formAntd, changeSimCode, setDocumentType } = useStoreListOfRequestsChangeSim();
  const { mutate: mutateVerifyDataOcr } = useVerifyDataOcr();

  return useMutation({
    mutationFn: fetcher,
    onSuccess: (data: any) => {
      setDocumentType(data.documentType);
      if (data.documentType === DocumentTypeEnum.CCCD) {
        mutateVerifyDataOcr({
          ocrData: { ...data, birthDate: data.birthday, idNo: data.id },
          changeSimCode,
        });
        formAntd.setFieldsValue({
          id: data.id,
          issueDate: data.issueDate
            ? dayjs(data.issueDate, DateFormat.DEFAULT_V4).format(
                DateFormat.DEFAULT
              )
            : '',
          sex: data.sex,
          nationality: data.nationality,
          documentType: data.documentType,
          issueBy: data.issueBy,
          name: data.name,
          birthday: data.birthday
            ? dayjs(data.birthday, DateFormat.DEFAULT_V4).format(
                DateFormat.DEFAULT
              )
            : '',
          address: data.address,
          ccdvvt: data.providerAreaCode,
          idEkyc: data.idEkyc,
        });
      }
      else {
        NotificationError("Từ ngày 01/01/2025 không thể đổi sim với Giấy tờ tuỳ thân là Chứng minh nhân dân (9 số và 12 số)");
      }
    },
  });
};
