import { CModal, CTable } from '@vissoft-react/common';
import { IEsimWarehouseDetails } from '../types';
import { useColumnsEsimWarehouseDetails } from '../hooks/useColumnsEsimWarehouseDetails';

interface IModalEsimWarehouseDetails {
  showEsimDetails: boolean;
  onClose: () => void;
  data?: IEsimWarehouseDetails[];
}

export const EsimWarehouseDetails = ({
  showEsimDetails,
  onClose,
  data = [],
}: IModalEsimWarehouseDetails) => {
  const columns = useColumnsEsimWarehouseDetails();

  return (
    <CModal
      open={showEsimDetails}
      title="Xem chi tiết eSIM"
      footer={null}
      width={700}
      closable={true}
      onCancel={onClose}
    >
      <CTable
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={false}
        scroll={{ x: 650 }}
      />
    </CModal>
  );
};
