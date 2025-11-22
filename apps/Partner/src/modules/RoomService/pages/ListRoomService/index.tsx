import { LayoutList } from '@vissoft-react/common';
import { memo } from 'react';
import { useLogicListRoomService } from './useLogicListRoomService';

export const ListRoomService = memo(() => {
  const {
    columns,
    filters,
    roomServiceList,
    loadingRoomServiceList,
    actionComponent,
  } = useLogicListRoomService();

  return (
    <LayoutList
      title="Danh sách dịch vụ phòng"
      columns={columns}
      filterItems={filters}
      actionComponent={actionComponent}
      data={roomServiceList}
      loading={loadingRoomServiceList}
      searchComponent={
        <LayoutList.SearchComponent
          name="textSearch"
          tooltip="Tìm kiếm dịch vụ phòng"
          placeholder="Tìm kiếm dịch vụ phòng"
        />
      }
    />
  );
});

