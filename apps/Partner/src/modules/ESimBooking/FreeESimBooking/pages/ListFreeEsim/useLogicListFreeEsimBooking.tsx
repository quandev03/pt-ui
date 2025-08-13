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
import dayjs from 'dayjs';

export const useLogicListFreeEsimBooking = () => {
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

  const { data: listFreeEsimBooked, isLoading: loadingEsimList } =
    useGetListFreeEsimBooking(formatQueryParams<IParamsRequest>(params));

  const columns: ColumnsType<IFreeEsimBooking> = useGetTableFreeEsimBooking();

  const filters: FilterItemProps[] = useMemo(() => {
    const today = dayjs().endOf('day');
    const startDate = today.subtract(29, 'day').startOf('day');

    return [
      {
        type: 'Select',
        name: 'services',
        label: 'Loại dịch vụ',
        placeholder: 'Loại dịch vụ',
        options: [],
      },
      {
        type: 'DateRange',
        name: 'createdBy',
        label: 'Thời gian tạo',
        keySearch: ['from', 'to'],
        formatSearch: 'YYYY-MM-DD',
        placeholder: ['Từ ngày', 'Đến ngày'],
        defaultValue: [startDate, today],
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
