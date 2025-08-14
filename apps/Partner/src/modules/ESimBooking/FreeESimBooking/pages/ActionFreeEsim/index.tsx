import {
  AnyElement,
  CButton,
  CInputNumber,
  CSelect,
  CTextArea,
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

  useEffect(() => {
    if (actionMode === IModeAction.CREATE && packageOptions?.length === 1) {
      form.setFieldsValue({ packageCode: packageOptions[0].value });
    }
  }, [packageOptions, actionMode, form]);

  return (
    <div className="flex flex-col w-full h-full">
      <TitleHeader>{Title}</TitleHeader>
      <Form form={form} onFinish={handleFinish} colon={false} labelAlign="left">
        <Row gutter={[24, 0]}>
          <Col span={12}>
            <Form.Item
              label="Số lượng eSIM"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              name="quantity"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập số lượng eSIM mong muốn',
                },
                {
                  type: 'number',
                  max: 9999999999, // Giới hạn là số có 10 chữ số
                  message: 'Số lượng không được vượt quá 10 chữ số',
                },
                {
                  type: 'number',
                  min: 1,
                  message: 'Số lượng phải lớn hơn 0',
                },
              ]}
            >
              <CInputNumber
                placeholder="Nhập số lượng eSIM"
                disabled={actionMode === IModeAction.READ}
                style={{ width: '100%' }}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={(value: AnyElement) => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Gói cước"
              name="packageCode"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
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
          <Col span={24}>
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
        <div className="flex gap-4 flex-wrap justify-end mt-7">
          {actionMode === IModeAction.CREATE && (
            <CButton
              onClick={() => {
                form.submit();
              }}
              loading={bookingInProcess}
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
