import { useMutation } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import useActivateM2M from '../store';
import { FormInstance } from 'antd';
import dayjs from 'dayjs';
import {
  formatDateEnglishV2,
  formatDate,
} from '@react/constants/moment';

const fetcher = (id: string) => {
  return axiosClient.get<any>(
    `${prefixCustomerService}/enterprise/get-represent/${id}`, {
        params: {
            id: id
        }
    }
  );
};

export const useSuperDetail = () => {
  const { formAntd, dataPersonInfo, setDataActivateInfo } = useActivateM2M();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (data: any) => {
      setDataActivateInfo(data);
      console.log('ON SUCCESSS + dataa ', dataPersonInfo);
      formAntd.setFieldsValue({
        startDate: data.startDate ? dayjs(data.startDate, formatDateEnglishV2).format(
          formatDate
        ) : " ",
        endDate: data.endDate ? dayjs(data.endDate, formatDateEnglishV2).format(formatDate) : " ",
        idType: data.idType,
        name: data.name,
        idNo: data.idNo,
        idIssueDate: dayjs(data.idIssueDate, formatDateEnglishV2).format(
          formatDate
        ),
        idIssuePlace: data.idIssuePlace,
        birthday: dayjs(data.birthDate, formatDateEnglishV2).format(formatDate),
        sex: data.sex,
        address: data.permanentAddress,
        province: data.province,
        district: data.district,
        precinct: data.precinct,
        idExpiry: data.idExpireDate ? dayjs(data.idExpireDate, formatDateEnglishV2).format(formatDate) : " ",
        idFrontPath: data.idFront,
        idBackPath: data.idBack,
        portraitPath: data.portrait,
        authorizedFilePath: data.authorizedFilePath,
        idExpiryDateNote: data.idExpiryDateNote
      });
      console.log('ON SUCCESSS + dataa ', formAntd.getFieldsValue());
    },
    //   onError: (err: CommonError) => {

    //   },
  });
};
