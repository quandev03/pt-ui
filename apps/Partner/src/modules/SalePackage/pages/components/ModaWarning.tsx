import { CModal } from '@vissoft-react/common';

export const ModalWarning = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  <CModal closeIcon open={open} onCancel={onClose} footer={null}>
    <div>
      <strong className="block text-center text-lg py-3">Cảnh báo</strong>
      <p className="text-center mb-6 mx-16">
        Gói cước này không được đi kèm với góc cước &lt;tên gói cước&gt;.
      </p>
      <p className="text-center mb-6 mx-16">
        Vui lòng liên hệ tổng đài 1900 5222 (1.000đ/Phút) hoặc soạn SMS hủy gói
        cước &lt;tên gói cước&gt; để thực hiện đăng ký gói cước mới
      </p>
    </div>
  </CModal>;
};
