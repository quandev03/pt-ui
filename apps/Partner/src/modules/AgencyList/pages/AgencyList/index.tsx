import { LayoutList } from '@vissoft-react/common';
import { memo } from 'react';
import { convertArrToObj } from '../../hooks';
import { useLogicListAgency } from './useLogicAgencyList';

export const AgencyList = memo(() => {
  const { filters, columns, actionComponent, listAgency, loadingTable } =
    useLogicListAgency();
  return (
    <LayoutList
      actionComponent={actionComponent}
      dataNoPagination={convertArrToObj(listAgency || [], null) || []}
      columns={columns}
      title="Cấu hình đại lý"
      filterItems={filters}
      loading={loadingTable}
      expandable={{ defaultExpandAllRows: true }}
      pagination={false}
      searchComponent={
        <LayoutList.SearchComponent
          name="textSearch"
          tooltip="Nhập mã hoặc tên đại lý để tìm kiếm"
          placeholder="Nhập mã hoặc tên đại lý để tìm kiếm"
        />
      }
    />
  );
});
