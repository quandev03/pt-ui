import { CButtonClose } from '@react/commons/Button';
import { Button } from '@react/commons/index';
import CSelect from '@react/commons/Select';
import { Form } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useGetUsersByPermission } from 'apps/Internal/src/hooks/useGetUsersByPermission';
import { Key, useEffect } from 'react';
import { StyledModal } from '../page/style';
import { useAssignFn } from '../queryHook/useAssign';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

type Props = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  selectedRowKeys: Key[];
  setSelectedRowKeys: (value: Key[]) => void;
};
const AssignModal: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  selectedRowKeys,
  setSelectedRowKeys,
}) => {
  const [form] = useForm();
  const { data: dataUserApprove } = useGetUsersByPermission({
    permission: [
      'ACTIVATION_APPROVE_LIST:APPROVE',
      'ACTIVATION_APPROVE_LIST:REJECT',
    ],
  });
  // useGetAllUsers({ isPartner: true, clientIdentity: 'VNSKY' }  );
  const fullnamesOptions = dataUserApprove?.map((user) => ({
    label: user.username,
    value: user.username,
  }));
  const { mutate: assignFn } = useAssignFn(form);
  const handleCancel = () => {
    setIsOpen(false);
    form.resetFields();
  };

  useEffect(() => {
    // console.log(selectedRowKeys)
  });
  const handleFinish = () => {
    assignFn(form.getFieldsValue());
    // console.log(form.getFieldsValue());
    setSelectedRowKeys([]);
    setIsOpen(false);
  };
  return (
    <StyledModal
      title={'Phân công tiền kiểm hồ sơ'}
      open={isOpen}
      onCancel={handleCancel}
      footer={[
        <CButtonClose type="default" onClick={handleCancel}>
          Đóng
        </CButtonClose>,
        <Button
          htmlType="submit"
          onClick={() => {
            form.setFieldValue('listIds', selectedRowKeys);
            form.submit();
          }}
          icon={<FontAwesomeIcon icon={faUser} />}
        >
          Phân công
        </Button>,
      ]}
    >
      <Form form={form} colon={false} onFinish={handleFinish}>
        <Form.Item label="" name="listIds" hidden />
        <Form.Item
          label="User tiền kiểm"
          name="approveUser"
          rules={[
            {
              required: true,
              message: 'Không được để trống trường này',
            },
          ]}
        >
          <CSelect
            placeholder="Chọn user tiền kiểm"
            options={fullnamesOptions}
            showSearch
          />
        </Form.Item>
      </Form>
    </StyledModal>
  );
};
export default AssignModal;
