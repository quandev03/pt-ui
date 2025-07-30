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
      title="Tài khoản nhân sự"
      filterItems={filters}
      loading={loadingTable}
      searchComponent={
        <LayoutList.SearchComponent
          name="q"
          tooltip="Nhập họ và tên hoặc email"
          placeholder="Nhập họ và tên hoặc email"
        />
      }
    />
  );
});
