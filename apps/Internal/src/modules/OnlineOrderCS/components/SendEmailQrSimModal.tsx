import { Form } from 'antd';
import validateForm from '@react/utils/validator';
import { CInput, CModal } from '@react/commons/index';
import useOrderCSStore from '../stores';
import { useSendQReSIMOrderCS } from '../queryHooks';
import { useEffect } from 'react';

interface Props {
  onSendQrESIMSuccess?: () => void;
}

export const SendEmailQrSimModal: React.FC<Props> = ({
  onSendQrESIMSuccess,
}) => {
  const [form] = Form.useForm();
  const { isOpenSendQrESIM, record, closeSendQrESIMModal } = useOrderCSStore();
  const { mutate: sendQReSIM, isPending } = useSendQReSIMOrderCS(() => {
    handleCancel();
    onSendQrESIMSuccess && onSendQrESIMSuccess();
  });

  const handleFinish = (values: any) => {
    record?.id &&
      sendQReSIM({
        id: record.id,
        serial: record.serial,
        email: values.email.trim(),
      });
  };

  const handleCancel = () => {
    closeSendQrESIMModal();
    form.resetFields();
  };

  useEffect(() => {
    if (isOpenSendQrESIM && record?.customerEmail) {
      form.setFieldsValue({
        email: record.customerEmail,
      });
    }
  }, [record, isOpenSendQrESIM]);

  return (
    <CModal
      open={isOpenSendQrESIM}
      title={'Xác nhận'}
      okText="Có"
      cancelText="Không"
      onOk={form.submit}
      onCancel={handleCancel}
      confirmLoading={isPending}
    >
      <p style={{ textAlign: 'center', marginBottom: 20 }}>
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
    </CModal>
  );
};
