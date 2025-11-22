import { LayoutList } from '@vissoft-react/common';
import { memo } from 'react';
import { useLogicListeSIMStock } from './useLogicListeSIMStock';
import { ModalCreateSubscription } from './ModalCreateSubscription';

export const ListeSIMStock = memo(() => {
  const {
    listeSIMStock,
    loadingTable,
    filters,
    columns,
    actionComponent,
    openCreate,
    closeCreateModal,
    refreshList,
  } = useLogicListeSIMStock();
  return (
    <>
      <LayoutList
        data={listeSIMStock}
        columns={columns}
        actionComponent={actionComponent}
        title="Danh sách đăng ký dịch vụ"
        filterItems={filters}
        loading={loadingTable}
          />
      <ModalCreateSubscription
        open={openCreate}
        onClose={closeCreateModal}
        onSuccess={refreshList}
      />
    </>
  );
});
