import { faAnglesDown, faAnglesUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CButton from '@react/commons/Button';
import CInput from '@react/commons/Input';
import { Card, Col, Collapse, Form, Row } from 'antd';
import { useState } from 'react';
import { useCheck5Numbers } from 'apps/Internal/src/modules/ListOfRequestsChangeSim/hooks/useCheck5Numbers';
import values from 'lodash/values';
import { CNumberInput } from '@react/commons/index';

const ContactNumber = ({ isView = false }: { isView?: boolean }) => {
  const form = Form.useFormInstance();
  const variables = Form.useWatch('variables', form);
  const [activeKey, setActiveKey] = useState<string>('1');
  const handleChangeCollapse = () => {
    setActiveKey(activeKey === '1' ? '' : '1');
  };
  const array5PhoneField = [
    'phoneNumber1',
    'phoneNumber2',
    'phoneNumber3',
    'phoneNumber4',
    'phoneNumber5',
  ];
  const { mutate: mutateCheck5Numbers, isPending: isPendingCheck5Numbers } =
    useCheck5Numbers();

  const handleCheck5Numbers = () => {
    form.validateFields(['isdn', ...array5PhoneField]).then((value) => {
      mutateCheck5Numbers(value);
    });
  };

  const ValidPhone = [
    {
      min: 10,
      message: 'Số thuê bao không đúng định dạng',
    },
    {
      max: 11,
      message: 'Số thuê bao không đúng định dạng',
    },
    ({ getFieldsValue }: any) => ({
      validator(rule: any, value: any) {
        if (
          !value ||
          value?.length < 10 ||
          values(getFieldsValue(array5PhoneField))?.filter(
            (item) => item === value
          )?.length < 2
        ) {
          return Promise.resolve();
        }
        return Promise.reject(new Error('Số thuê bao đã tồn tại'));
      },
    }),
  ];

  const checkNumberPhone = (field: string) => {
    return form.getFieldError(field).length > 0 ||
      !variables?.[field] ||
      !form.getFieldValue(field) ||
      isPendingCheck5Numbers
      ? undefined
      : 'Có liên hệ';
  };

  const resetCheckNumberPhone = (field: string) => {
    delete variables[field];
    form.setFieldValue('variables', variables);
  };

  return (
    <fieldset className="bg-white">
      <legend>
        Tra cứu 5 số liên lạc
        <FontAwesomeIcon
          className="cursor-pointer"
          onClick={handleChangeCollapse}
          icon={activeKey === '1' ? faAnglesUp : faAnglesDown}
        />
      </legend>
      <Collapse activeKey={activeKey} ghost>
        <Collapse.Panel showArrow={false} header={null} key="1">
          <Row gutter={12}>
            <Col span={12}>
              <Card hoverable title="Thông tin tra cứu 5 số liên lạc">
                <Form.Item
                  label="Số thuê bao 1"
                  name="phoneNumber1"
                  dependencies={array5PhoneField}
                  rules={ValidPhone}
                  help={checkNumberPhone('phoneNumber1')}
                >
                  <CInput
                    placeholder="Số thuê bao 1"
                    onlyNumber
                    maxLength={11}
                    onChange={() => resetCheckNumberPhone('phoneNumber1')}
                    onBlur={() => resetCheckNumberPhone('phoneNumber1')}
                  />
                </Form.Item>
                <Form.Item
                  label="Số thuê bao 2"
                  name="phoneNumber2"
                  dependencies={array5PhoneField}
                  rules={ValidPhone}
                  help={checkNumberPhone('phoneNumber2')}
                >
                  <CInput
                    placeholder="Số thuê bao 2"
                    onlyNumber
                    maxLength={11}
                    onChange={() => resetCheckNumberPhone('phoneNumber2')}
                    onBlur={() => resetCheckNumberPhone('phoneNumber2')}
                  />
                </Form.Item>
                <Form.Item
                  label="Số thuê bao 3"
                  name="phoneNumber3"
                  dependencies={array5PhoneField}
                  rules={ValidPhone}
                  help={checkNumberPhone('phoneNumber3')}
                >
                  <CInput
                    placeholder="Số thuê bao 3"
                    onlyNumber
                    maxLength={11}
                    onChange={() => resetCheckNumberPhone('phoneNumber3')}
                    onBlur={() => resetCheckNumberPhone('phoneNumber3')}
                  />
                </Form.Item>
                <Form.Item
                  label="Số thuê bao 4"
                  name="phoneNumber4"
                  dependencies={array5PhoneField}
                  rules={ValidPhone}
                  help={checkNumberPhone('phoneNumber4')}
                >
                  <CInput
                    placeholder="Số thuê bao 4"
                    onlyNumber
                    maxLength={11}
                    onChange={() => resetCheckNumberPhone('phoneNumber4')}
                    onBlur={() => resetCheckNumberPhone('phoneNumber4')}
                  />
                </Form.Item>
                <Form.Item
                  label="Số thuê bao 5"
                  name="phoneNumber5"
                  dependencies={array5PhoneField}
                  rules={ValidPhone}
                  help={checkNumberPhone('phoneNumber5')}
                >
                  <CInput
                    placeholder="Số thuê bao 5"
                    onlyNumber
                    maxLength={11}
                    onChange={() => resetCheckNumberPhone('phoneNumber5')}
                    onBlur={() => resetCheckNumberPhone('phoneNumber5')}
                  />
                </Form.Item>
                <div className="flex justify-center">
                  <CButton
                    className="w-40"
                    onClick={handleCheck5Numbers}
                    loading={isPendingCheck5Numbers}
                    disabled={false}
                  >
                    Tra cứu
                  </CButton>
                </div>
              </Card>
            </Col>
            <Col span={12}>
              <Card hoverable title="Thông tin khác">
                <Form.Item
                  label="Số tiền còn lại trong tài khoản chính"
                  name="balance"
                >
                  <CNumberInput
                    placeholder="Nhập thông tin số tiền còn lại trong tài khoản chính"
                    maxLength={10}
                    addonAfter="VND"
                    disabled={isView}
                  />
                </Form.Item>
                <Form.Item label="Gói cước" name="dataPackage">
                  <CInput
                    placeholder="Nhập tên thông tin gói cước"
                    maxLength={100}
                  />
                </Form.Item>
                <Form.Item
                  label="DV GTGT đang sử dụng"
                  name="valueAddedService"
                >
                  <CInput
                    placeholder="Nhập tên DV GTGT đang sử dụng"
                    maxLength={100}
                  />
                </Form.Item>
                <Form.Item
                  label="Thời gian nạp tiền gần nhất"
                  name="lastCardRechargeTime"
                >
                  <CInput
                    placeholder="Nhập thời gian nạp tiền gần nhất"
                    maxLength={100}
                  />
                </Form.Item>
                <Form.Item
                  label="Mệnh giá nạp gần nhất"
                  name="lastCardRechargeValue"
                >
                  <CNumberInput
                    placeholder="Nhập mệnh giá nạp gần nhất"
                    maxLength={10}
                    addonAfter="VND"
                    disabled={isView}
                  />
                </Form.Item>
              </Card>
            </Col>
          </Row>
        </Collapse.Panel>
      </Collapse>
      <Form.Item label="" name="variables" hidden />
    </fieldset>
  );
};

export default ContactNumber;
