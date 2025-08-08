import { LayoutList } from '@vissoft-react/common';
import { memo } from 'react';
import { useLogicListEsimWarehouse } from './useLogicListEsimWarehouse';
import { EsimWarehouseDetails } from '../../components/esimWarehouseDetails';
import { GenQrPopup } from '../../components/genQrPopup';
import { SendQrPopup } from '../../components/sendQrPopup';

export const ListEsimWarehouse = memo(() => {
  const {
    columns,
    filters,
    esimList,
    loadingEsimList,
    showEsimDetails,
    selectedRecord,
    isGenQrModalOpen,
    isSendQrModalOpen,
    handleCloseSendQr,
    handleCloseGenQr,
    handleCloseModal,
  } = useLogicListEsimWarehouse();
  return (
    <>
      <LayoutList
        title="Danh sách eSIM"
        columns={columns}
        filterItems={filters}
        data={esimList}
        loading={loadingEsimList}
        searchComponent={
          <LayoutList.SearchComponent
            name="q"
            tooltip="Nhập STB, serial, mã đơn hàng"
            placeholder="Nhập STB, serial, mã đơn hàng"
          />
        }
      />
      <EsimWarehouseDetails
        showEsimDetails={showEsimDetails}
        onClose={handleCloseModal}
        record={selectedRecord}
      />
      <GenQrPopup
        open={isGenQrModalOpen}
        onCancel={handleCloseGenQr}
        record={selectedRecord}
      />
      <SendQrPopup
        open={isSendQrModalOpen}
        onCancel={handleCloseSendQr}
        record={selectedRecord}
      />
    </>
  );
});
