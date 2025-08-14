import { LayoutList } from '@vissoft-react/common';
import { memo } from 'react';
import { useLogicListReport } from './useLogicListReport';

export const ListReportPartner = memo(() => {
  const { listReportPartner, loadingTable, filters, columns, actionComponent } =
    useLogicListReport();
  return (
    <LayoutList
      actionComponent={actionComponent}
      data={listReportPartner}
      columns={columns}
      title="Báo cáo đơn hàng đối tác"
      filterItems={filters}
      loading={loadingTable}
      searchComponent={
        <LayoutList.SearchComponent
          name="q"
          tooltip="Nhập mã đơn hàng, mã đối tác, tên đối tác để tìm kiếm"
          placeholder="Nhập mã đơn hàng, mã đối tác, tên đối tác để tìm kiếm"
        />
      }
    />
  );
});
