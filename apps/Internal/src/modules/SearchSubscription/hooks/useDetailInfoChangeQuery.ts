import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEYS } from 'apps/Internal/src/constants/querykeys';
import { axiosClient } from 'apps/Internal/src/service';
import { InfoChange } from '../types';
import { prefixCustomerService } from '@react/url/app';
import { ModalType } from '../components/InformationChangeModal';

const fetcher = (id: string, historyId: string, type: ModalType) => {
  if (type === ModalType.censor) {
    return axiosClient.get<string, InfoChange>(
      `${prefixCustomerService}/search-request/change-infor-details/${id}?actionHistoryId=${historyId}`
    );
  }
  if (type === ModalType.changeInformation) {
    return axiosClient.get<string, InfoChange>(
      `${prefixCustomerService}/search-request/change-information/${id}?actionHistoryId=${historyId}`
    );
  }
  if (type === ModalType.ownershipTransfer) {
    return axiosClient.get<string, InfoChange>(
      `${prefixCustomerService}/search-request/ownership-transfer/${id}?actionHistoryId=${historyId}`
    );
  }
};

export const useDetailInfoChangeQuery = (
  id: string,
  historyId: string,
  type: ModalType
) => {
  return useQuery({
    queryFn: () => fetcher(id, historyId, type),
    queryKey: [REACT_QUERY_KEYS.GET_DETAIL_INFO_CHANGE, id, historyId, type],
    enabled: !!id && !!historyId,
  });
};
