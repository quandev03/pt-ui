import { CInput, CModal } from '@react/commons/index';
import validateForm from '@react/utils/validator';
import { Form, Modal } from 'antd';
import { useEffect } from 'react';
import { useSendQrCode } from '../queryHook/useSendQrCode';
import useStore from '../store';
import styled from 'styled-components';

interface Props {
  onSendQrESIMSuccess?: () => void;
}

const StyledCModal = styled(CModal)`
  .ant-modal-content .ant-modal-body {
    padding-bottom: 0;
  }
`;

export const SendEmailQrSimModal: React.FC<Props> = ({
  onSendQrESIMSuccess,
}) => {
  const [form] = Form.useForm();
  const { isOpenSendQrESIM, onlineOrderDetail, closeSendQrESIMModal } =
    useStore();
  const { mutate: sendQReSIM, isPending } = useSendQrCode(() => {
    handleCancel();
    onSendQrESIMSuccess && onSendQrESIMSuccess();
  });
  console.log(onlineOrderDetail, 'test 1312');
  const handleFinish = (values: any) => {
    onlineOrderDetail?.id &&
      sendQReSIM({
        id: onlineOrderDetail.id,
        email: values.email.trim(),
      });
  };

  const handleCancel = () => {
    closeSendQrESIMModal();
    form.resetFields();
  };

  useEffect(() => {
    if (isOpenSendQrESIM && onlineOrderDetail?.email) {
      form.setFieldsValue({
        email: onlineOrderDetail.email,
      });
    }
  }, [onlineOrderDetail, isOpenSendQrESIM]);

  return (
    <StyledCModal
      open={isOpenSendQrESIM}
      title="Gửi email eSIM"
      okText="Xác nhận"
      cancelText="Đóng"
      onOk={form.submit}
      onCancel={handleCancel}
      confirmLoading={isPending}
    >
      <p
        style={{
          textAlign: 'center',
          marginBottom: 20,
          fontWeight: 'bold',
          fontSize: 18,
        }}
      >
        Vui lòng nhập email nhận QR eSIM
      </p>

      <Form
        form={form}
        labelCol={{ span: 4 }}
        colon={false}
        onFinish={handleFinish}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[validateForm.required, validateForm.email]}
        >
          <CInput placeholder="Nhập email" />
        </Form.Item>
      </Form>
    </StyledCModal>
  );
};
