import { CModal, CTable, TitleHeader } from '@vissoft-react/common';
import { IEsimWarehouseList } from '../types';
import { useColumnsEsimWarehouseDetails } from '../hooks/useColumnsEsimWarehouseDetails';
import { useGetDetailsEsimWarehouse } from '../hooks/useGetDetailsEsimWarehouse';
import { CustomerInfoTable } from './customerInfoTable';

interface IModalEsimWarehouseProps {
  showEsimDetails: boolean;
  onClose: () => void;
  record: IEsimWarehouseList | null;
}

export const EsimWarehouseDetails = ({
  showEsimDetails,
  onClose,
  record,
}: IModalEsimWarehouseProps) => {
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
      <TitleHeader style={{ color: '#005AAA' }}>
        Thông tin khách hàng
      </TitleHeader>
      <CustomerInfoTable subId={record?.subId} />
      <TitleHeader style={{ color: '#005AAA' }}>Thông tin eSIM</TitleHeader>
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
