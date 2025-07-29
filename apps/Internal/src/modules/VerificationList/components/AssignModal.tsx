import { CButtonClose } from '@react/commons/Button';
import { Button } from '@react/commons/index';
import CSelect from '@react/commons/Select';
import { MESSAGE } from '@react/utils/message';
import { Form } from 'antd';
import { useForm } from 'antd/es/form/Form';
import ModalConfirm from 'apps/Internal/src/components/modalConfirm';
import { useGetUsersByPermission } from 'apps/Internal/src/hooks/useGetUsersByPermission';
import { Key, useCallback } from 'react';
import { useAssign } from '../hooks/useAssign';
import { StyledModal } from '../page/styled';

type Props = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  ids: Key[];
  setSelectedRowKeys: (keys: Key[]) => void;
  resetFormSelect: () => void;
};
const AssignModal: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  ids,
  setSelectedRowKeys,
  resetFormSelect,
}) => {
  const [form] = useForm();
  const { data } = useGetUsersByPermission({
    permission: ['CENSORSHIP_LIST_STAFF:*'],
  });
  const onSuccess = useCallback(() => {
    setIsOpen(false);
    setSelectedRowKeys([]);
    form.resetFields();
    resetFormSelect();
  }, []);
  const { mutate: assignSubDoc } = useAssign(onSuccess);
  const handleCancel = () => {
    if (form.getFieldValue('assignUserName') !== undefined) {
      ModalConfirm({
        message: 'Bạn có chắc muốn đóng không?',
        handleConfirm() {
          setIsOpen(false);
          form.resetFields();
        },
      });
    } else {
      setIsOpen(false);
      form.resetFields();
    }
  };
  const handleFinish = () => {
    const assignUserId = form.getFieldValue('assignUserName');
    const assignUsername =
      (data && data.find((item) => item.id === assignUserId)?.username) || '';
    const payload = {
      ids: ids,
      assignUserId: assignUserId,
      assignUserName: assignUsername,
    };
    assignSubDoc(payload);
  };
  return (
    <StyledModal
      title={'Phân công kiểm duyệt'}
      open={isOpen}
      onCancel={handleCancel}
      footer={[
        <CButtonClose type="default" onClick={handleCancel}>
          Đóng
        </CButtonClose>,
        <Button htmlType="submit" onClick={() => form.submit()}>
          Phân công
        </Button>,
      ]}
    >
      <Form form={form} colon={false} onFinish={handleFinish}>
        <Form.Item
          label="User kiểm duyệt"
          rules={[{ required: true, message: MESSAGE.G06 }]}
          name={'assignUserName'}
        >
          <CSelect
            options={data}
            fieldNames={{ label: 'username', value: 'id' }}
            filterOption={(input, options: any) =>
              (options?.username ?? '')
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            showSearch
          />
        </Form.Item>
      </Form>
    </StyledModal>
  );
};
export default AssignModal;
