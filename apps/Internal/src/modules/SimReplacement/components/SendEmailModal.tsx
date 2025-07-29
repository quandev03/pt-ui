import { MailOutlined } from '@ant-design/icons';
import CButton, { CButtonClose } from '@react/commons/Button';
import CInput from '@react/commons/Input';
import { Form } from 'antd';
import { StyledModal } from '../pages/styled';
import { useSendEmail } from '../hooks/useSendEmail';
import { AnyElement } from '@react/commons/types';
import { emailRegex } from '@react/constants/regex';
import { useEffect } from 'react';

type Props = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  recordId?: number;
  emailDefault: string | null;
};
const SendEmailModal: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  recordId,
  emailDefault,
}) => {
  const [form] = Form.useForm();
  const onSuccess = () => {
    form.resetFields();
    setIsOpen(false);
  };
  const { mutate: sendEmail, isPending: isSending } = useSendEmail(onSuccess);
  const handleCancel = () => {
    form.resetFields();
    setIsOpen(false);
  };
  const handleFinish = (value: AnyElement) => {
    sendEmail({ id: recordId, email: value.email });
  };
  useEffect(() => {
    form.setFieldValue('email', emailDefault);
  }, [isOpen]);
  return (
    <StyledModal
      title={'Gửi lại email'}
      open={isOpen}
      onCancel={handleCancel}
      footer={[
        <CButtonClose type="default" onClick={handleCancel}>
          Đóng
        </CButtonClose>,
        <CButton
          onClick={() => form.submit()}
          icon={<MailOutlined />}
          loading={isSending}
        >
          Gửi email
        </CButton>,
      ]}
    >
      <Form form={form} colon={false} onFinish={handleFinish}>
        <Form.Item
          label="Email"
          name="email"
          required
          rules={[
            {
              validator(_, value) {
                if (!value) {
                  return Promise.reject('Không được để trống trường này');
                } else if (!emailRegex.test(value)) {
                  return Promise.reject('Email không đúng định dạng');
                } else {
                  return Promise.resolve();
                }
              },
            },
          ]}
        >
          <CInput maxLength={100} />
        </Form.Item>
      </Form>
    </StyledModal>
  );
};
export default SendEmailModal;
