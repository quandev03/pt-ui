import { Typography, Form } from 'antd';
import { IEsimWarehouseList } from '../types';
import { CInput, CModal, IFieldErrorsItem } from '@vissoft-react/common';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetSendQrCode } from '../hooks/useGetSendQrCode';

const { Text } = Typography;

interface SendQrPopupProps {
  open: boolean;
  onCancel: () => void;
  record: IEsimWarehouseList | null;
}

export const SendQrPopup = ({ open, onCancel, record }: SendQrPopupProps) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onSuccess = useCallback(() => {
    navigate(-1); // Navigate back on success
  }, [navigate]);

  const onError = useCallback(
    (errorField: IFieldErrorsItem[]) => {
      form.setFields(
        errorField.map((error) => ({
          name: error.field,
          errors: [error.detail],
        }))
      );
    },
    [form]
  );

  const { mutate: sendQrCode, isPending: sendQrCodeInProcess } =
    useGetSendQrCode(onSuccess, onError);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (record) {
          const payload = {
            email: values.email,
            subId: record.subId,
          };
          sendQrCode(payload);
        }
      })
      .catch((info) => {
        console.log(info);
      });
  };

  return (
    <CModal
      open={open}
      onCancel={onCancel}
      okText="Xác nhận"
      cancelText="Hủy"
      title="Gửi QR"
      centered
      onOk={handleOk}
      okButtonProps={{ loading: sendQrCodeInProcess }}
    >
      <Form form={form} layout="vertical" autoComplete="off">
        <Text
          style={{
            fontSize: 16,
            textAlign: 'center',
            color: '#333',
            display: 'block',
            marginBottom: 20,
          }}
        >
          Nhập email để nhận QR eSIM
        </Text>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập email!',
            },
            {
              type: 'email',
              message: 'Email không đúng định dạng!',
            },
          ]}
        >
          <CInput placeholder="Nhập email" />
        </Form.Item>
      </Form>
    </CModal>
  );
};
