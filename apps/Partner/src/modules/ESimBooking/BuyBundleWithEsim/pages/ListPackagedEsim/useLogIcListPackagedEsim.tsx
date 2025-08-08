import {
  CButtonAdd,
  decodeSearchParams,
  FilterItemProps,
  formatQueryParams,
  usePermissions,
} from '@vissoft-react/common';
import { pathRoutes } from '../../../../../routers/url';
import { useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useConfigAppStore from '../../../../Layouts/stores';
import { ColumnsType } from 'antd/es/table';
import { IPackagedEsimBooking } from '../../types';
import { useTablePackagedEsimBooking } from '../../hooks/useTablePackagedEsim';
import { useGetListPackagedsimBooking } from '../../hooks/useGetListFreeEsimBooking';

export const useLogicListPackagedEsimBooking = () => {
  const navigate = useNavigate();
  const { menuData } = useConfigAppStore();
  const permission = usePermissions(menuData);
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);

  const handleAdd = useCallback(() => {
    navigate(pathRoutes.buyBundleWithEsimAdd);
  }, [navigate]);

  const actionComponent = useMemo(() => {
    return (
      <div> {permission.canCreate && <CButtonAdd onClick={handleAdd} />}</div>
    );
  }, [handleAdd, permission.canCreate]);

  const { data: listPackagedEsimBooked, isLoading: loadingEsimList } =
    useGetListPackagedsimBooking(params);

  const columns: ColumnsType<IPackagedEsimBooking> =
    useTablePackagedEsimBooking();

  const filters: FilterItemProps[] = useMemo(() => {
    return [
      {
        type: 'DateRange',
        name: 'orderDate',
        label: 'Ngày đặt hàng',
        keySearch: ['from', 'to'],
        formatSearch: 'YYYY-MM-DD',
        placeholder: ['Từ ngày', 'Đến ngày'],
      },
    ];
  }, []);
  return {
    filters,
    actionComponent,
    columns,
    listPackagedEsimBooked,
    loadingEsimList,
  };
};
