import { LayoutList } from '@vissoft-react/common';
import { memo } from 'react';
import { useLogicListPartnerOrder } from './useLogicPartnerOrderReport';

export const ListPartnerOrderReport = memo(() => {
  const {
    filters,
    exportComponent,
    columns,
    loadingList,
    listPartnerOrderReport,
  } = useLogicListPartnerOrder();
  return (
    <LayoutList
      title="Báo cáo đơn hàng book eSIM"
      actionComponent={exportComponent}
      columns={columns}
      data={listPartnerOrderReport}
      loading={loadingList}
      filterItems={filters}
      searchComponent={
        <LayoutList.SearchComponent
          name="q"
          tooltip="Nhập mã đơn hàng"
          placeholder="Nhập mã đơn hàng"
          maxLength={100}
        />
      }
    />
  );
});
