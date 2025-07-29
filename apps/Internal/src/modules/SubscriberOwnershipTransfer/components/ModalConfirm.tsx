import { faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CButtonClose } from '@react/commons/Button';
import { Button, CModal, CSelect } from '@react/commons/index';
import validateForm from '@react/utils/validator';
import { Form } from 'antd';
import React from 'react';
import { DocumentOptions } from '../constants';

export interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  data: undefined;
  onSubmit: (values: any, handleCancel: () => void) => void;
  handleCancel: () => void;
  isLoading?: boolean;
}

const ModalConfirm: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  onSubmit,
  handleCancel,
  isLoading,
}) => {
  const [form] = Form.useForm();
  const handleFinish = (values: any) => {
    onSubmit(values, handleCancel);
  };

  return (
    <CModal
      title={'Chuyển hồ sơ'}
      open={isOpen}
      width={500}
      onCancel={handleCancel}
      className="modal-body-shorten"
      destroyOnClose={true}
      footer={[
        <CButtonClose
          type="default"
          htmlType="reset"
          loading={isLoading}
          onClick={handleCancel}
        >
          Hủy
        </CButtonClose>,
        <Button
          icon={<FontAwesomeIcon icon={faSave} />}
          onClick={handleFinish}
          loading={isLoading}
        >
          Xác nhận
        </Button>,
      ]}
    >
      <Form form={form} colon={false} layout="vertical">
        <Form.Item
          label={'Chọn hồ sơ'}
          name="profileType"
          rules={[validateForm.required]}
          className="mb-0"
        >
          <CSelect placeholder="Chọn hồ sơ" options={DocumentOptions} />
        </Form.Item>
      </Form>
    </CModal>
  );
};

export default ModalConfirm;
