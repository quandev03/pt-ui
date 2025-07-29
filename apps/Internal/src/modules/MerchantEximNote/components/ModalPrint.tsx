import { faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CButtonClose } from '@react/commons/Button';
import { Button, CInput, CModal, DebounceSelect } from '@react/commons/index';
import validateForm from '@react/utils/validator';
import { Form } from 'antd';
import { useState } from 'react';
import { useMutateDetailUser } from '../hooks/useDetailUser';
import { useMutateListUser } from '../hooks/useListUser';
import { usePrintReport } from '../hooks/usePrintReport';

export interface Props {
  isOpen: boolean;
  id: string | undefined;
  setIsOpen: (value: boolean) => void;
}

const ModalPrint: React.FC<Props> = ({ isOpen, setIsOpen, id }) => {
  const [form] = Form.useForm();
  const [selectedUser, setSelectedUser] = useState<any>();
  const { mutate: mutatePrint, isPending: isLoadingPrint } = usePrintReport();
  const { mutateAsync: mutateListUser } = useMutateListUser();
  const { mutateAsync: mutateDetailUser } = useMutateDetailUser();
  const handleCancel = () => {
    setIsOpen(false);
    form.resetFields();
  };
  const handleFinish = (values: any) => {
    if (!id) return;
    mutatePrint({ ...values, ...selectedUser, id: +id });
  };
  const handleSelectUser = (value: string) => {
    if (!value) return;
    mutateDetailUser(value, {
      onSuccess: ({ fullname, email, phoneNumber, positionTitle }: any) =>
        setSelectedUser({
          fullName: fullname,
          email,
          phone: phoneNumber,
          position: positionTitle,
        }),
    });
  };
  return (
    <CModal
      title={'Thông tin bàn giao'}
      open={isOpen}
      loading={isLoadingPrint}
      width={540}
      onCancel={handleCancel}
      className="modal-body-shorten"
      footer={[
        <CButtonClose type="default" htmlType="reset" onClick={handleCancel}>
          Đóng
        </CButtonClose>,
        <Button
          icon={<FontAwesomeIcon icon={faSave} />}
          onClick={form.submit}
          htmlType="submit"
        >
          Xác nhận
        </Button>,
      ]}
    >
      <Form
        form={form}
        onFinish={handleFinish}
        colon={false}
        initialValues={{ sender: 'Trung tâm viễn thông VNSKY' }}
        labelCol={{ prefixCls: 'w-[155px]' }}
      >
        <Form.Item
          label={'Bên giao'}
          name="sender"
          rules={[validateForm.required]}
        >
          <CInput maxLength={50} placeholder="Bên giao" />
        </Form.Item>
        <Form.Item
          label={'Bên nhận'}
          name="receiver"
          rules={[validateForm.required]}
        >
          <CInput maxLength={50} placeholder="Bên nhận" />
        </Form.Item>
        <Form.Item
          label={'Người nhận bàn giao'}
          name="handover"
          rules={[validateForm.required]}
        >
          <DebounceSelect
            placeholder="Người nhận bàn giao"
            fetchOptions={mutateListUser}
            //@ts-ignore
            onSelect={handleSelectUser}
          />
        </Form.Item>
      </Form>
    </CModal>
  );
};

export default ModalPrint;
