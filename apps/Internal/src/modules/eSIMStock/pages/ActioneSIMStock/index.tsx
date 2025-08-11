import { CModal, CTable } from '@vissoft-react/common';
import { memo } from 'react';
import { useLogicActioneSIMStock } from './useLogicActioneSIMStock';

interface Props {
  openModal: boolean;
  onClose: () => void;
  id: string;
}

export const ActioneSIMStock = memo(({ openModal, onClose, id }: Props) => {
  const { listeSIMDetail, loadingTable, columns } = useLogicActioneSIMStock(id);
  return (
    <CModal
      open={openModal}
      title="Xem chi tiết eSIM"
      onCancel={onClose}
      footer={null}
      width={1000}
    >
      <CTable
        dataSource={listeSIMDetail}
        columns={columns}
        loading={loadingTable}
      />
    </CModal>
  );
});
