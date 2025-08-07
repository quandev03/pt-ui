import { useActionMode } from '@vissoft-react/common';
import { Form } from 'antd';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useLogicBulkSalePackageAction = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const actionMode = useActionMode();

  const handleCancel = useCallback(() => {
    form.resetFields();
  }, [form]);

  const handleClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return {
    form,
    actionMode,
    handleClose,
    handleCancel,
  };
};
