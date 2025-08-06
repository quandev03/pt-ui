import {
  CButtonClose,
  CButtonSaveAndAdd,
  CInput,
  CSelect,
  IModeAction,
  TitleHeader,
} from '@vissoft-react/common';
import { memo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLogicActionUser } from './useLogicActionFreeEsim';
import { Col, Form, Row } from 'antd';

export const ActionFreeEsim = memo(() => {
  const { id } = useParams();
  const {
    Title,
    actionMode,
    handleClose,
    handleFinish,
    bookingInProcess,
    form,
    getFreeEsimList,
    packageOptions,
  } = useLogicActionUser();

  useEffect(() => {
    if (actionMode === IModeAction.READ && getFreeEsimList?.content && id) {
      const esimData = getFreeEsimList.content.find(
        (item: { id: string }) => item.id === id
      );
      if (esimData) {
        form.setFieldsValue({
          quantity: esimData.quantity || '',
          packageCode: esimData.pckCode || '',
        });
      }
    }
  }, [actionMode, getFreeEsimList, id, form]);

  return (
    <div className="flex flex-col w-full h-full">
      <TitleHeader>{Title}</TitleHeader>
      <Form
        form={form}
        onFinish={handleFinish}
        labelCol={{ span: 5 }}
        colon={false}
      >
        <Row gutter={[24, 0]}>
          <Col span={12}>
            <Form.Item
              label="Số lượng eSIM"
              name="quantity"
              required
              rules={[
                {
                  validator(_, value) {
                    if (!value) {
                      return Promise.reject(
                        'Vui lòng chọn số lượng eSIM mong muốn'
                      );
                    } else {
                      return Promise.resolve();
                    }
                  },
                },
              ]}
            >
              <CInput
                placeholder="Nhập số lượng eSIM"
                disabled={actionMode === IModeAction.READ}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Gói cước"
              name="packageCode"
              required
              rules={[
                {
                  validator(_, value) {
                    if (!value) {
                      return Promise.reject('Vui lòng chọn gọi cước mong muốn');
                    } else {
                      return Promise.resolve();
                    }
                  },
                },
              ]}
            >
              <CSelect
                placeholder="Chọn gói cước"
                disabled={actionMode === IModeAction.READ}
                options={packageOptions}
              />
            </Form.Item>
          </Col>
        </Row>
        <div className="flex gap-4 flex-wrap justify-end mt-7">
          {actionMode === IModeAction.CREATE && (
            <CButtonSaveAndAdd
              onClick={() => {
                form.submit();
              }}
              loading={bookingInProcess}
            />
          )}
          <CButtonClose onClick={handleClose} />
        </div>
      </Form>
    </div>
  );
});
