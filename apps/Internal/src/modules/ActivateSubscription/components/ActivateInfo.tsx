import { Col, Flex, Form, Row } from 'antd';
import validateForm from '@react/utils/validator';
import {
  Button,
  CDatePicker,
  CInput,
  CSelect,
} from '../../../../../../commons/src/lib/commons';
import UploadImage from './UploadImage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import CadastralSelect from './Cadastral';
import useActiveSubscriptStore from '../store';
import { RangePickerProps } from 'antd/es/date-picker';
import dayjs, { Dayjs } from 'dayjs';
import { useGetApplicationConfig } from '../hooks/useGetApplicationConfig';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import includes from 'lodash/includes';
import { ActionsTypeEnum } from '@react/constants/app';
import CButton from '@react/commons/Button';
import { useCheckCondition } from '../hooks/useCheckCondition';
import { useLocation } from 'react-router-dom';
import { pathRoutes } from 'apps/Internal/src/constants/routes';
import md5 from 'crypto-js/md5';
import useCheckBlackList from '../hooks/useCheckBlackList';

const ThongTinKichHoat = () => {
  const form = Form.useFormInstance();
  const location = useLocation();
  const {
    resetDataActivateInfo,
    interval,
    isDisableButtonCheck,
    setDisableButtonCheck,
    timeError,
  } = useActiveSubscriptStore();
  const { mutate: mutateCheckCondition, isPending: isPendingCheckCondition } =
    useCheckCondition();
  const { isSuccess: isSuccessCheckBlackList } = useCheckBlackList();

  const {
    data: dataApplicationConfigIdType,
    isLoading: isLoadingIdTypeIdType,
  } = useGetApplicationConfig('ID_TYPE');
  const { data: dataApplicationConfigSex, isLoading: isLoadingSex } =
    useGetApplicationConfig('SEX');

  const listRoleByRouter = useRolesByRouter();

  const isMenuActivateSubscription =
    location.pathname === pathRoutes.activateSubscription &&
    !includes(listRoleByRouter, ActionsTypeEnum.EDITKEY);

  const isMenuActivateEnterprise =
    location.pathname === pathRoutes.enterpriseCustomerManagementH2HActive &&
    !includes(listRoleByRouter, ActionsTypeEnum.EDITKEY);

  const handleReset = () => {
    resetDataActivateInfo();
    clearTimeout(interval);
    form.resetFields(['cardFront', 'cardBack', 'portrait', 'cardContract']);
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
    });
  };

  const handleCheckCondition = () => {
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
          'Thời gian kích hoạt phải nhỏ hơn hoặc bằng Thời gian hết hạn giấy tờ'
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
          <span>Thông tin kích hoạt</span>
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
            </Flex>
          </Col>
        </Row>
      </fieldset>
      <fieldset>
        <legend>Thông tin giấy tờ tùy thân</legend>
        <Row gutter={12}>
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
                  !!timeError ||
                  isSuccessCheckBlackList
                }
                placeholder="Loại giấy tờ"
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
                  !!timeError ||
                  isSuccessCheckBlackList
                }
                placeholder="Họ và tên"
                maxLength={50}
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
                  !!timeError ||
                  isSuccessCheckBlackList
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
                  !!timeError ||
                  isSuccessCheckBlackList
                }
                placeholder="Ngày sinh"
                disabledDate={disabledDate}
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
                  !!timeError ||
                  isSuccessCheckBlackList
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
                disabled={!!timeError || isSuccessCheckBlackList}
                placeholder="Giới tính"
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
                  !!timeError ||
                  isSuccessCheckBlackList
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
              label="Địa chỉ thường trú"
              name="address"
              rules={[validateForm.required, validateForm.maxLength(200)]}
            >
              <CInput
                disabled={!!timeError || isSuccessCheckBlackList}
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
                  !!timeError ||
                  isSuccessCheckBlackList
                }
                placeholder="Ngày hết hạn giấy tờ"
                onChange={() => setDisableButtonCheck(false)}
              />
            </Form.Item>
            <Form.Item
              label="Ngày hết hạn"
              name="idExpiryDateNote"
              rules={[validateForm.maxLength(50)]}
            >
              <CInput
                disabled={!!timeError || isSuccessCheckBlackList}
                placeholder="Nhập thông tin"
                maxLength={50}
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
        </Row>
        {(!isMenuActivateSubscription || !isMenuActivateEnterprise) && (
          <div className="flex justify-center">
            <CButton
              disabled={
                isDisableButtonCheck || !!timeError || isSuccessCheckBlackList
              }
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
