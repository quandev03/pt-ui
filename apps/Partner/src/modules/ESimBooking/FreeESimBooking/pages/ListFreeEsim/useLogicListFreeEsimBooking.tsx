import {
  CButtonAdd,
  decodeSearchParams,
  FilterItemProps,
  formatQueryParams,
  IParamsRequest,
  usePermissions,
} from '@vissoft-react/common';
import { pathRoutes } from '../../../../../routers/url';
import { useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useConfigAppStore from '../../../../Layouts/stores';
import { IFreeEsimBooking } from '../../types';
import { ColumnsType } from 'antd/es/table';
import { useGetTableFreeEsimBooking } from '../../hooks/useGetTableFreeEsimBooking';
import { useGetListFreeEsimBooking } from '../../hooks/useGetListFreeEsimBooking';

export const useLogicListFreeEsimBooking = () => {
  const navigate = useNavigate();
  const { menuData } = useConfigAppStore();
  const permission = usePermissions(menuData);
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);

  const handleAdd = useCallback(() => {
    navigate(pathRoutes.freeEsimBookingAdd);
  }, [navigate]);

  const actionComponent = useMemo(() => {
    return (
      <div> {permission.canCreate && <CButtonAdd onClick={handleAdd} />}</div>
    );
  }, [handleAdd, permission.canCreate]);

  const { data: listFreeEsimBooked, isLoading: loadingEsimList } =
    useGetListFreeEsimBooking(formatQueryParams<IParamsRequest>(params));

  const columns: ColumnsType<IFreeEsimBooking> = useGetTableFreeEsimBooking();

  const filters: FilterItemProps[] = useMemo(() => {
    return [
      {
        type: 'Select',
        name: 'agency',
        label: 'Đại lý',
        placeholder: 'Chọn đại lý',
        options: [],
      },

      {
        type: 'DateRange',
        name: 'orderDate',
        label: 'Ngày đặt hàng',
        keySearch: ['startDate', 'endDate'],
        formatSearch: 'YYYY-MM-DD',
        placeholder: ['Từ ngày', 'Đến ngày'],
      },
    ];
  }, []);
  return {
    filters,
    actionComponent,
    columns,
    listFreeEsimBooked,
    loadingEsimList,
  };
};
