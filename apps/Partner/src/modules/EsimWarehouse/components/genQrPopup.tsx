import { IEsimWarehouseList } from '../types';
import { CModal } from '@vissoft-react/common';
import { Image } from 'antd';

interface GenQrPopupProps {
  open: boolean;
  onCancel: () => void;
  record: IEsimWarehouseList | null;
  loading: boolean;
  qrCodeUrl: string | null;
}

export const GenQrPopup = ({
  open,
  onCancel,
  record,
  loading,
  qrCodeUrl,
}: GenQrPopupProps) => {
  return (
    <CModal
      title={'Gen QR code'}
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      loading={loading}
    >
      <div style={{ textAlign: 'center', padding: '20px' }}>
        {qrCodeUrl && <Image src={`${qrCodeUrl}`} width={200} />}
        <p style={{ marginTop: '16px' }}>Quét mã QR này để kích hoạt eSIM</p>
      </div>
    </CModal>
  );
};
