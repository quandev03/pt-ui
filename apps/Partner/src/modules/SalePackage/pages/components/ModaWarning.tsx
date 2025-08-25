import { ExclamationCircleFilled } from '@ant-design/icons';
import { CButton, CModal } from '@vissoft-react/common';

interface ModalWarningProps {
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ModalWarning = ({
  open,
  loading,
  onClose,
  onConfirm,
}: ModalWarningProps) => {
  return (
    <CModal closeIcon open={open} onCancel={onClose} footer={null}>
      <div>
        <div className="flex justify-center items-center gap-2 py-4">
          <ExclamationCircleFilled className="text-2xl text-red-500" />
          <strong className="text-center text-lg">Cảnh báo</strong>
        </div>
        <p className="text-center mx-6 text-[15px]">
          Gói cước này không được đi kèm với gói cước hiện tại.
        </p>
        <p className="text-center mb-6 mx-6 text-[15px]">
          Bạn có muốn hủy gói cước hiện tại để thực hiện đăng kí gói cước mới?
        </p>
        <div className="flex justify-center items-center gap-4 mt-6">
          <CButton type="default" className="min-w-[90px]" onClick={onClose}>
            Không
          </CButton>
          <CButton
            loading={loading}
            className="min-w-[90px]"
            onClick={onConfirm}
          >
            Có
          </CButton>
        </div>
      </div>
    </CModal>
  );
};
