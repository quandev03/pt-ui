import {
  BtnGroupFooter,
  CButton,
  CButtonSave,
  CModal,
  CSelect,
  MESSAGE,
} from '@vissoft-react/common';
import { Col, Form } from 'antd';
import { FC, useEffect } from 'react';
import { useAssignPackagePermission, useGetAssignedPackages } from '../hook';
import { useListPackage } from '../hook/useListPackage';
type Props = {
  open: boolean;
  onClose: () => void;
  partnerId: string;
};
const ModalAssignPackage: FC<Props> = ({ open, onClose, partnerId }) => {
  const [form] = Form.useForm();
  const { mutate: assignPackagePermission, isPending: loadingAssignPackage } =
    useAssignPackagePermission();
  const handleCancel = () => {
    form.resetFields();
    onClose();
  };
  const { data: packageOptions } = useListPackage({ page: 0, size: 1000 });
  const handleFinish = (values: Record<string, string[]>) => {
    assignPackagePermission({
      packageCodes: values.package,
      clientId: partnerId,
    });
  };
  const { data: packageCodes } = useGetAssignedPackages(partnerId);
  useEffect(() => {
    if (packageCodes) {
      form.setFieldValue('package', packageCodes);
    }
  }, [form, packageCodes]);
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
        onFinish={handleFinish}
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
          <CButtonSave htmlType="submit" loading={loadingAssignPackage} />
          <CButton type="default">Hủy</CButton>
        </BtnGroupFooter>
      </Form>
    </CModal>
  );
};
export default ModalAssignPackage;
