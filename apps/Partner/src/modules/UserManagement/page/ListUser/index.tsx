import { LayoutList } from '@vissoft-react/common';
import { memo } from 'react';
import { useLogicListUser } from './useLogicListUser';

export const ListUser = memo(() => {
  const { listUser, loadingTable, filters, columns, actionComponent } =
    useLogicListUser();
  return (
    <LayoutList
      actionComponent={actionComponent}
      data={listUser}
      columns={columns}
      title="Quản lý user đại lý"
      filterItems={filters}
      loading={loadingTable}
      searchComponent={
        <LayoutList.SearchComponent
          name="q"
          tooltip="Nhập username hoặc tên tài khoản"
          placeholder="Nhập username hoặc tên tài khoản"
        />
      }
    />
  );
});
