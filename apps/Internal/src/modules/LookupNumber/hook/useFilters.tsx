import {
  FilterItemProps,
  IParamsRequest,
  StatusEnum,
} from '@vissoft-react/common';
import { useGetAllOrg } from './useGetAllOrg';
import { useCallback, useEffect, useState } from 'react';
import { debounce } from 'lodash';

export const useFilters = (): FilterItemProps[] => {
  const [params, setParams] = useState<IParamsRequest>({
    page: 0,
    size: 20,
    q: '',
  });
  const {
    data: orgPartners = [],
    fetchNextPage: orgPartnerstFetchNextPage,
    hasNextPage: orgPartnersHasNextPage,
  } = useGetAllOrg(params);
  const handleSearch = debounce((value: string) => {
    setParams({
      ...params,
      q: value,
      page: 0,
    });
  }, 500);
  const handleScrollDatasets = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const target = event.target as HTMLDivElement;
      if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
        if (orgPartnersHasNextPage) {
          orgPartnerstFetchNextPage();
        }
      }
    },
    [orgPartnerstFetchNextPage, orgPartnersHasNextPage]
  );
  useEffect(() => {
    if (orgPartners.length > 0) {
      setParams({ ...params, page: orgPartners.length });
    }
  }, [orgPartners]);
  return [
    {
      name: 'status',
      label: 'Trạng thái',
      type: 'Select',
      placeholder: 'Chọn trạng thái',
      options: [
        {
          label: 'Hoạt động',
          value: String(StatusEnum.ACTIVE),
        },
        {
          label: 'Không hoạt động',
          value: String(StatusEnum.INACTIVE),
        },
      ],
    },
    {
      name: 'orgCode',
      label: 'Đại lý',
      type: 'Select',
      placeholder: 'Chọn đại lý',
      options: orgPartners,
      onPopupScroll: handleScrollDatasets,
      onSearch: handleSearch,
    },
  ];
};
