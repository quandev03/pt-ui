import { prefixCatalogServicePublic } from '@react/url/app';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { REACT_QUERY_KEYS } from '../constants/querykeys';
import { axiosClient } from '../service';

export enum ReasonCodeEnum {
  NPP_CREATE_ORDER = 'NPP_CREATE_ORDER',
}

interface IReasonResponse {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  reasonId: number;
  reasonTypeId: number;
  reasonCode: string;
  reasonTypeCode: ReasonCodeEnum;
  reasonName: string;
  status: number;
  description: string | null;
}

type Params = {
  reasonTypeCode: ReasonCodeEnum;
  status?: 0 | 1;
};

const fetcher = async (params: Params) => {
  const res = await axiosClient.get<string, IReasonResponse[]>(
    `${prefixCatalogServicePublic}/reason/search-by-reason-code`,
    { params }
  );
  if (!res) throw new Error('Oops');
  return res;
};

export const useReasonCatalogService = (
  enabled = true,
  code: ReasonCodeEnum
) => {
  return useQuery({
    queryKey: [REACT_QUERY_KEYS.GET_ALL_REASON_CATALOG_SERVICE, code],
    queryFn: () => fetcher({ reasonTypeCode: code }),
    staleTime: Infinity,
    enabled,
  });
};

export const useListReasonCatalogService = (
  isViewMode: boolean,
  reasonId: number | string,
  code: ReasonCodeEnum
) => {
  const { data: reasonList = [] } = useReasonCatalogService(true, code);

  const optionReason = useMemo(() => {
    if (isViewMode) {
      const reason = reasonList.find((item) => item.reasonId == reasonId);
      return reason
        ? [
            {
              label: `${reason.reasonCode}_${reason.reasonName} ${
                reason.status ? '' : '(Ngưng hoạt động)'
              }`,
              value: reason.reasonId,
            },
          ]
        : [];
    }
    const filteredReasons = reasonList.filter((item) => item.status);
    return filteredReasons.map((item) => ({
      label: `${item.reasonCode}_${item.reasonName}`,
      value: item.reasonId,
    }));
  }, [reasonList, isViewMode, reasonId]);

  return optionReason;
};
