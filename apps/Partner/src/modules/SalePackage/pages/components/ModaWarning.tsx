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
  <CModal closeIcon open={open} onCancel={onClose} footer={null}>
    <div>
      <strong className="block text-center text-lg py-3">Cảnh báo</strong>
      <p className="text-center mb-6 mx-16">
        Gói cước này không được đi kèm với góc cước hiện tại. Bạn có muốn hủy
        gói cước hiện tại để đăng kí gói cước mới?
      </p>
      <div className="flex justify-center items-center gap-4 mt-6">
        <CButton type="default" className="min-w-[90px]" onClick={onClose}>
          Không
        </CButton>
        <CButton
          // loading={loading} // Use the loading prop
          className="min-w-[90px]"
          htmlType="submit"
        >
          Có
        </CButton>
      </div>
    </div>
  </CModal>;
};
