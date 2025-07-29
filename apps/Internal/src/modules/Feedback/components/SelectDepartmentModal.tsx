import { Form } from 'antd';
import validateForm from '@react/utils/validator';
import { CModal, CSelect } from '@react/commons/index';
import useFeedbackStore from '../store';
import { useGetDepartments } from '../../UserManagement/queryHooks';
import { useState } from 'react';
import { useActiveUserByDepartment } from '../queryHooks';
import { debounce } from 'lodash';

interface IProp {
  onSubmit: (values: any, ids: string[]) => void;
  confirmLoading: boolean;
}

const SelectDepartmentModal: React.FC<IProp> = ({
  onSubmit,
  confirmLoading,
}) => {
  const [form] = Form.useForm();
  const { modalIds, setOpenDepartmentModal } = useFeedbackStore();
  const { data: INTERNAL_DEPARTMENT = [] } = useGetDepartments();
  const [userByDepartment, setUserByDepartment] = useState<any[]>([]);
  const { mutate: getUserByDepartment } = useActiveUserByDepartment(
    (data: any) => {
      setUserByDepartment(data);
    }
  );
  const handleFinish = (values: any) => {
    onSubmit(values, modalIds as string[]);
  };

  const handleGetUserByDepartment = (value: string) => {
    getUserByDepartment({ departmentCode: value });
  };

  const handleCancel = () => {
    // setIsOpen(false);
    setOpenDepartmentModal(false, []);
    form.resetFields();
  };
  const handleApprove = debounce(() => {
    form.submit();
  }, 700);
  return (
    <CModal
      open={true}
      title="Chọn phòng ban xử lý"
      okText="Xác nhận"
      cancelText="Huỷ"
      onOk={handleApprove}
      onCancel={handleCancel}
      className="modal-body-shorten"
      confirmLoading={confirmLoading}
    >
      <Form
        form={form}
        labelCol={{ span: 6 }}
        colon={false}
        onFinish={handleFinish}
      >
        <Form.Item
          label="Phòng ban"
          name="departmentCode"
          rules={[validateForm.required]}
        >
          <CSelect
            onChange={handleGetUserByDepartment}
            placeholder="Chọn phòng ban"
            options={INTERNAL_DEPARTMENT.map((e) => ({ ...e, value: e?.code }))}
          />
        </Form.Item>
        <Form.Item name="processor" label={'Người xử lý'}>
          <CSelect
            options={userByDepartment?.map((e) => ({
              label: e?.username,
              value: e?.email || e?.username,
            }))}
            placeholder="Người xử lý"
          />
        </Form.Item>
      </Form>
    </CModal>
  );
};

export default SelectDepartmentModal;
