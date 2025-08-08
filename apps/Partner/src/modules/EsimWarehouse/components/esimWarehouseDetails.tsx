import { CModal, CTable } from '@vissoft-react/common';
import { IEsimWarehouseList } from '../types';
import { useColumnsEsimWarehouseDetails } from '../hooks/useColumnsEsimWarehouseDetails';
import { useGetDetailsEsimWarehouse } from '../hooks/useGetDetailsEsimWarehouse';

interface IModalEsimWarehouseDetails {
  showEsimDetails: boolean;
  onClose: () => void;
  record: IEsimWarehouseList | null;
}

export const EsimWarehouseDetails = ({
  showEsimDetails,
  onClose,
  record,
}: IModalEsimWarehouseDetails) => {
  const columns = useColumnsEsimWarehouseDetails();
  const { data: detailEsim, isLoading: loadingEsimDetails } =
    useGetDetailsEsimWarehouse(record?.subId);

  return (
    <CModal
      open={showEsimDetails}
      title="Xem chi tiết eSIM"
      footer={null}
      width={900}
      closable={true}
      onCancel={onClose}
    >
      <CTable
        columns={columns}
        dataSource={detailEsim}
        loading={loadingEsimDetails}
        rowKey="id"
        pagination={false}
      />
    </CModal>
  );
};
