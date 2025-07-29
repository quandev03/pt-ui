import { useMutation, useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import useActivateM2M from '../store';
import { CommonError } from '@react/commons/types';
import { FormInstance } from 'antd';
import dayjs from 'dayjs';
import { formatDateBe, formatDateEnglishV2, formatDateV2, formatDate } from '@react/constants/moment';

const fetcher = (id: string) => {
  return axiosClient.get<any>(
    `${prefixCustomerService}/authorized-person/detail`,
    {
      params: {
        id: id,
      },
    }
  );
};

export const useSubsDetail = (form: FormInstance) => {
  const { formAntd, dataPersonInfo, setDataActivateInfo } = useActivateM2M();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (data: any) => {
      setDataActivateInfo(data);
      console.log("ON SUCCESSS + dataa ", dataPersonInfo);
      formAntd.setFieldsValue({
        startDate: dayjs(data.startDate, formatDateEnglishV2).format(formatDate),
        endDate: dayjs(data.endDate, formatDateEnglishV2).format(formatDate),
        idType: data.idType,
        name: data.name,
        idNo: data.idNo,
        idIssueDate: dayjs(data.idIssueDate, formatDateEnglishV2).format(formatDate),
        idIssuePlace: data.idIssuePlace,
        birthday: dayjs(data.birthday, formatDateEnglishV2).format(formatDate),
        sex: data.sex,
        address: data.address,
        province: data.province,
        district: data.district,
        precinct: data.precinct,
        idExpiry: data.idExpiry ? dayjs(data.idExpiry, formatDateEnglishV2).format(formatDate) : '',
        idFrontPath: data.idFrontPath,
        idBackPath: data.idBackPath,
        portraitPath: data.portraitPath,
        authorizedFilePath: data.authorizedFilePath,
        idExpiryDateNote: data.idExpiryNote
      });
      console.log("ON SUCCESSS + dataa ", formAntd.getFieldsValue());
    },
    //   onError: (err: CommonError) => {

    //   },
  });
};
