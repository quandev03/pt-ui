import CInput from '@react/commons/Input';
import { RegOnlyNum } from '@react/constants/regex';
import { handleKeyDowNumber } from '@react/helpers/utils';
import validateForm from '@react/utils/validator';
import { Col, Form, Row } from 'antd';
import { RegexOnlyTextAndSpace } from 'apps/Internal/src/constants/regex';
import { usePrefixIsdnRegex } from 'apps/Internal/src/hooks/usePrefixIsdnQuery';
import { memo } from 'react';

const CustomerInfor = () => {
  const prefixIsdn = usePrefixIsdnRegex();

  return (
    <Row gutter={[30, 0]}>
      <Col span={12}>
        <Form.Item
          label="Khách hàng"
          name="customerName"
          required
          rules={[
            {
              validator(_, value) {
                if (!value) {
                  return Promise.reject('Không được để trống trường này');
                } else if (!RegexOnlyTextAndSpace.test(value)) {
                  return Promise.reject('Họ và tên không đúng định dạng');
                } else {
                  return Promise.resolve();
                }
              },
            },
          ]}
        >
          <CInput placeholder="Nhập họ và tên" maxLength={100} disabled />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="Số điện thoại"
          name="customerPhone"
          required
          rules={[validateForm.required, prefixIsdn]}
        >
          <CInput
            placeholder="Nhập số điện thoại"
            disabled
            onlyNumber
            preventSpace
            maxLength={12}
            minLength={12}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="Mã số thuế"
          name="customerTaxCode"
          required
          rules={[
            {
              validator(_, value) {
                if (!value) {
                  return Promise.reject('Không được để trống trường này');
                } else if (!RegOnlyNum.test(value)) {
                  return Promise.reject('Mã số thuế chưa đúng định dạng');
                } else {
                  return Promise.resolve();
                }
              },
            },
          ]}
        >
          <CInput
            placeholder="Nhập mã số thuế"
            maxLength={13}
            disabled
            onKeyDown={handleKeyDowNumber}
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
