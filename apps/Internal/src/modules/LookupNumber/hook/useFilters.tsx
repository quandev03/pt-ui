import { FilterItemProps, IParamsRequest } from '@vissoft-react/common';
import { debounce } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useConfigAppStore from '../../Layouts/stores';
import { useGetAllOrg } from './useGetAllOrg';

export const useFilters = (): { filters: FilterItemProps[] } => {
  const {
    params: { SUBSCRIBER_SUBS_STATUS },
  } = useConfigAppStore();
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
  const filters = useMemo(() => {
    return [
      {
        name: 'status',
        label: 'Trạng thái',
        type: 'Select',
        placeholder: 'Chọn trạng thái',
        options: SUBSCRIBER_SUBS_STATUS?.map((item) => {
          return {
            label: item.value as string,
            value: item.code as string,
          };
        }),
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
  }, [orgPartners, handleScrollDatasets, handleSearch]);
  return { filters: filters as FilterItemProps[] };
};
