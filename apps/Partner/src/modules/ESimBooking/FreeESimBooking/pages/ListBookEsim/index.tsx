import { LayoutList } from '@vissoft-react/common';
import { memo } from 'react';
import { useLogicListFreeEsimBooking } from './useLogicListFreeEsimBooking';

export const ListFreeEsim = memo(() => {
  const { filters, actionComponent, columns, loadingEsimList, listEsimBooked } =
    useLogicListFreeEsimBooking();
  return (
    <LayoutList
      title="Danh sách đặt hàng eSIM"
      actionComponent={actionComponent}
      filterItems={filters}
      columns={columns}
      loading={loadingEsimList}
      data={listEsimBooked}
      searchComponent={
        <LayoutList.SearchComponent
          name="textSearch"
          tooltip="Nhập user thực hiện"
          placeholder="Nhập user thực hiện"
        />
      }
    />
  );
});
