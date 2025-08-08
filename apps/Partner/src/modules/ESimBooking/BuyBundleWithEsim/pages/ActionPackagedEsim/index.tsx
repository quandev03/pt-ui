import {
  CButtonClose,
  CButtonSaveAndAdd,
  CInput,
  CSelect,
  IModeAction,
  TitleHeader,
} from '@vissoft-react/common';
import { Col, Form, Row } from 'antd';
import { memo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLogicActionPackagedEsim } from './useLogicActionPackagedEsim';

export const ActionPackagedESim = memo(() => {
  const { id } = useParams();
  console.log('🚀 ~ id:', id);
  const {
    Title,
    actionMode,
    handleClose,
    handleFinish,
    bookingInProcess,
    form,
    packageOptions,
    getPackagedEsimList,
  } = useLogicActionPackagedEsim();

  useEffect(() => {
    if (actionMode === IModeAction.READ && getPackagedEsimList?.content && id) {
      const esimData = getPackagedEsimList.content.find(
        (item: { id: string }) => item.id === id
      );
      if (esimData) {
        form.setFieldsValue({
          quantity: esimData.quantity || '',
          packageCode: esimData.pckCode || '',
        });
      }
    }
  }, [actionMode, getPackagedEsimList, id, form]);

  useEffect(() => {
    if (actionMode === IModeAction.CREATE && packageOptions?.length === 1) {
      form.setFieldsValue({ packageCode: packageOptions[0].value });
    }
  }, [packageOptions, actionMode, form]);

  return (
    <div className="flex flex-col w-full h-full">
      <TitleHeader>{Title}</TitleHeader>
      <Form
        form={form}
        onFinish={handleFinish}
        labelCol={{ span: 5 }}
        colon={false}
        labelAlign="left"
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
          <Col span={12}></Col>
          <Col span={12}>
            <Form.Item label="Gói cước miễn phí" name="packageCode">
              <CSelect
                placeholder="Chọn gói cước"
                disabled={actionMode === IModeAction.READ}
                options={packageOptions}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Gói cước có phí"
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
