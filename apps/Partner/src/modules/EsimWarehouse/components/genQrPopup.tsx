import { QRCode, Space, Typography } from 'antd';
import { IEsimWarehouseList } from '../types';
import { CModal } from '@vissoft-react/common';

const { Text, Title } = Typography;

interface GenQrPopupProps {
  // Also good practice to capitalize type/interface names for components
  open: boolean;
  onCancel: () => void;
  record: IEsimWarehouseList | null;
}

// RENAME the component function to GenQrPopup (PascalCase)
export const GenQrPopup = ({ open, onCancel, record }: GenQrPopupProps) => {
  const qrValue = record?.serial || `https://example.com/esim/${Math.random()}`;

  return (
    <CModal
      open={open}
      onCancel={onCancel}
      title={<Title level={4}>Mã QR eSIM</Title>}
      footer={null}
      centered
    >
      {record && (
        <Space direction="vertical" align="center" style={{ width: '100%' }}>
          <QRCode value={qrValue} size={200} />
          <Text style={{ marginTop: 16 }}>
            Dành cho thuê bao: <Text strong>{record.isdn}</Text>
          </Text>
          <Text>
            Serial SIM: <Text strong>{record.serial}</Text>
          </Text>
        </Space>
      )}
    </CModal>
  );
};
