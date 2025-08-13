import {
  BtnGroupFooter,
  CButton,
  CButtonSave,
  CModal,
  CSelect,
  MESSAGE,
} from '@vissoft-react/common';
import { Col, Form } from 'antd';
import { FC } from 'react';
import { useListPackage } from '../hook/useListPackage';
type Props = {
  open: boolean;
  onClose: () => void;
};
const ModalAssignPackage: FC<Props> = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const handleCancel = () => {
    form.resetFields();
    onClose();
  };
  const { data: packageOptions } = useListPackage({ page: 0, size: 1000 });
  return (
    <CModal
      title="Phân quyền gói cước"
      open={open}
      onCancel={handleCancel}
      footer={null}
    >
      <Form
        form={form}
        colon={false}
        labelAlign="left"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
      >
        <Col span={24}>
          <Form.Item
            label="Gói cước"
            rules={[{ required: true, message: MESSAGE.G06 }]}
            name="package"
          >
            <CSelect options={packageOptions} mode="multiple" />
          </Form.Item>
        </Col>
        <BtnGroupFooter className="mt-9">
          <CButtonSave />
          <CButton type="default">Hủy</CButton>
        </BtnGroupFooter>
      </Form>
    </CModal>
  );
};
export default ModalAssignPackage;
