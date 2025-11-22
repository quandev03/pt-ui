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
      title="Danh sách phòng"
      filterItems={filters}
      loading={loadingTable}
      expandable={{ defaultExpandAllRows: true }}
      pagination={false}
      searchComponent={
        <LayoutList.SearchComponent
          name="textSearch"
          tooltip="Nhập mã hoặc tên phòng để tìm kiếm"
          placeholder="Nhập mã hoặc tên phòng để tìm kiếm"
          maxLength={100}
          className="w-[300px]"
        />
      }
    />
  );
});
