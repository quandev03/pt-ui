import {
  CButtonExport,
  decodeSearchParams,
  FilterItemProps,
  formatQueryParams,
  IParamsRequest,
  usePermissions,
} from '@vissoft-react/common';
import { useGetAgencyOptions } from '../../../../hooks/useGetAgencyOptions';
import dayjs from 'dayjs';
import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import useConfigAppStore from '../../../Layouts/stores';
import { useTableListPartnerOrder } from '../../hooks/useTableListPartnerOrder';
import { ColumnsType } from 'antd/es/table';
import { IPartnerOrderReport } from '../../type';
import { useListPartnerOrder } from '../../hooks/useListPartnerOrder';
import { useExportReport } from '../../hooks/useExportReport';

export const useLogicListPartnerOrder = () => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { data: agencyOptions = [] } = useGetAgencyOptions();
  const { menuData } = useConfigAppStore();
  const permission = usePermissions(menuData);
  const { mutate: exportReport } = useExportReport();

  const { data: listPartnerOrderReport, isLoading: loadingList } =
    useListPartnerOrder(formatQueryParams<IParamsRequest>(params));

  const handleExport = useCallback(
    (type: string) => () => {
      exportReport({
        ...params,
        page: undefined,
        size: undefined,
        fileFormat: type,
      });
    },
    [exportReport, params]
  );

  const columns: ColumnsType<IPartnerOrderReport> = useTableListPartnerOrder();
  const exportComponent = useMemo(() => {
    return (
      <div>
        {permission.canCreate && <CButtonExport onClick={handleExport} />}
      </div>
    );
  }, [handleExport, permission.canCreate]);

  const filters: FilterItemProps[] = useMemo(() => {
    const today = dayjs().endOf('day');
    const startDate = today.subtract(29, 'day').startOf('day');
    return [
      {
        type: 'TreeSelect',
        name: 'agency',
        label: 'Đại lý',
        placeholder: 'Đại lý',
        treeData: agencyOptions,
      },
      {
        type: 'DateRange',
        name: 'dateRange',
        label: 'Thời gian tạo',
        keySearch: ['startDate', 'endDate'],
        formatSearch: 'YYYY-MM-DD',
        placeholder: ['Từ ngày', 'Đến ngày'],
        defaultValue: [startDate, today],
      },
    ];
  }, [agencyOptions]);

  return {
    filters,
    exportComponent,
    columns,
    listPartnerOrderReport,
    loadingList,
  };
};
