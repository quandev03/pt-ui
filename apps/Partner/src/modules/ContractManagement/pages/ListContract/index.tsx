import { LayoutList } from '@vissoft-react/common';
import { memo } from 'react';
import { useLogicListContract } from './useLogicListContract';

export const ListContract = memo(() => {
  const {
    columns,
    filters,
    contractList,
    loadingContractList,
    actionComponent,
  } = useLogicListContract();

  return (
    <LayoutList
      title="Quản lý hợp đồng"
      columns={columns}
      filterItems={filters}
      actionComponent={actionComponent}
      data={contractList}
      loading={loadingContractList}
      searchComponent={
        <LayoutList.SearchComponent
          name="textSearch"
          tooltip="Tìm kiếm hợp đồng"
          placeholder="Tìm kiếm theo tên, địa chỉ, số điện thoại"
        />
      }
    />
  );
});


