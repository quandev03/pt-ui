import CInput from '@react/commons/Input';
import { Col, Form, Row } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { cleanUpString } from 'apps/Partner/src/helpers';
import validateForm from 'apps/Partner/src/utils/validator';
import { memo } from 'react';

const CustomerInfor = () => {
  const form = Form.useFormInstance();

  const customerTaxCode: string = useWatch('customerTaxCode', form) ?? '';

  return (
    <Row gutter={[30, 0]}>
      <Col span={12}>
        <Form.Item
          label="Khách hàng"
          name="customerName"
          required
          rules={[validateForm.required]}
        >
          <CInput
            placeholder="Nhập họ và tên"
            maxLength={100}
            disabled
            onBlur={() => {
              const value = form.getFieldValue('customerName');
              form.setFieldValue('customerName', cleanUpString(value));
              form.validateFields(['customerName']);
            }}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="Số điện thoại"
          name="customerPhone"
          required
          rules={[validateForm.required]}
        >
          <CInput
            placeholder="Nhập số điện thoại"
            onlyNumber
            preventSpace
            maxLength={12}
            minLength={12}
            disabled
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="Mã số thuế"
          name="customerTaxCode"
          required
          rules={[validateForm.required]}
        >
          <CInput
            placeholder="Nhập mã số thuế"
            maxLength={customerTaxCode.includes('-') ? 14 : 13}
            disabled
            onlyNumber
            preventSpace
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="Địa chỉ GPĐKKD" name="businessLicenseAddress">
          <CInput placeholder="Nhập địa chỉ GPĐKKD" maxLength={200} disabled />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default memo(CustomerInfor);
