import {
  AnyElement,
  CButtonExport,
  decodeSearchParams,
  formatQueryParams,
  LayoutList,
  usePermissions,
} from '@vissoft-react/common';
import { useList } from '../hook/useList';
import { useSearchParams } from 'react-router-dom';
import { IParameter, IResLookupNumber } from '../types';
import { useCallback, useMemo } from 'react';
import useConfigAppStore from '../../Layouts/stores';
import { useFilters } from '../hook/useFilters';
import { useColumns } from '../hook/useColumns';
import { useExport } from '../hook/useExport';

export const ListPage = () => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { data, isPending } = useList(formatQueryParams<IParameter>(params));
  const { menuData } = useConfigAppStore();
  const permission = usePermissions(menuData);
  const { mutate } = useExport();
  const handleExport = useCallback(
    (params: IParameter) => {
      mutate(params);
    },
    [mutate]
  );
  const actionComponent = useMemo(() => {
    return (
      <div>
        {permission.canCreate && (
          <CButtonExport onClick={() => handleExport(params)} />
        )}
      </div>
    );
  }, [permission]);
  const filters = useFilters();
  const columns = useColumns();
  return (
    <>
      <LayoutList
        data={data}
        actionComponent={actionComponent}
        columns={columns}
        title="Tra cứu số"
        filterItems={filters}
        loading={isPending}
        searchComponent={
          <LayoutList.SearchComponent
            name="q"
            tooltip="Nhập số để tìm kiếm"
            placeholder="Nhập số để tìm kiếm"
          />
        }
      />
    </>
  );
};
