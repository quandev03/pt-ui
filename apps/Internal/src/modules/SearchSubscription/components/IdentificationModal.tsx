import { Form } from 'antd';
import { IdentificationModalProps } from '../types';
import { CInput, CModal } from '@react/commons/index';
import { useIdentificationMutation } from '../hooks/useIdentificationMutation';
import { useParams } from 'react-router-dom';
import useSubscriptionStore from '../store';
import { MESSAGE } from '@react/utils/message';
import { getDate } from '@react/utils/datetime';
import validateForm from '@react/utils/validator';

const IdentificationModal: React.FC<IdentificationModalProps> = ({
  isOpen,
  setIsOpen,
  callback,
}) => {
  const formInstance = Form.useFormInstance();
  const [form] = Form.useForm();
  const { id } = useParams();
  const { setIsIdentification } = useSubscriptionStore();
  const { isPending, mutate } = useIdentificationMutation();

  const handleFinish = (values: any) => {
    mutate(
      { ...values, id },
      {
        onSuccess: (data) => {
          setIsOpen(false);
          setIsIdentification(true);
          callback && callback();
          formInstance.setFieldsValue({
            ...data,
            birthDate: getDate(data.birthDate),
            idExpireDate: getDate(data.idExpireDate),
            idIssueDate: getDate(data.idIssueDate),
            appObject: 'Cá nhân',
          });
        },
      }
    );
  };

  const handleCancel = () => {
    setIsOpen(false);
    form.resetFields();
  };

  return (
    <CModal
      open={isOpen}
      title="Nhập số GTTT để xem thông tin chi tiết"
      okText="Xem thông tin"
      cancelText="Đóng"
      onOk={form.submit}
      onCancel={handleCancel}
      loading={isPending}
    >
      <Form form={form} onFinish={handleFinish}>
        <Form.Item
          name="idNo"
          messageVariables={{ label: 'Số GTTT' }}
          rules={[
            validateForm.required,
            {
              validator: (_, value) => {
                const newValue = value?.replace(/\D/g, '');
                if (newValue && newValue.length < 9) {
                  return Promise.reject(new Error(MESSAGE.G07));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <CInput placeholder="Nhập số GTTT *" maxLength={12} onlyNumber />
        </Form.Item>
      </Form>
    </CModal>
  );
};

export default IdentificationModal;
