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
import { IFreeEsimBooking } from '../../types';
import { ColumnsType } from 'antd/es/table';
import { useTableFreeEsimBooking } from '../../hooks/useESimFreeBookingListColumn';
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
    useGetListFreeEsimBooking(params);

  const columns: ColumnsType<IFreeEsimBooking> = useTableFreeEsimBooking();

  const filters: FilterItemProps[] = useMemo(() => {
    // You need to create objects that match the shape of your filter types.
    return [
      {
        type: 'Select',
        name: 'status', // A unique name for this filter field
        label: 'Trạng thái',
        placeholder: 'Chọn trạng thái đơn hàng',
        options: [
          { value: 'pending', label: 'Chờ xử lý' },
          { value: 'shipped', label: 'Đã giao hàng' },
          { value: 'completed', label: 'Hoàn thành' },
          { value: 'cancelled', label: 'Đã huỷ' },
        ],
      },

      {
        type: 'DateRange',
        name: 'orderDate', // A unique name for this filter field
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
