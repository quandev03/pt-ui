import { axiosClient } from 'apps/Internal/src/service';
import { useMutation } from '@tanstack/react-query';
import { prefixCustomerService } from 'apps/Internal/src/constants/app';
import useStoreListOfRequestsChangeSim from '../store';
import dayjs from 'dayjs';
import { DateFormat } from '@react/constants/app';

const fetcher = async (id: string) => {
  return await axiosClient.get<any, any>(
    `${prefixCustomerService}/search-request/admin/${id}`
  );
};

export const useSearchRequestAdmin = () => {
  const { formAntd: form } = useStoreListOfRequestsChangeSim();
  return useMutation({
    mutationFn: fetcher,
    onSuccess: (res) => {
      form.setFieldsValue({
        documentType: res.idType,
        id: res.idNo,
        issueBy: res.idIssuePlace,
        issueDate: res.idIssueDate
          ? dayjs(res.idIssueDate, DateFormat.DATE_ISO).format(
              DateFormat.DEFAULT
            )
          : '',
        name: res.name,
        sex: res.sex,
        birthday: res.birthDate
          ? dayjs(res.birthDate, DateFormat.DATE_ISO).format(DateFormat.DEFAULT)
          : '',
        nationality: res.nationality,
      });
    },
  });
};
