import { LayoutList } from '@vissoft-react/common';
import { memo } from 'react';
import { useLogicListeSIMStock } from './useLogicListeSIMStock';
import { ActioneSIMStock } from '../ActioneSIMStock';

export const ListeSIMStock = memo(() => {
  const {
    listeSIMStock,
    loadingTable,
    filters,
    columns,
    openModal,
    actionComponent,
    handleCloseModal,
    id,
  } = useLogicListeSIMStock();
  return (
    <>
      <LayoutList
        data={listeSIMStock}
        columns={columns}
        actionComponent={actionComponent}
        title="Danh sách eSIM"
        filterItems={filters}
        loading={loadingTable}
        searchComponent={
          <LayoutList.SearchComponent
            name="textSearch"
            tooltip="Nhập số thuê bao, serial SIM, mã đơn hàng"
            placeholder="Nhập số thuê bao, serial SIM, mã đơn hàng"
          />
        }
      />
      <ActioneSIMStock
        id={id ?? ''}
        openModal={openModal}
        onClose={handleCloseModal}
      ></ActioneSIMStock>
    </>
  );
});
