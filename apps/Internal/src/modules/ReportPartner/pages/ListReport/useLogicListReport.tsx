import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import useConfigAppStore from '../../../Layouts/stores';

import {
  CButtonExport,
  decodeSearchParams,
  FilterItemProps,
  formatQueryParams,
  usePermissions,
} from '@vissoft-react/common';
import { ColumnsType } from 'antd/es/table';
import { useExportFile } from 'apps/Internal/src/hooks/useExportFile';
import { useGetAllOrganizationUnit } from 'apps/Internal/src/hooks/useGetAllPartners';
import { useGetAllReportPartner } from '../../hooks';
import { useGetTableList } from '../../hooks/useGetTableList';
import { IReportPartnerItem, IReportPartnerParams } from '../../types';
import { prefixSaleService } from 'apps/Internal/src/constants';

export const useLogicListReport = () => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);

  const { menuData } = useConfigAppStore();
  const permission = usePermissions(menuData);
  const { data: listReportPartner, isLoading: loadingTable } =
    useGetAllReportPartner(formatQueryParams<IReportPartnerParams>(params));
  const { data: agencyOptions = [] } = useGetAllOrganizationUnit();
  const columns: ColumnsType<IReportPartnerItem> = useGetTableList();
  const { mutate: exportFile } = useExportFile();
  const handleExport = useCallback(() => {
    const { page, size, ...rest } = params;
    console.log('params', params, 'searchParams', searchParams);
    exportFile({
      params: formatQueryParams(rest),
      url: `${prefixSaleService}/api/orders-report`,
      filename: `Bao_cao_don_hang_doi_tac.xlsx`,
    });
  }, [params]);

  const actionComponent = useMemo(() => {
    return (
      <div>
        {permission.canRead && <CButtonExport onClick={handleExport} />}
      </div>
    );
  }, [handleExport, permission.canRead]);

  const filters: FilterItemProps[] = useMemo(() => {
    return [
      {
        label: 'Đối tác',
        type: 'TreeSelect',
        name: 'orgId',
        treeData: agencyOptions,
        showSearch: true,
        placeholder: 'Đối tác',
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
