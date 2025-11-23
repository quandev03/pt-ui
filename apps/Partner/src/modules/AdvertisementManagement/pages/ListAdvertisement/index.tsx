import { LayoutList } from '@vissoft-react/common';
import { memo } from 'react';
import { useLogicListAdvertisement } from './useLogicListAdvertisement';

export const ListAdvertisement = memo(() => {
  const {
    advertisementList,
    loadingTable,
    columns,
    actionComponent,
    filters,
  } = useLogicListAdvertisement();

  return (
    <LayoutList
      actionComponent={actionComponent}
      data={advertisementList}
      columns={columns}
      title="Quản lý quảng cáo"
      filterItems={filters}
      loading={loadingTable}
      searchComponent={
        <LayoutList.SearchComponent
          name="q"
          tooltip="Nhập tiêu đề hoặc nội dung quảng cáo"
          placeholder="Nhập tiêu đề hoặc nội dung quảng cáo"
          maxLength={100}
          className="w-[400px]"
        />
      }
    />
  );
});

