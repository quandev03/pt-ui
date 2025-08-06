import { Typography } from 'antd';
import { IEsimWarehouseList } from '../types';
import { CModal } from '@vissoft-react/common';

const { Text } = Typography;

interface SendQrPopup {
  open: boolean;
  onCancel: () => void;
  record: IEsimWarehouseList | null;
}

export const SendQrPopup = ({ open, onCancel, record }: SendQrPopup) => {
  return (
    <CModal
      open={open}
      onCancel={onCancel}
      okText="Xác nhận"
      cancelText="Hủy"
      title="Xác nhận gửi QR"
      centered
    >
      {record && (
        <Text>
          Bạn có chắc chắn muốn gửi lại mã QR cho thuê bao{' '}
          <Text strong>{record.isdn}</Text> không?
        </Text>
      )}
    </CModal>
  );
};
