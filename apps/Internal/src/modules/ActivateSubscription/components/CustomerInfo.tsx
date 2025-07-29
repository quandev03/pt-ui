import { Col, Form, Row } from 'antd';
import { CInput, CSelect } from '../../../../../../commons/src/lib/commons';
import validateForm from '@react/utils/validator';
import useActiveSubscriptStore from '../store';
import { useGenCustomerCode } from '../hooks/useGenCustomerCode';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useCheckSerialSim } from '../hooks/useCheckSerialSim';
import delay from 'lodash/delay';
import { useLocation, useSearchParams } from 'react-router-dom';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useEnterprisesList } from '../hooks/useListEnterprises';
import { usePrefixIsdnRegex } from 'apps/Internal/src/hooks/usePrefixIsdnQuery';
import { decodeSearchParams } from '@react/helpers/utils';

const ThongTinKichHoat = () => {
  const form = Form.useFormInstance();
  const intl = useIntl();
  const prefixIsdn = usePrefixIsdnRegex();
  const location = useLocation();
  const { dataActivateInfo } = useActiveSubscriptStore();
  const { mutate: mutateCheckSerialSim } = useCheckSerialSim();
  const { data: dataGenCustomerCode } = useGenCustomerCode(dataActivateInfo.id);
  const { data: dataEnterprises } = useEnterprisesList();
  const enterprisesOptions = dataEnterprises?.map((item: any) => ({
    label: item.enterpriseName,
    value: item.id,
  }));

  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  useEffect(() => {
    if (params.phone && params.serialSim) {
      form.setFieldsValue({
        phone: params.phone,
        serialSim: params.serialSim,
      });
      handleCheckSerialSim();
    }
  }, [params.phone, params.serialSim]);

  const [isMyInputFocusedSerialSim, setIsMyInputFocusedSerialSim] =
    useState(true);
  const [isMyInputFocusedPhone, setIsMyInputFocusedPhone] = useState(true);

  useEffect(() => {
    form.setFieldsValue({
      customerId: dataGenCustomerCode?.customerCode,
    });
  }, [dataGenCustomerCode?.customerCode]);

  useEffect(() => {
    if (!isMyInputFocusedSerialSim && !isMyInputFocusedPhone) {
      handleCheckSerialSim();
    }
  }, [isMyInputFocusedSerialSim, isMyInputFocusedPhone]);

  const handleCheckSerialSim = () => {
    form.validateFields(['phone', 'serialSim']).then((value) => {
      mutateCheckSerialSim({
        serial: value.serialSim,
        isdn: value.phone.substring(1),
      });
    });
  };

  const handleCheckNumberPhone = (e: any) => {
    const value = e.target.value.trim();
    if (value.startsWith('84')) {
      form.setFieldValue('phone', value.replace('84', '0'));
      form.validateFields(['phone']);
    } else if (
      !value.startsWith('0') &&
      value.length > 0 &&
      value.length < 11
    ) {
      form.setFieldValue('phone', '0' + value);
      form.validateFields(['phone']);
    } else if (value.length === 11) {
      form.setFields([
        {
          name: 'phone',
          errors: [
            'Số thuê bao ' +
              intl.formatMessage({
                id: 'validator.errFormat',
              }),
          ],
        },
      ]);
      return;
    }
  };

  return (
    <fieldset>
      <legend>Thông tin khách hàng</legend>
      <Row gutter={12}>
        {location.pathname ===
          pathRoutes.enterpriseCustomerManagementH2HActive && (
          <>
            <Col span={12}>
              <Form.Item
                label="Chọn doanh nghiệp"
                name="enterpriseId"
                rules={[validateForm.required]}
              >
                <CSelect
                  options={enterprisesOptions}
                  placeholder="Chọn doanh nghiệp"
                ></CSelect>
              </Form.Item>
            </Col>
            <Col span={12}></Col>
          </>
        )}
        <Col span={12}>
          <Form.Item label="Số hợp đồng/BBXN" name="contractNo" hidden>
            <CInput disabled={true} placeholder="Số hợp đồng" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Mã KH" name="customerId" hidden>
            <CInput disabled={true} placeholder="Mã khách hàng" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Số thuê bao"
            name="phone"
            rules={[
              validateForm.required,
              validateForm.maxLength(11),
              prefixIsdn,
            ]}
          >
            <CInput
              placeholder="Số thuê bao"
              onlyNumber
              maxLength={11}
              onBlur={(e) => {
                delay(() => {
                  setIsMyInputFocusedPhone(false);
                }, 200);

                handleCheckNumberPhone(e);
              }}
              onFocus={() => setIsMyInputFocusedPhone(true)}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Serial SIM"
            name="serialSim"
            rules={[
              validateForm.required,
              {
                len: 16,
                message: 'Serial SIM không đúng định dạng',
              },
            ]}
          >
            <CInput
              placeholder="Số serial SIM"
              onlyNumber
              maxLength={16}
              onBlur={() =>
                delay(() => {
                  setIsMyInputFocusedSerialSim(false);
                }, 500)
              }
              onFocus={() => setIsMyInputFocusedSerialSim(true)}
            />
          </Form.Item>
        </Col>
      </Row>
      <div className="hidden">
        <Form.Item label="" name="pkName" />
        <Form.Item label="" name="checkSimError" />
        <Form.Item label="" name="publicKey" />
        <Form.Item label="" name="sessionToken" />
      </div>
    </fieldset>
  );
};

export default ThongTinKichHoat;
