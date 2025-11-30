import {
  CButtonAdd,
  FilterItemProps,
  decodeSearchParams,
  formatQueryParams,
  usePermissions,
} from '@vissoft-react/common';
import { ColumnsType } from 'antd/es/table';
import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { pathRoutes } from '../../../../routers';
import useConfigAppStore from '../../../Layouts/stores';
import { useGetTableList } from '../../hooks/useGetTableList';
import {
  IPackageSaleItem,
  IPackageSaleParams,
  ISelectOption,
} from '../../types';
import { useGetPackageSales } from '../../hooks';
import dayjs from 'dayjs';
import { Dropdown } from 'antd';
import { useGetSaleParams } from '../../hooks/useSaleParams';

export const useLogicListSalePackage = () => {
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const { menuData } = useConfigAppStore();
  const permission = usePermissions(menuData);
  const { data: listPackageSale, isLoading: loadingTable } = useGetPackageSales(
    formatQueryParams<IPackageSaleParams>(params)
  );

  const columns: ColumnsType<IPackageSaleItem> = useGetTableList();

  const { data: saleParams } = useGetSaleParams();

  const saleTypeOptions: ISelectOption[] = useMemo(() => {
    if (!saleParams?.BATCH_PACKAGE_SALE_TYPE) {
      return [];
    }
    return saleParams.BATCH_PACKAGE_SALE_TYPE.map((item) => ({
      value: item.code,
      label: item.value,
    }));
  }, [saleParams]);

  // Loại dịch vụ phòng (PACKAGE_SERVICE_ROOM)
  const packageServiceOptions: ISelectOption[] = useMemo(() => {
    if (!saleParams?.PACKAGE_SERVICE_ROOM) {
      return [];
    }
    // API trả về { code: 'BASIC' | 'PRO', value: 'id...' }
    // UI hiển thị code, backend nhận value (id)
    return saleParams.PACKAGE_SERVICE_ROOM.map((item) => ({
      value: item.value,
      label: item.code,
    }));
  }, [saleParams]);
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
        name: 'packageType',
        label: 'Loại dịch vụ',
        placeholder: 'Chọn loại dịch vụ',
        options: packageServiceOptions,
      },
      {
        type: 'Select',
        name: 'saleType',
        label: 'Hình thức bán gói',
        placeholder: 'Hình thức bán gói',
        options: saleTypeOptions,
      },
      {
        type: 'DateRange',
        name: 'createdAt',
        label: 'Ngày tạo',
        keySearch: ['fromDate', 'toDate'],
        formatSearch: 'DD/MM/YYYY',
        placeholder: ['Ngày bắt đầu', 'Ngày kết thúc'],
        showDefault: true,
        format: 'DD/MM/YYYY',
        defaultValue: [startDate, today],
        disabledFutureDate: true,
      },
    ];
  }, [saleTypeOptions, packageServiceOptions]);

  return {
    listPackageSale,
    loadingTable,
    columns,
    actionComponent,
    filters,
  };
};
