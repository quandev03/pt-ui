import { Form, Row, Space } from 'antd';
import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CButtonClose,
  CButtonDelete,
  CButtonEdit,
  CButtonSave,
  CButtonSaveAndAdd,
  IModeAction,
} from '@vissoft-react/common';

interface Props {
  actionMode: IModeAction;
  handleDelete?: () => void;
  onSubmit: (values: any, isSaveAndAdd?: boolean) => void;
}

const FormFooterDetail: FC<Props> = React.memo(
  ({ actionMode, handleDelete, onSubmit }) => {
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
          {actionMode === IModeAction.CREATE && (
            <>
              <CButtonSaveAndAdd onClick={handleSaveAndAdd} />
              <CButtonSave htmlType="submit">Lưu</CButtonSave>
              <CButtonClose type="default" onClick={handleCancel}>
                Đóng
              </CButtonClose>
            </>
          )}
          {actionMode === IModeAction.READ && (
            <>
              {handleDelete && (
                <CButtonDelete onClick={handleDelete}>Xóa</CButtonDelete>
              )}
              <CButtonEdit htmlType="submit">Sửa</CButtonEdit>
              <CButtonClose type="default" onClick={handleCancel}>
                Đóng
              </CButtonClose>
            </>
          )}
          {actionMode === IModeAction.UPDATE && (
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
