import { ACTION_MODE_ENUM } from '@react/commons/types';
import { Form, Row, Space } from 'antd';
import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CButtonClose,
  CButtonDelete,
  CButtonEdit,
  CButtonSave,
  CButtonSaveAndAdd,
} from '../Button';

interface Props {
  actionMode: ACTION_MODE_ENUM;
  handleDelete?: () => void;
  onSubmit: (values: any, isSaveAndAdd?: boolean) => void;
  handleEdit?: () => void;
}

const FormFooterDetail: FC<Props> = React.memo(
  ({ actionMode, handleDelete, handleEdit, onSubmit }) => {
    const form = Form.useFormInstance();
    const navigate = useNavigate();
    const handleCancel = () => {
      navigate(-1);
    };

    const handleSaveAndAdd = () => {
      const values = form.getFieldsValue();
      form.validateFields().then(() => onSubmit(values, true));
    };
    return (
      <Row justify="end" className="mt-4">
        <Space size="middle">
          {actionMode === ACTION_MODE_ENUM.CREATE && (
            <>
              <CButtonSaveAndAdd onClick={handleSaveAndAdd} />
              <CButtonSave htmlType="submit">Lưu</CButtonSave>
              <CButtonClose type="default" onClick={handleCancel}>
                Đóng
              </CButtonClose>
            </>
          )}
          {actionMode === ACTION_MODE_ENUM.VIEW && (
            <>
              {handleDelete && (
                <CButtonDelete onClick={handleDelete}>Xóa</CButtonDelete>
              )}
              <CButtonEdit onClick={handleEdit}>Sửa</CButtonEdit>
              <CButtonClose type="default" onClick={handleCancel}>
                Đóng
              </CButtonClose>
            </>
          )}
          {actionMode === ACTION_MODE_ENUM.EDIT && (
            <>
              <CButtonSave htmlType="submit">Lưu</CButtonSave>
              <CButtonClose type="default" onClick={handleCancel}>
                Đóng
              </CButtonClose>
            </>
          )}
        </Space>
      </Row>
    );
  }
);

export default FormFooterDetail;
