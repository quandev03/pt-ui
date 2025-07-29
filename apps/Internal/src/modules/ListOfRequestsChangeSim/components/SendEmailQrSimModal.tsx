import { Form } from 'antd';
import validateForm from '@react/utils/validator';
import { CInput, CModal } from '@react/commons/index';
import { useCallback, useEffect } from 'react';
import { useSendMailEsim } from '../hooks/useSendMailEsim';

interface Props {
  open: boolean;
  onClose: () => void;
  email: string;
  requestId: string;
}

export const SendEmailQrSimModal: React.FC<Props> = ({
  open,
  onClose,
  email,
  requestId,
}) => {
  const [form] = Form.useForm();
  const { mutate: sendQrEsim, isPending } = useSendMailEsim(() => {
    onClose();
  });
  const handleSendQrEsim = useCallback(
    (values: { email: string }) => {
      const data = {
        requestId,
        email: values.email,
      };
      sendQrEsim(data);
    },
    [sendQrEsim, requestId]
  );
  useEffect(() => {
    if (email) {
      form.setFieldsValue({
        email,
      });
    }
  }, [email, form]);
  return (
    <CModal
      open={open}
      title={'Gửi email eSIM'}
      okText="Gửi"
      cancelText="Hủy"
      onOk={form.submit}
      onCancel={onClose}
      confirmLoading={isPending}
    >
      <Form
        form={form}
        labelCol={{ span: 4 }}
        colon={false}
        onFinish={handleSendQrEsim}
      >
        <Form.Item
          label=""
          name="email"
          rules={[validateForm.required, validateForm.email]}
        >
          <CInput placeholder="Nhập email *" />
        </Form.Item>
      </Form>
    </CModal>
  );
};
