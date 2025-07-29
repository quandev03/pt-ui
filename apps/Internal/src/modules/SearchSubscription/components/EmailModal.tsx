import { Form } from 'antd';
import { ModalProps } from '../types';
import { CInput, CModal } from '@react/commons/index';
import { useEmailMutation } from '../hooks/useEmailMutation';
import { useParams } from 'react-router-dom';
import validateForm from '@react/utils/validator';

const EmailModal: React.FC<ModalProps> = ({ isOpen, setIsOpen }) => {
  const formInstance = Form.useFormInstance();
  const [form] = Form.useForm();
  const { id } = useParams();
  const { isPending, mutate } = useEmailMutation();

  const handleFinish = (values: any) => {
    mutate(
      {
        idSub: id ?? '',
        email: values.email,
        qrCode: formInstance.getFieldValue('qrCode'),
      },
      { onSuccess: handleCancel }
    );
  };

  const handleCancel = () => {
    setIsOpen(false);
    form.resetFields();
  };

  return (
    <CModal
      open={isOpen}
      title="Gửi email eSIM"
      okText="Gửi"
      cancelText="Hủy"
      onOk={form.submit}
      onCancel={handleCancel}
      loading={isPending}
    >
      <Form form={form} onFinish={handleFinish}>
        <Form.Item
          name="email"
          messageVariables={{ label: 'Email' }}
          rules={[validateForm.required, validateForm.email]}
        >
          <CInput placeholder="Nhập email *" maxLength={100} preventSpace />
        </Form.Item>
      </Form>
    </CModal>
  );
};

export default EmailModal;
