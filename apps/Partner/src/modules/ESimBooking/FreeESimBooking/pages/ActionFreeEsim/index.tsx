import {
  CButtonClose,
  CButtonSaveAndAdd,
  CInput,
  CSelect,
  IModeAction,
  TitleHeader,
  usePermissions,
} from '@vissoft-react/common';
import useConfigAppStore from '../../../../Layouts/stores';
import { memo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLogicActionUser } from './useLogicActionFreeEsim';
import { Col, Form, Row } from 'antd';

export const ActionFreeEsim = memo(() => {
  // const navigate = useNavigate();
  // const { id } = useParams();
  // const { menuData } = useConfigAppStore();
  // const permission = usePermissions(menuData);
  const { Title, actionMode, handleClose } = useLogicActionUser();
  return (
    <div className="flex flex-col w-full h-full">
      <TitleHeader>{Title}</TitleHeader>
      <Form
        form={undefined}
        onFinish={undefined}
        labelCol={{ span: 5 }}
        colon={false}
      >
        <Row gutter={[24, 0]}>
          <Col span={12}>
            <Form.Item
              label="Số lượng eSIM"
              name="numberOfEsim"
              required={true}
            >
              <CInput />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Gói cước" name="package" required={true}>
              <CSelect disabled={!!IModeAction.READ} />
            </Form.Item>
          </Col>
        </Row>
        <div className="flex gap-4 flex-wrap justify-end mt-7">
          {actionMode === IModeAction.CREATE && (
            <CButtonSaveAndAdd
              onClick={() => {
                // form.submit();
              }}
              // loading={loadingAdd || loadingUpdate}
              disabled={!!IModeAction.READ}
            />
          )}
          <CButtonClose onClick={handleClose} />
        </div>
      </Form>
    </div>
  );
});
