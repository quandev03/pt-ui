import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import useConfigAppStore from '../../../Layouts/stores';

import {
  decodeSearchParams,
  formatQueryParams,
  usePermissions,
  FilterItemProps,
  CButtonExport,
} from '@vissoft-react/common';
import { ColumnsType } from 'antd/es/table';
import { useGetTableList } from '../../hooks/useGetTableList';
import { IReportPartnerItem, IReportPartnerParams } from '../../types';
import { useGetAllReportPartner } from '../../hooks';

export const useLogicListReport = () => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);

  const { menuData } = useConfigAppStore();
  const permission = usePermissions(menuData);
  const { data: listReportPartner, isLoading: loadingTable } =
    useGetAllReportPartner(formatQueryParams<IReportPartnerParams>(params));

  const columns: ColumnsType<IReportPartnerItem> = useGetTableList();

  const handleExport = useCallback(() => {
    console.log('handleExport called');
  }, []);

  const actionComponent = useMemo(() => {
    return (
      <div>
        {permission.canCreate && <CButtonExport onClick={handleExport} />}
      </div>
    );
  }, [handleExport, permission.canCreate]);

  const filters: FilterItemProps[] = useMemo(() => {
    return [
      {
        label: 'Trạng thái đơn hàng',
        type: 'Select',
        name: 'status',
        stateKey: 'status',
        showDefault: true,
        options: [],
        placeholder: 'Trạng thái đơn hàng',
      },
      {
        label: 'Loại dịch vụ',
        type: 'Select',
        name: 'serviceType',
        stateKey: 'serviceType',
        showDefault: true,
        options: [],
        placeholder: 'Loại dịch vụ',
      },

      {
        label: 'Ngày đặt hàng',
        formatSearch: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
        type: 'DateRange',
        name: 'orderedAt',
        keySearch: ['orderedAtFrom', 'orderedAtTo'],
        placeholder: ['Ngày bắt đầu', 'Ngày kết thúc'],
        showDefault: true,
        format: 'DD/MM/YYYY',
      },
    ];
  }, []);

  return {
    listReportPartner,
    loadingTable,
    columns,
    actionComponent,
    filters,
  };
};
