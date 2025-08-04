import { LayoutList } from '@vissoft-react/common';
import { memo } from 'react';
import { useLogicListAgency } from './useLogicAgencyList';

export const AgencyList = memo(() => {
  const { filters, columns, actionComponent, listAgency, loadingTable } =
    useLogicListAgency();
  return (
    <LayoutList
      actionComponent={actionComponent}
      data={listAgency}
      columns={columns}
      title="Quản lý user đại lý"
      filterItems={filters}
      loading={loadingTable}
      searchComponent={
        <LayoutList.SearchComponent
          name="q"
          tooltip="Nhập mã hoặc tên đại lý để tìm kiếm"
          placeholder="Nhập mã hoặc tên đại lý để tìm kiếm"
        />
      }
    />
  );
});
