import {
  CButtonExport,
  decodeSearchParams,
  FilterItemProps,
  formatQueryParams,
  usePermissions,
} from '@vissoft-react/common';
import { useExportReport } from '../../hooks/useExportReport';
import dayjs from 'dayjs';
import { useCallback, useMemo } from 'react';
import { IPartnerOrderReport, IPartnerParams } from '../../type';
import { useTableListPartnerOrder } from '../../hooks/useTableListPartnerOrder';
import { ColumnsType } from 'antd/es/table';
import { useListPartnerOrder } from '../../hooks/useListPartnerOrder';
import { useSearchParams } from 'react-router-dom';
import { useGetAgencyOptions } from '../../../../hooks/useGetAgencyOptions';
import useConfigAppStore from '../../../Layouts/stores';

export const useLogicListPartnerOrder = () => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { data: agencyOptions = [] } = useGetAgencyOptions();
  const { menuData } = useConfigAppStore();
  const permission = usePermissions(menuData);

  const { mutate: exportReport, isPending: isExporting } = useExportReport();

  const { data: listPartnerOrderReport, isLoading: loadingList } =
    useListPartnerOrder(formatQueryParams<IPartnerParams>(params));
  const columns: ColumnsType<IPartnerOrderReport> = useTableListPartnerOrder();

  const handleExport = useCallback(() => {
    exportReport({
      ...params,
      fileFormat: 'xlsx',
    });
  }, [exportReport, params]);

  const exportComponent = useMemo(() => {
    return (
      <div>
        {permission.canCreate && (
          <CButtonExport onClick={handleExport} loading={isExporting} />
        )}
      </div>
    );
  }, [handleExport, permission.canCreate, isExporting]);

  const filters: FilterItemProps[] = useMemo(() => {
    const today = dayjs().endOf('day');
    const startDate = today.subtract(29, 'day').startOf('day');
    return [
      {
        type: 'TreeSelect',
        name: 'orgCode',
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
