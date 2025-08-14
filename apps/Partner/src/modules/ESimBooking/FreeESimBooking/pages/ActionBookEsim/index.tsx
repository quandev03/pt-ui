import {
  AnyElement,
  CButton,
  CInputNumber,
  CTextArea,
  IModeAction,
  TitleHeader,
} from '@vissoft-react/common';
import { Col, Form, Row } from 'antd';
import { memo } from 'react';
import { useLogicActionPackagedEsim } from './useLogicActionPackagedEsim';
import EsimPackagedBookForm from '../../components/EsimPackagedBookForm';

export const ActionPackagedEsim = memo(() => {
  const { Title, form, handleClose, actionMode } = useLogicActionPackagedEsim();

  return (
    <div className="flex flex-col w-full h-full">
      <TitleHeader>{Title}</TitleHeader>
      <Form form={form} onFinish={undefined} colon={false} labelAlign="left">
        <Row gutter={[24, 0]}>
          {actionMode === IModeAction.CREATE && (
            <>
              <Col span={12}>
                <Form.Item
                  label="Hạn mức tạm tính"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  name="quantity"
                >
                  <CInputNumber
                    disabled
                    style={{ width: '100%' }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={(value: AnyElement) =>
                      value.replace(/\$\s?|(,*)/g, '')
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Hạn mức với MBF"
                  name="packageCode"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                >
                  <CInputNumber
                    disabled
                    style={{ width: '100%' }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={(value: AnyElement) =>
                      value.replace(/\$\s?|(,*)/g, '')
                    }
                  />
                </Form.Item>
              </Col>
            </>
          )}
          <Col span={24} style={{ marginTop: 11 }}>
            <Form.Item
              label="Ghi chú"
              name="description"
              labelCol={{ span: 3 }}
            >
              <CTextArea
                placeholder="Nhập ghi chú"
                disabled={actionMode === IModeAction.READ}
                rows={4}
              />
            </Form.Item>
          </Col>
        </Row>

        <div className="bg-white p-5 rounded-md mt-4">
          <EsimPackagedBookForm />
        </div>
        <div className="flex gap-4 flex-wrap justify-end mt-7">
          {actionMode === IModeAction.CREATE && (
            <CButton
              onClick={() => {
                form.submit();
              }}
              loading={undefined}
            >
              Thực hiện
            </CButton>
          )}
          <CButton onClick={handleClose} type="default">
            Hủy
          </CButton>
        </div>
      </Form>
    </div>
  );
});
