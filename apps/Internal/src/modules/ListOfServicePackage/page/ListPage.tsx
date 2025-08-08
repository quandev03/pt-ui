import {
  AnyElement,
  CButtonAdd,
  decodeSearchParams,
  formatQueryParams,
  LayoutList,
} from '@vissoft-react/common';
import { useTable } from '../hook/useTable';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useList } from '../hook';
import { IListOfServicePackage } from '../types';
import { useCallback, useMemo } from 'react';
import { pathRoutes } from 'apps/Internal/src/routers';
import { useFilters } from '../hook/useFilters';
import { useDelete } from '../hook/useDelete';

export const ListPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { data, isPending } = useList(
    formatQueryParams<IListOfServicePackage>(params)
  );
  const actionComponent = useMemo(() => {
    return (
      <CButtonAdd
        onClick={() => navigate(pathRoutes.listOfServicePackageAdd)}
      />
    );
  }, [navigate]);
  const filters = useFilters();
  const handleView = useCallback(
    (id: string) => {
      navigate(pathRoutes.listOfServicePackageView(id));
    },
    [navigate]
  );
  const handleEdit = useCallback(
    (id: string) => {
      navigate(pathRoutes.listOfServicePackageEdit(id));
    },
    [navigate]
  );

  const { columns } = useTable({
    handleView,
    handleEdit,
  });
  return (
    <>
      <LayoutList
        data={data as AnyElement}
        actionComponent={actionComponent}
        columns={columns}
        title="Danh mục gói cước"
        filterItems={filters}
        loading={isPending}
        searchComponent={
          <LayoutList.SearchComponent
            name="pckCodeOrPckName"
            tooltip="Nhập mã hoặc tên gói cước để tìm kiếm"
            placeholder="Nhập mã hoặc tên gói cước để tìm kiếm"
          />
        }
      />
    </>
  );
};
