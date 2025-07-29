import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  CDatePicker,
  CInput,
  CSelect,
  NotificationError,
} from '@react/commons/index';
import { formatDateEnglishV2 } from '@react/constants/moment';
import validateForm from '@react/utils/validator';
import { UseMutateFunction } from '@tanstack/react-query';
import { Col, Flex, Form, Row, Spin, Tooltip } from 'antd';
import { RangePickerProps } from 'antd/lib/date-picker';
import dayjs, { Dayjs } from 'dayjs';
import { useGetApplicationConfig } from '../../../ActivateSubscription/hooks/useGetApplicationConfig';
import { PayloadCheck8ConditionNewCus } from '../../hooks/useCheckNewCustomer8Condition';
import useOwnershipTransferStore from '../../store';
import UploadImage from './UploadImage';
import { useGenCustomerCode } from '../../../ActivateSubscription/hooks/useGenCustomerCode';
import { useEffect } from 'react';
import { includes } from 'lodash';
import { ActionsTypeEnum } from '@react/constants/app';
import { useRolesByRouter } from 'apps/Internal/src/hooks/useRolesByRouter';
import CadastralSelect from '../CustomerInfo/Cadastral';
import { DocumentTypeEnum } from '../../types';
import { MESSAGE } from '@react/utils/message';
import formInstance from '@react/utils/form';

interface Props {
  isLoading: boolean;
  onCheckingInfor: UseMutateFunction<
    boolean,
    any,
    PayloadCheck8ConditionNewCus,
    unknown
  >;
}

const ActivateInfo = ({ isLoading, onCheckingInfor }: Props) => {
  const form = Form.useFormInstance();
  const listRoleByRouter = useRolesByRouter();
  const isEditKey = includes(listRoleByRouter, ActionsTypeEnum.EDITKEY);
  const {
    isDisableNewButtonCheck,
    setDisableNewButtonCheck,
    resetDataTransfereeInfo,
    dataTransfereeInfo,
    setSignSuccess,
    setTransfereeSignSuccess,
    setIsChangeInfoOcr,
  } = useOwnershipTransferStore();
  const {
    data: dataApplicationConfigIdType,
    isLoading: isLoadingIdTypeIdType,
  } = useGetApplicationConfig('ID_TYPE');
  const { data: dataApplicationConfigSex, isLoading: isLoadingSex } =
    useGetApplicationConfig('SEX');
  const { data: dataGenCustomerCode } = useGenCustomerCode(
    dataTransfereeInfo.id
  );
  const { idExpiryDateNoteNew } = Form.useWatch((e) => e, form) ?? {};

  useEffect(() => {
    form.setFieldsValue({
      transfereeNo: dataGenCustomerCode?.customerCode,
      customerCode: dataGenCustomerCode?.customerCode,
    });
  }, [dataGenCustomerCode?.customerCode]);

  const handleReset = () => {
    resetDataTransfereeInfo();
    form.resetFields([
      'transfereeCardFront',
      'transfereeCardBack',
      'transfereePortrait',
      'cardContract',
      'requestFormCCQ',
      'ownerCommit',
      'transfereePhoneNumber',
      'transfereeOtp',
      'expireTime',
      'otpReason',
      'isShowNewOTP',
      'fileND13',
      'newLink',
      'oldLink',
    ]);
    setSignSuccess(false);
    setTransfereeSignSuccess(false);
    setIsChangeInfoOcr(false);
    form.setFieldsValue({
      transfereeDocument: '1',
      transfereeName: '',
      transfereeIdNo: '',
      transfereePlaceOfIssue: '',
      transfereeDateOfIssue: '',
      transfereeDateOfBirth: '',
      transfereeSex: null,
      transfereeAddress: '',
      transfereeCity: null,
      transfereeDistrict: null,
      transfereeWard: null,
      transfereeExpiry: '',
      idExpiryDateNoteNew: '',
    });
  };

  const validateBirthday = (value: string) => {
    const issueDate = form.getFieldValue('issue_date');
    if (value && issueDate && !dayjs(issueDate).isAfter(dayjs(value))) {
      return Promise.reject(new Error('Ngày sinh phải nhỏ hơn ngày cấp'));
    }
    if (value && dayjs().subtract(14, 'year').isBefore(dayjs(value))) {
      return Promise.reject(
        new Error('Khách hàng không đủ điều kiện để thực hiện Chuyển chủ quyền')
      );
    }
    return Promise.resolve();
  };
  const validateExpiry = (value: string) => {
    if (value && dayjs().isAfter(dayjs(value), 'days')) {
      return Promise.reject(
        new Error(
          'Thời gian Chuyển chủ quyền phải nhỏ hơn hoặc bằng Thời gian hết hạn giấy tờ'
        )
      );
    }

    return Promise.resolve();
  };
  const disabledDate: RangePickerProps['disabledDate'] = (
    startValue: Dayjs
  ) => {
    return dayjs(startValue).isAfter(dayjs().endOf('day'));
  };
  const handleBlur = (e: any) => {
    form.setFieldValue('issue_by', e.target.value.trim());
    form.validateFields(['issue_by']);
  };

  const handleCheckingCustomerInfor = () => {
    form
      .validateFields([
        'transfereeAddress',
        'transfereeDateOfBirth',
        'transfereeCity',
        'transfereeDistrict',
        'transfereeDocument',
        'transfereeExpiry',
        'idExpiryDateNoteNew',
        'transfereeIdNo',
        'transfereeIdEkyc',
        'transfereePlaceOfIssue',
        'transfereeDateOfIssue',
        'transfereeName',
        'transfereeSex',
        'transfereeWard',
      ])
      .then((value) => {
        if (value.transfereeDocument === DocumentTypeEnum.CMND) {
          NotificationError(MESSAGE.G39);
          return;
        }
        if (!value.transfereeExpiry && !idExpiryDateNoteNew) {
          NotificationError(MESSAGE.G40);
          return;
        }
        onCheckingInfor(
          {
            idExpiryDateNote: value.idExpiryDateNoteNew,
            address: value.transfereeAddress,
            city: value.transfereeCity,
            district: value.transfereeDistrict,
            document: value.transfereeDocument,
            id: value.transfereeIdNo,
            id_ekyc: value.transfereeIdEkyc,
            issue_by: value.transfereePlaceOfIssue,
            name: value.transfereeName,
            sex: value.transfereeSex,
            ward: value.transfereeWard,
            expiry:
              value.transfereeExpiry && value.transfereeExpiry
                ? dayjs(value.transfereeExpiry, formatDateEnglishV2).format(
                    formatDateEnglishV2
                  )
                : '',
            birthday:
              value.transfereeDateOfBirth && value.transfereeDateOfBirth
                ? dayjs(
                    value.transfereeDateOfBirth,
                    formatDateEnglishV2
                  ).format(formatDateEnglishV2)
                : '',
            issue_date:
              value.transfereeDateOfIssue && value.transfereeDateOfIssue
                ? dayjs(
                    value.transfereeDateOfIssue,
                    formatDateEnglishV2
                  ).format(formatDateEnglishV2)
                : '',
          },
          {
            onError: (err: any) => {
              formInstance.getFormError(form, err?.errors);
            },
          }
        );
      });
  };

  return (
    <>
      <fieldset className="bg-white">
        <legend>
          <span>Thông tin kích hoạt</span>
          <Tooltip title="Làm mới">
            <FontAwesomeIcon
              icon={faRotateRight}
              className="cursor-pointer self-center"
              onClick={handleReset}
            />
          </Tooltip>
        </legend>
        <Spin spinning={isLoading}>
          <Row gutter={12}>
            <Col span={8}>
              <UploadImage
                name="transfereeCardFront"
                label="Ảnh GTTT mặt trước"
              />
            </Col>
            <Col span={8}>
              <UploadImage name="transfereeCardBack" label="Ảnh GTTT mặt sau" />
            </Col>
            <Col span={8}>
              <UploadImage name="transfereePortrait" label="Ảnh chân dung" />
            </Col>
            <Col span={8}>
              <UploadImage name="requestFormCCQ" label="Phiếu yêu cầu CCQ" />
            </Col>
            <Col span={8}>
              <UploadImage name="ownerCommit" label="Bản cam kết chính chủ" />
            </Col>
            <Col span={8}>
              <UploadImage name="cardContract" label="Ảnh hợp đồng/BBXN" />
            </Col>
          </Row>
        </Spin>
      </fieldset>
      <fieldset className="bg-white">
        <legend>Thông tin giấy tờ tùy thân</legend>
        <Spin spinning={isLoading}>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                label="Loại giấy tờ"
                name="transfereeDocument"
                rules={[validateForm.required]}
              >
                <CSelect
                  fieldNames={{ label: 'code', value: 'value' }}
                  loading={isLoadingIdTypeIdType}
                  options={dataApplicationConfigIdType}
                  disabled={false}
                  placeholder="Loại giấy tờ"
                  onChange={() => setDisableNewButtonCheck(false)}
                  showSearch={false}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Họ và tên"
                name="transfereeName"
                rules={[validateForm.required, validateForm.maxLength(50)]}
              >
                <CInput
                  disabled={false}
                  placeholder="Họ và tên"
                  maxLength={50}
                  onChange={() => setDisableNewButtonCheck(false)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Số giấy tờ"
                name="transfereeIdNo"
                rules={[validateForm.required, validateForm.maxLength(50)]}
              >
                <CInput
                  disabled={false}
                  placeholder="Số giấy tờ"
                  maxLength={50}
                  onlyNumber
                  onChange={() => setDisableNewButtonCheck(false)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Ngày sinh"
                name="transfereeDateOfBirth"
                rules={[
                  validateForm.required,
                  { validator: (_, value) => validateBirthday(value) },
                ]}
              >
                <CDatePicker
                  disabled={false}
                  placeholder="Ngày sinh"
                  disabledDate={disabledDate}
                  onChange={() => setDisableNewButtonCheck(false)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Ngày cấp"
                name="transfereeDateOfIssue"
                rules={[validateForm.required]}
              >
                <CDatePicker
                  disabled={false}
                  placeholder="Ngày cấp"
                  disabledDate={disabledDate}
                  onChange={() => {
                    form.validateFields(['birthday']);
                    setDisableNewButtonCheck(false);
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Giới tính"
                name="transfereeSex"
                rules={[validateForm.required]}
              >
                <CSelect
                  loading={isLoadingSex}
                  fieldNames={{ label: 'name', value: 'value' }}
                  options={dataApplicationConfigSex}
                  disabled={false}
                  placeholder="Giới tính"
                  onChange={() => setDisableNewButtonCheck(false)}
                  showSearch={false}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Nơi cấp"
                name="transfereePlaceOfIssue"
                rules={[validateForm.required, validateForm.maxLength(200)]}
              >
                <CInput
                  disabled={false}
                  placeholder="Nơi cấp"
                  maxLength={200}
                  onBlur={handleBlur}
                  onChange={() => setDisableNewButtonCheck(false)}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Địa chỉ thường trú"
                name="transfereeAddress"
                rules={[validateForm.required, validateForm.maxLength(200)]}
              >
                <CInput
                  disabled={false}
                  placeholder="Địa chỉ thường trú"
                  maxLength={200}
                  onChange={() => setDisableNewButtonCheck(false)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Ngày hết hạn giấy tờ"
                name="transfereeExpiry"
                rules={[{ validator: (_, value) => validateExpiry(value) }]}
              >
                <CDatePicker
                  disabled={false}
                  placeholder="Ngày hết hạn giấy tờ"
                  onChange={() => setDisableNewButtonCheck(false)}
                />
              </Form.Item>
              <Form.Item
                label="Ngày hết hạn"
                name="idExpiryDateNoteNew"
                rules={[validateForm.maxLength(50)]}
              >
                <CInput
                  disabled={false}
                  placeholder="Nhập thông tin"
                  maxLength={50}
                  onChange={() => setDisableNewButtonCheck(false)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <CadastralSelect
                required={true}
                onChangeProp={() => {
                  setDisableNewButtonCheck(false);
                }}
                formName={{
                  province: 'transfereeCity',
                  district: 'transfereeDistrict',
                  village: 'transfereeWard',
                }}
              />
            </Col>
          </Row>
        </Spin>
        {isEditKey && (
          <div className="flex justify-center">
            <Button
              disabled={isDisableNewButtonCheck}
              loading={isLoading}
              onClick={handleCheckingCustomerInfor}
            >
              Kiểm tra thông tin
            </Button>
          </div>
        )}
        <Form.Item label="" name="transfereeIdEkyc" hidden />
        <Form.Item label="" name="transfereeNo" hidden />
        <Form.Item label="" name="contractNo" hidden />
        <Form.Item label="" name="transfereeCountry" hidden />
        <Form.Item label="" name="customerCode" hidden />
        <Form.Item name="isShowNewOTP" hidden />
      </fieldset>
    </>
  );
};

export default ActivateInfo;
