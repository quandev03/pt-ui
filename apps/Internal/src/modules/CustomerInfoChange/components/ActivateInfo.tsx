import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CButton from '@react/commons/Button';
import { NotificationWarning } from '@react/commons/Notification';
import { ActionsTypeEnum } from '@react/constants/app';
import { decodeSearchParams } from '@react/helpers/utils';
import validateForm from '@react/utils/validator';
import { Col, Flex, Form, Row } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import dayjs, { Dayjs } from 'dayjs';
import { delay } from 'lodash';
import includes from 'lodash/includes';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useLocation, useSearchParams } from 'react-router-dom';
import {
  Button,
  CDatePicker,
  CInput,
  CSelect,
} from '../../../../../../commons/src/lib/commons';
import { useCheckCondition } from '../hooks/useCheckCondition';
import { useCheckSerialSim } from '../hooks/useCheckSerialSim';
import { useGenCustomerCode } from '../hooks/useGenCustomerCode';
import { useGetApplicationConfig } from '../hooks/useGetApplicationConfig';
import { usePrefixIsdnRegex } from '../hooks/usePrefixIsdnQuery';
import useActiveSubscriptStore from '../store';
import CadastralSelect from './Cadastral';
import UploadImage from './UploadImage';

const ThongTinKichHoat = () => {
  const form = Form.useFormInstance();
  const intl = useIntl();
  const location = useLocation();
  const {
    resetDataActivateInfo,
    interval,
    isDisableButtonCheck,
    dataActivateInfo,
    setDisableButtonCheck,
    timeError,
    setSuccessIsdn,
    resetGroupStore,
  } = useActiveSubscriptStore();
  const { mutate: mutateCheckCondition, isPending: isPendingCheckCondition } =
    useCheckCondition();
  const {
    data: dataApplicationConfigIdType,
    isLoading: isLoadingIdTypeIdType,
  } = useGetApplicationConfig('ID_TYPE');
  const {
    data: dataApplicationConfigcusType,
    isLoading: isLoadingIdTypecusType,
  } = useGetApplicationConfig('CUS_TYPE');
  const { data: dataApplicationConfigSex, isLoading: isLoadingSex } =
    useGetApplicationConfig('SEX');
  const prefixIsdn = usePrefixIsdnRegex();
  const listRoleByRouter = useRolesByRouter();
  const [searchParams] = useSearchParams();
  const params = decodeSearchParams(searchParams);
  const [isMyInputFocusedPhone, setIsMyInputFocusedPhone] = useState(true);
  const { data: dataGenCustomerCode } = useGenCustomerCode(dataActivateInfo.id);
  const { mutate: mutateCheckSerialSim } = useCheckSerialSim();
  useEffect(() => {
    if (params.phone) {
      form.setFieldsValue({
        phone: params.phone,
        serialSim: params.serialSim,
      });
      handleCheckSerialSim();
    }
  }, [params.phone]);

  useEffect(() => {
    if (!isMyInputFocusedPhone) {
      handleCheckSerialSim();
    }
  }, [isMyInputFocusedPhone]);

  useEffect(() => {
    form.setFieldsValue({
      customerId: dataGenCustomerCode?.customerCode,
    });
    console.log('FUL:LLL DATAAAA ', form.getFieldsValue());
  }, [dataGenCustomerCode?.customerCode]);

  const handleCheckSerialSim = () => {
    form.validateFields(['phone', 'serialSim']).then((value) => {
      mutateCheckSerialSim({
        serial: value.serialSim,
        isdn: value.phone.substring(1),
        type: 1,
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
  const isMenuActivateSubscription =
    location.pathname === pathRoutes.activateSubscription &&
    !includes(listRoleByRouter, ActionsTypeEnum.EDITKEY);

  const isMenuActivateEnterprise =
    location.pathname === pathRoutes.enterpriseCustomerManagementH2HActive &&
    !includes(listRoleByRouter, ActionsTypeEnum.EDITKEY);

  const handleReset = () => {
    resetDataActivateInfo();
    resetGroupStore();
    clearTimeout(interval);
    setSuccessIsdn(false);
    const phone = form.getFieldValue('phone');
    form.resetFields();
    form.resetFields([
      'cardFront',
      'cardBack',
      'portrait',
      'cardContract',
      'otpStatus',
      'videoCallStatus',
      'videoCallUser',
      'approveStatus',
      'assignUserName',
      'approveNumber',
      'approveReason',
      'approveNote',
      'approveDate',
      'auditStatus',
      'auditReason',
    ]);
    form.setFieldsValue({
      document: '1',
      name: '',
      id: '',
      issue_by: '',
      issue_date: '',
      birthday: '',
      sex: null,
      address: '',
      city: null,
      district: null,
      ward: null,
      expiry: '',
      idExpiryDateNote: '',
      otp: '',
      signLink: '',
      fileND13: '',
      phone: phone,
    });
    handleCheckSerialSim();
  };

  const handleCheckCondition = () => {
    if (
      form.getFieldValue('expiry') ||
      form.getFieldValue('idExpiryDateNote')
    ) {
      form
        .validateFields([
          'address',
          'birthday',
          'city',
          'district',
          'document',
          'expiry',
          'idExpiryDateNote',
          'id',
          'id_ekyc',
          'issue_by',
          'issue_date',
          'name',
          'sex',
          'ward',
        ])
        .then((value) => {
          mutateCheckCondition({
            ...value,
            birthday: dayjs(value.birthday, 'DD-MM-YYYY').format('YYYY-MM-DD'),
            expiry: value.expiry
              ? dayjs(value.expiry, 'DD-MM-YYYY').format('YYYY-MM-DD')
              : '',
            issue_date: dayjs(value.issue_date, 'DD-MM-YYYY').format(
              'YYYY-MM-DD'
            ),
          });
        });
    } else {
      NotificationWarning(
        'Vui lòng điền thông tin Ngày hết hạn giấy tờ hoặc Ngày hết hạn'
      );
    }
  };

  const disabledDate: RangePickerProps['disabledDate'] = (
    startValue: Dayjs
  ) => {
    return dayjs(startValue).isAfter(dayjs().endOf('day'));
  };

  const validateBirthday = (value: string) => {
    const issueDate = form.getFieldValue('issue_date');
    if (value && issueDate && !dayjs(issueDate).isAfter(dayjs(value))) {
      return Promise.reject(new Error('Ngày sinh phải nhỏ hơn ngày cấp'));
    }
    if (value && dayjs().subtract(14, 'year').isBefore(dayjs(value))) {
      return Promise.reject(
        new Error('Khách hàng không đủ điều kiện để thực hiện kích hoạt')
      );
    }
    return Promise.resolve();
  };

  const validateExpiry = (value: string) => {
    if (value && dayjs().isAfter(dayjs(value), 'days')) {
      return Promise.reject(
        new Error(
          'Thời gian thay đổi thông tin phải nhỏ hơn hoặc bằng Thời gian hết hạn giấy tờ'
        )
      );
    }

    return Promise.resolve();
  };

  const handleBlur = (e: any) => {
    form.setFieldValue('issue_by', e.target.value.trim());
    form.validateFields(['issue_by']);
  };

  return (
    <>
      <fieldset>
        <legend>
          <span>Thông tin khách hàng</span>
          <Button
            type="text"
            icon={
              <FontAwesomeIcon
                className="ml-2 cursor-pointer"
                icon={faRotateRight}
                size="lg"
              />
            }
            title="Làm mới"
            onClick={handleReset}
          />
        </legend>
        <Row gutter={12}>
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
          <Col span={24}>
            <Flex gap={16} justify="center">
              <div className="flex flex-col items-center w-full">
                <UploadImage name="cardFront" label="Ảnh GTTT mặt trước" />
              </div>
              <div className="flex flex-col items-center w-full">
                <UploadImage name="cardBack" label="Ảnh GTTT mặt sau" />
              </div>
              <div className="flex flex-col items-center w-full">
                <UploadImage name="portrait" label="Ảnh chân dung" />
              </div>
              <div className="flex flex-col items-center w-full">
                <UploadImage name="cardContract" label="Ảnh hợp đồng/BBXN" />
              </div>
              <div className="flex flex-col items-center w-full">
                <UploadImage name="cardCommit" label="Bản cam kết chính chủ" />
              </div>
            </Flex>
          </Col>
        </Row>
      </fieldset>
      <fieldset>
        <legend>Thông tin giấy tờ tùy thân</legend>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              label="Loại khách hàng"
              name="cusType"
              rules={[validateForm.required]}
            >
              <CSelect
                fieldNames={{ label: 'name', value: 'code' }}
                loading={isLoadingIdTypecusType}
                options={dataApplicationConfigcusType}
                disabled={
                  isMenuActivateSubscription ||
                  isMenuActivateEnterprise ||
                  !!timeError
                }
                placeholder="Loại khách hàng"
                onChange={() => setDisableButtonCheck(false)}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Họ và tên"
              name="name"
              rules={[validateForm.required, validateForm.maxLength(50)]}
            >
              <CInput
                disabled={
                  isMenuActivateSubscription ||
                  isMenuActivateEnterprise ||
                  !!timeError
                }
                placeholder="Họ và tên"
                maxLength={50}
                onChange={() => setDisableButtonCheck(false)}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Loại giấy tờ"
              name="document"
              rules={[validateForm.required]}
            >
              <CSelect
                fieldNames={{ label: 'code', value: 'value' }}
                loading={isLoadingIdTypeIdType}
                options={dataApplicationConfigIdType}
                disabled={
                  isMenuActivateSubscription ||
                  isMenuActivateEnterprise ||
                  !!timeError
                }
                placeholder="Loại giấy tờ"
                onChange={() => setDisableButtonCheck(false)}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Số giấy tờ"
              name="id"
              rules={[validateForm.required, validateForm.maxLength(50)]}
            >
              <CInput
                disabled={
                  isMenuActivateSubscription ||
                  isMenuActivateEnterprise ||
                  !!timeError
                }
                placeholder="Số giấy tờ"
                maxLength={50}
                onlyNumber
                onChange={() => setDisableButtonCheck(false)}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Nơi cấp"
              name="issue_by"
              rules={[validateForm.required, validateForm.maxLength(200)]}
            >
              <CInput
                disabled={
                  isMenuActivateSubscription ||
                  isMenuActivateEnterprise ||
                  !!timeError
                }
                placeholder="Nơi cấp"
                maxLength={200}
                onBlur={handleBlur}
                onChange={() => setDisableButtonCheck(false)}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Ngày cấp"
              name="issue_date"
              rules={[validateForm.required]}
            >
              <CDatePicker
                disabled={
                  isMenuActivateSubscription ||
                  isMenuActivateEnterprise ||
                  !!timeError
                }
                placeholder="Ngày cấp"
                disabledDate={disabledDate}
                onChange={() => {
                  form.validateFields(['birthday']);
                  setDisableButtonCheck(false);
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Giới tính"
              name="sex"
              rules={[validateForm.required]}
            >
              <CSelect
                loading={isLoadingSex}
                fieldNames={{ label: 'name', value: 'value' }}
                options={dataApplicationConfigSex}
                disabled={!!timeError}
                placeholder="Giới tính"
                onChange={() => setDisableButtonCheck(false)}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Ngày sinh"
              name="birthday"
              rules={[
                validateForm.required,
                { validator: (_, value) => validateBirthday(value) },
              ]}
            >
              <CDatePicker
                disabled={
                  isMenuActivateSubscription ||
                  isMenuActivateEnterprise ||
                  !!timeError
                }
                placeholder="Ngày sinh"
                disabledDate={disabledDate}
                onChange={() => setDisableButtonCheck(false)}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Địa chỉ thường trú"
              name="address"
              rules={[validateForm.required, validateForm.maxLength(200)]}
            >
              <CInput
                disabled={!!timeError}
                placeholder="Địa chỉ thường trú"
                maxLength={200}
                onChange={() => setDisableButtonCheck(false)}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Ngày hết hạn giấy tờ"
              name="expiry"
              rules={[{ validator: (_, value) => validateExpiry(value) }]}
            >
              <CDatePicker
                disabled={
                  isMenuActivateSubscription ||
                  isMenuActivateEnterprise ||
                  !!timeError
                }
                placeholder="Ngày hết hạn giấy tờ"
                onChange={() => setDisableButtonCheck(false)}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <CadastralSelect
              required={true}
              onChangeProp={() => setDisableButtonCheck(false)}
              formName={{
                province: 'city',
                district: 'district',
                village: 'ward',
              }}
            />
          </Col>
          <Col span={12}>
            <Form.Item
              label="Ngày hết hạn"
              name="idExpiryDateNote"
              rules={[validateForm.maxLength(50)]}
            >
              <CInput
                disabled={!!timeError}
                placeholder="Nhập thông tin"
                maxLength={50}
                onChange={() => setDisableButtonCheck(false)}
              />
            </Form.Item>
          </Col>
        </Row>
        {(!isMenuActivateSubscription || !isMenuActivateEnterprise) && (
          <div className="flex justify-center">
            <CButton
              disabled={isDisableButtonCheck || !!timeError}
              loading={isPendingCheckCondition}
              onClick={handleCheckCondition}
            >
              Kiểm tra thông tin
            </CButton>
          </div>
        )}
      </fieldset>
    </>
  );
};

export default ThongTinKichHoat;
