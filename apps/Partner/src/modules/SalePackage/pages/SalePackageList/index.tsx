import { LayoutList } from '@vissoft-react/common';
import { memo } from 'react';
import { useLogicListSalePackage } from './useLogicListSalePackage';

export const PackageSaleList = memo(() => {
  const { listPackageSale, loadingTable, filters, columns, actionComponent } =
    useLogicListSalePackage();
  return (
    <LayoutList
      actionComponent={actionComponent}
      data={listPackageSale}
      columns={columns}
      title="Danh sách bán gói cho thuê bao"
      filterItems={filters}
      loading={loadingTable}
      searchComponent={
        <LayoutList.SearchComponent
          name="q"
          tooltip="Nhập tên file/ user thực hiện"
          placeholder="Nhập tên file/ user thực hiện"
        />
      }
    />
  );
});
