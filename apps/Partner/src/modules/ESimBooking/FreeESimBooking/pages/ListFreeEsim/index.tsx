import { LayoutList } from '@vissoft-react/common';
import { memo } from 'react';
import { useLogicListFreeEsimBooking } from './useLogicListFreeEsimBooking';
import { IFreeEsimBooking } from '../../types';

export const ListFreeEsim = memo(() => {
  const {
    filters,
    actionComponent,
    columns,
    loadingEsimList,
    listFreeEsimBooked,
  } = useLogicListFreeEsimBooking();
  return (
    <LayoutList
      title="Danh sách book eSIM miễn phí"
      actionComponent={actionComponent}
      filterItems={filters}
      columns={columns}
      loading={loadingEsimList}
      data={listFreeEsimBooked}
      searchComponent={
        <LayoutList.SearchComponent
          name="q"
          tooltip="Nhập tên user thực hiện"
          placeholder="Nhập tên user thực hiện"
        />
      }
    />
  );
});
