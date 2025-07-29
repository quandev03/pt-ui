import CButton from '@react/commons/Button';
import CModal from '@react/commons/Modal';
import CTextArea from '@react/commons/TextArea';
import { Col, Form, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useMemo } from 'react';
import { StatusOrderEnum } from '../constants';
import { useSupportUpdateStatusAdminOrder } from '../queryHooks';
import { IDataOrder } from '../types';
import useOrderStore from '../stores';

type Props = {
  data: IDataOrder | undefined;
  onClose: () => void;
  callBackReCallDetail?: () => void;
  type: 'APPROVED' | 'REJECT' | '' | 'PROCESS_APPROVED';
};

const ModalAction = ({ data, onClose, type, callBackReCallDetail }: Props) => {
  const [form] = useForm();
  const { typeAction } = useOrderStore();
  const { mutate: updateStatusAdminOrder } = useSupportUpdateStatusAdminOrder(
    () => {
      form.resetFields();
      onClose();
      callBackReCallDetail && callBackReCallDetail();
    }
  );
  const title = useMemo(() => {
    switch (type) {
      case 'APPROVED':
        return 'Xác nhận';
      case 'REJECT':
        return 'Từ chối';
      default:
        return '';
    }
  }, [type]);
  const handleFinish = (values: { description: string }) => {
    const payload = {
      ...values,
      id: data?.id as number,
      status:
        type === 'APPROVED'
          ? StatusOrderEnum.APPROVED
          : StatusOrderEnum.REJECTED,
    };
    updateStatusAdminOrder(payload);
  };

  return (
    <CModal
      title={title}
      open={typeAction === 'APPROVED' || typeAction === 'REJECT'}
      width={600}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} colon={false} onFinish={handleFinish}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item
              label="Ghi chú"
              name="description"
              rules={[
                {
                  required: true,
                  message: 'Không được để trống trường này',
                },
              ]}
            >
              <CTextArea placeholder="Nhập ghi chú" maxLength={250} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <div className="flex gap-5 items-center justify-center">
              <CButton
                type="default"
                className="min-w-[120px]"
                onClick={onClose}
              >
                Đóng
              </CButton>
              <CButton className="min-w-[120px]" htmlType="submit">
                Xác nhận
              </CButton>
            </div>
          </Col>
        </Row>
      </Form>
    </CModal>
  );
};

export default ModalAction;
