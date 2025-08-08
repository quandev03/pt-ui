import { LayoutList } from '@vissoft-react/common';
import { memo } from 'react';
import { useLogicListPackagedEsimBooking } from './useLogIcListPackagedEsim';
export const ListPackagedEsim = memo(() => {
  const {
    actionComponent,
    filters,
    columns,
    listPackagedEsimBooked,
    loadingEsimList,
  } = useLogicListPackagedEsimBooking();
  return (
    <LayoutList
      title={'Danh sách book eSIM kèm gói'}
      actionComponent={actionComponent}
      filterItems={filters}
      columns={columns}
      data={listPackagedEsimBooked}
      loading={loadingEsimList}
      searchComponent={
        <LayoutList.SearchComponent
          name="textSearch"
          tooltip="Nhập tên user thực hiện"
          placeholder="Nhập tên user thực hiện"
        />
      }
    />
  );
});
