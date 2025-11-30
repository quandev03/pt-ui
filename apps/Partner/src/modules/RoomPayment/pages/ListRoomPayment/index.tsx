import { LayoutList } from '@vissoft-react/common';
import { memo } from 'react';
import { useLogicListRoomPayment } from './useLogicListRoomPayment';
import { UploadRoomPayment } from '../UploadRoomPayment';

export const ListRoomPayment = memo(() => {
  const {
    columns,
    filters,
    roomPaymentList,
    loadingRoomPaymentList,
    actionComponent,
    isUploadModalOpen,
    handleCloseUpload,
  } = useLogicListRoomPayment();

  return (
    <>
      <LayoutList
        title="Thanh toán dịch vụ phòng"
        columns={columns}
        filterItems={filters}
        actionComponent={actionComponent}
        data={roomPaymentList}
        loading={loadingRoomPaymentList}
        searchComponent={
          <LayoutList.SearchComponent
            name="textSearch"
            tooltip="Tìm kiếm thanh toán"
            placeholder="Tìm kiếm thanh toán"
          />
        }
      />
      {isUploadModalOpen && (
        <UploadRoomPayment
          open={isUploadModalOpen}
          onClose={handleCloseUpload}
        />
      )}
    </>
  );
});





