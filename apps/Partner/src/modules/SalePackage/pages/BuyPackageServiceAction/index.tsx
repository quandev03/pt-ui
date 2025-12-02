import {
  CButton,
  CButtonClose,
  CSelect,
  TitleHeader,
  validateForm,
} from '@vissoft-react/common';
import { Col, Form, Radio, Row } from 'antd';
import { useLogicBuyPackageService } from './useLogicBuyPackageService';

export const BuyPackageServiceAction = () => {
  const {
    form,
    packageOptions,
    loadingOptions,
    loadingSubmit,
    handleSubmit,
    handleCancel,
  } = useLogicBuyPackageService();

  return (
    <div className="flex flex-col w-full h-full">
      <TitleHeader>Mua gói cước</TitleHeader>
      <Form
        form={form}
        layout="vertical"
        className="bg-white rounded-[10px] px-6 pt-4 pb-8"
        initialValues={{
          paymentMethod: 'cash',
        }}
        onFinish={handleSubmit}
      >
        <Row gutter={[30, 0]}>
          <Col span={12}>
            <Form.Item
              name="packageProfileId"
              label="Gói cước"
              rules={[validateForm.required]}
            >
              <CSelect
                placeholder="Chọn gói cước"
                options={packageOptions}
                loading={loadingOptions}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="paymentMethod"
              label="Phương thức thanh toán"
              rules={[validateForm.required]}
            >
              <Radio.Group>
                <Radio value="cash">Tiền mặt</Radio>
                <Radio value="bank">Chuyển khoản</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <div className="flex gap-4 flex-wrap justify-end mt-7">
          <CButton
            loading={loadingSubmit}
            onClick={() => {
              form.submit();
            }}
          >
            Mua gói
          </CButton>
          <CButtonClose onClick={handleCancel} />
        </div>
      </Form>
    </div>
  );
};
