import { LayoutList } from '@vissoft-react/common';
import { memo } from 'react';
import { useLogicBuyPackageServiceList } from './useLogicBuyPackageServiceList';

export const BuyPackageServiceList = memo(() => {
  const { purchaseHistory, loading, columns, actionComponent, filters } =
    useLogicBuyPackageServiceList();

  return (
    <LayoutList
      title="Danh sách gói đã mua"
      columns={columns}
      data={purchaseHistory}
      loading={loading}
      actionComponent={actionComponent}
      filterItems={filters}
    />
  );
});
