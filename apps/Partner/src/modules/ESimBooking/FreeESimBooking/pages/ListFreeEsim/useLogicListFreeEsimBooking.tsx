import {
  CButtonAdd,
  decodeSearchParams,
  FilterItemProps,
  formatQueryParams,
  IParamsRequest,
  usePermissions,
} from '@vissoft-react/common';
import { pathRoutes } from '../../../../../routers/url';
import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import useConfigAppStore from '../../../../Layouts/stores';
import { IFreeEsimBooking } from '../../types';
import { ColumnsType } from 'antd/es/table';
import { useGetTableFreeEsimBooking } from '../../hooks/useGetTableFreeEsimBooking';
import { useGetListFreeEsimBooking } from '../../hooks/useGetListFreeEsimBooking';
import { Dropdown } from 'antd';

export const useLogicListFreeEsimBooking = () => {
  const { menuData } = useConfigAppStore();
  const permission = usePermissions(menuData);
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);

  const actionComponent = useMemo(() => {
    const dropdownItems = [
      {
        key: '1',
        label: (
          <Link to={pathRoutes.freeEsimBookingAdd}>Book eSIM miễn phí</Link>
        ),
      },
      {
        key: '2',
        label: (
          <Link to={pathRoutes.buyBundleWithEsimAdd}>Book eSIM kèm gói</Link>
        ),
      },
    ];
    return (
      <div>
        {permission.canCreate && (
          <Dropdown trigger={['click']} menu={{ items: dropdownItems }}>
            <CButtonAdd />
          </Dropdown>
        )}
      </div>
    );
  }, [permission.canCreate]);

  const { data: listFreeEsimBooked, isLoading: loadingEsimList } =
    useGetListFreeEsimBooking(formatQueryParams<IParamsRequest>(params));

  const columns: ColumnsType<IFreeEsimBooking> = useGetTableFreeEsimBooking();

  const filters: FilterItemProps[] = useMemo(() => {
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
