import { ConfigProvider, Flex, Modal } from 'antd';
import CButton from '../Button';

interface ModalConfirmProps {
  title?: string;
  message?: string;
  onOk: () => void;
  onCancel?: () => void;
  closable?: boolean;
  isDestroyAll?: boolean;
}

const ModalConfirm = ({
  title = 'Xác nhận',
  message,
  onOk,
  onCancel,
  closable = true,
  isDestroyAll = true,
  ...props
}: ModalConfirmProps) => {
  const { confirm, destroyAll } = Modal;

  const handleOk = () => {
    onOk();
    isDestroyAll && destroyAll();
  };

  const handleCancel = () => {
    destroyAll();
    onCancel && onCancel();
  };

  confirm({
    ...props,
    title: (
      <div className="text-lg font-semibold text-center mt-4">{title}</div>
    ),
    icon: null,
    footer: null,
    closable: closable,
    centered: true,
    content: (
      <ConfigProvider
        theme={{
          token: {
            fontFamily: 'Inter',
            colorPrimary: '#002046',
          },
        }}
      >
        {message && (
          <div className="font-medium text-center text-base mb-5">
            {message}
          </div>
        )}
        <Flex align="center" justify="center" gap={12} className="mb-5">
          <CButton
            type="default"
            onClick={handleCancel}
            className="min-w-[120px]"
          >
            Không
          </CButton>
          <CButton onClick={handleOk} className="min-w-[120px]">
            Có
          </CButton>
        </Flex>
      </ConfigProvider>
    ),
  });
};

export default ModalConfirm;
