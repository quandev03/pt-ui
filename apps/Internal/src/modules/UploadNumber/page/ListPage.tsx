import {
  CButtonAdd,
  decodeSearchParams,
  formatQueryParams,
  LayoutList,
  usePermissions,
} from '@vissoft-react/common';
import { pathRoutes } from 'apps/Internal/src/routers';
import { useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useConfigAppStore from '../../Layouts/stores';
import { useColumnTable } from '../hook/useColumnTable';
import { useFilters } from '../hook/useFilters';
import useGetListUploadNumber from '../hook/useGetListUploadNumber';
import { IParamsRequestUploadDigitalResources } from '../types';

export const ListPage = () => {
  const navigate = useNavigate();
  const handleAdd = useCallback(() => {
    navigate(pathRoutes.uploadNumberAdd);
  }, [navigate]);
  const { menuData } = useConfigAppStore();
  const permission = usePermissions(menuData);
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { data, isPending } = useGetListUploadNumber(
    formatQueryParams<IParamsRequestUploadDigitalResources>(params)
  );
  const actionComponent = useMemo(() => {
    return (
      <div>{permission.canCreate && <CButtonAdd onClick={handleAdd} />}</div>
    );
  }, [permission]);
  const filters = useFilters();
  const { columns } = useColumnTable();
  return (
    <>
      <LayoutList
        data={data}
        actionComponent={actionComponent}
        columns={columns}
        title="Danh sách upload tài nguyên số"
        filterItems={filters}
        loading={isPending}
      />
    </>
  );
};
