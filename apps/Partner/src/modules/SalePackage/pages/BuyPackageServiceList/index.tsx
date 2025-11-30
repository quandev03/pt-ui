import { LayoutList } from '@vissoft-react/common';
import { memo } from 'react';
import { useLogicPurchaseHistoryList } from './useLogicPurchaseHistoryList';

export const PurchaseHistoryList = memo(() => {
  const { purchaseHistory, loading, columns, actionComponent } =
    useLogicPurchaseHistoryList();

  return (
    <LayoutList
      title="Danh sách gói đã mua"
      columns={columns}
      data={purchaseHistory}
      loading={loading}
      actionComponent={actionComponent}
      filterItems={[]}
      searchComponent={
        <LayoutList.SearchComponent
          name="q"
          placeholder="Nhập tên hoặc mã gói"
          tooltip="Tìm theo tên/mã gói"
        />
      }
    />
  );
});

