import { IPage } from '@react/commons/types';
import { formatDateEnglishV2 } from '@react/constants/moment';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from 'apps/Internal/src/service';
import dayjs from 'dayjs';
import urlPromotionProgramBusiness from '../services/url';
import {
  IItemPromotionProgram,
  IPraramsPromotionProgramBusiness,
} from '../types';
export const queryKeyList = 'GET_LIST_PROMOTION_PROGRAM_BUSINESS';
const fetcher = async (data: IPraramsPromotionProgramBusiness) => {
  const params = {
    q: data.q,
    page: data.page,
    size: data.size,
    status: data.status,
    dateType: data.dateType ? data.dateType : 'createdDate',
    fromDate: data.fromDate
      ? dayjs(data.fromDate).startOf('day').format(formatDateEnglishV2)
      : dayjs().subtract(29, 'day').startOf('day').format(formatDateEnglishV2),
    toDate: data.toDate
      ? dayjs(data.toDate).endOf('day').format(formatDateEnglishV2)
      : dayjs().endOf('day').format(formatDateEnglishV2),
    programService: data.programService,
    promotionType: data.promotionType,
  };
  const res = await axiosClient.get<
    IItemPromotionProgram,
    IPage<IItemPromotionProgram>
  >(`${urlPromotionProgramBusiness}`, { params });
  return res;
};
const useList = (data: IPraramsPromotionProgramBusiness) => {
  return useQuery({
    queryKey: [queryKeyList, data],
    queryFn: () => fetcher(data),
    select: (data) => data,
  });
};
export default useList;
