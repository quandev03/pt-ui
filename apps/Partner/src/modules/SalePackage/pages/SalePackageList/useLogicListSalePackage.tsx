import {
  CButtonAdd,
  FilterItemProps,
  decodeSearchParams,
  formatDateBe,
  formatQueryParams,
  usePermissions,
} from '@vissoft-react/common';
import { ColumnsType } from 'antd/es/table';
import { useCallback, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { pathRoutes } from '../../../../routers';
import useConfigAppStore from '../../../Layouts/stores';
import { useGetTableList } from '../../hooks/useGetTableList';
import { IPackageSaleItem, IPackageSaleParams } from '../../types';
import { useGetPackageSales } from '../../hooks';
import dayjs from 'dayjs';
import { Dropdown } from 'antd';

export const useLogicListSalePackage = () => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { menuData } = useConfigAppStore();
  const permission = usePermissions(menuData);
  const { data: listPackageSale, isLoading: loadingTable } = useGetPackageSales(
    formatQueryParams<IPackageSaleParams>(params)
  );

  const columns: ColumnsType<IPackageSaleItem> = useGetTableList();

  const actionComponent = useMemo(() => {
    const dropdownItems = [
      {
        key: '1',
        label: <Link to={pathRoutes.salePackageAddSingle}>Bán gói đơn lẻ</Link>,
      },
      {
        key: '2',
        label: <Link to={pathRoutes.salePackageAddBulk}>Bán gói theo lô</Link>,
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

  const filters: FilterItemProps[] = useMemo(() => {
    const today = dayjs().endOf('day');
    const startDate = today.subtract(29, 'day').startOf('day');
    return [
      {
        type: 'Select',
        name: 'agency',
        label: 'Hình thức bán gói',
        placeholder: 'Hình thức bán gói',
        options: [],
      },
      {
        type: 'DateRange',
        name: 'createdAt',
        label: 'Ngày tạo',
        keySearch: ['createdAtFrom', 'createdAtTo'],
        formatSearch: formatDateBe,
        placeholder: ['Ngày bắt đầu', 'Ngày kết thúc'],
        showDefault: true,
        format: 'DD/MM/YYYY',
        defaultValue: [startDate, today],
        disabledFutureDate: true,
      },
    ];
  }, []);

  return {
    listPackageSale,
    loadingTable,
    columns,
    actionComponent,
    filters,
  };
};
