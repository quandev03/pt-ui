import Button from '@react/commons/Button';
import { CDatePicker, NotificationError } from '@react/commons/index';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import { IErrorResponse, IFieldErrorsItem } from '@react/commons/types';
import { formatDate } from '@react/constants/moment';
import { MESSAGE } from '@react/utils/message';
import validateForm from '@react/utils/validator';
import { UseMutateFunction } from '@tanstack/react-query';
import { Col, Form, Row } from 'antd';
import { RangePickerProps } from 'antd/lib/date-picker';
import { useGetApplicationConfig } from 'apps/Internal/src/hooks/useGetApplicationConfig';
import dayjs, { Dayjs } from 'dayjs';
import { FC, useEffect } from 'react';
import { useGenCustomerCode } from '../../../ActivateSubscription/hooks/useGenCustomerCode';
import { useGetCusType } from '../../hooks/useGetCusType';
import useOwnershipTransferStore from '../../store';
import { DocumentTypeEnum } from '../../types';
import CadastralSelect from './Cadastral';
import formInstance from '@react/utils/form';

type CustomerInfoProps = {
  onCheckingInfor: UseMutateFunction<
    boolean,
    IErrorResponse & {
      fieldErrors?: IFieldErrorsItem[];
    },
    any,
    unknown
  >;
  isSuccessCheckingCustomerInfor: boolean;
};
const CustomerInfo: FC<CustomerInfoProps> = ({
  onCheckingInfor,
  isSuccessCheckingCustomerInfor,
}) => {
  const form = Form.useFormInstance();
  const {
    dataTransferorInfo,
    isSuccessIsdn,
    setDisableButtonCheck,
    isDisableButtonCheck,
  } = useOwnershipTransferStore();
  const {
    data: dataApplicationConfigIdType,
    isLoading: isLoadingIdTypeIdType,
  } = useGetApplicationConfig('ID_TYPE');

  const { data: dataApplicationConfigSex, isLoading: isLoadingSex } =
    useGetApplicationConfig('SEX');
  const { data: dataGenCustomerCode } = useGenCustomerCode(
    dataTransferorInfo.id
  );
  useEffect(() => {
    form.setFieldsValue({
      transferorNo: dataGenCustomerCode?.customerCode,
    });
  }, [dataGenCustomerCode?.customerCode]);

  const disabledDate: RangePickerProps['disabledDate'] = (
    startValue: Dayjs
  ) => {
    return dayjs(startValue).isAfter(dayjs().endOf('day'));
  };

  const validateBirthday = (value: string) => {
    const transferorDateOfIssue = form.getFieldValue('transferorDateOfIssue');
    if (
      value &&
      transferorDateOfIssue &&
      !dayjs(transferorDateOfIssue).isAfter(dayjs(value))
    ) {
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

  const handleCheckingCustomerInfor = () => {
    form
      .validateFields([
        'transferorAddress',
        'transferorDateOfBirth',
        'city',
        'district',
        'documentType',
        'expiry',
        'idExpiryDateNote',
        'transferorIdNo',
        'id_ekyc',
        'transferorPlaceOfIssue',
        'transferorDateOfIssue',
        'transferorName',
        'transferorSex',
        'ward',
        'cusType',
      ])
      .then((value) => {
        const {
          transferorAddress,
          appObject,
          transferorDateOfBirth,
          city,
          district,
          expiry,
          transferorIdNo,
          isdn,
          transferorPlaceOfIssue,
          transferorDateOfIssue,
          transferorName,
          transferorSex,
          ward,
          documentType,
          cusType,
          idExpiryDateNote,
        } = form.getFieldsValue();
        if (documentType === DocumentTypeEnum.CMND) {
          NotificationError(MESSAGE.G39);
          return;
        }
        if (!expiry && !idExpiryDateNote) {
          NotificationError(MESSAGE.G40);
          return;
        }
        onCheckingInfor(
          {
            isdn,
            idType: documentType,
            name: transferorName,
            idNo: transferorIdNo,
            issueBy: transferorPlaceOfIssue,
            issueDate: transferorDateOfIssue
              ? dayjs(transferorDateOfIssue).format(formatDate)
              : '',
            birthday: transferorDateOfBirth
              ? dayjs(transferorDateOfBirth).format(formatDate)
              : '',
            sex: transferorSex,
            address: transferorAddress,
            city,
            district,
            ward,
            expiry: expiry ? dayjs(expiry).format(formatDate) : '',
            appObject,
            cusType,
          },
          {
            onSuccess: () => setDisableButtonCheck(true),
            onError: (err: any) => {
              formInstance.getFormError(form, err?.errors);
            },
          }
        );
      });
  };
  const { data: cusTypeOption = [] } = useGetCusType();
  return (
    <fieldset className="bg-white">
      <legend>Thông tin khách hàng</legend>
      <Row gutter={12}>
        <Col span={12}>
          <Form.Item
            label="Loại khách hàng"
            name="cusType"
            initialValue="Cá nhân"
            rules={[validateForm.required]}
          >
            <CSelect
              placeholder="Chọn loại khách hàng"
              options={cusTypeOption}
              onChange={() => setDisableButtonCheck(false)}
              showSearch={false}
            />
          </Form.Item>
          <Form.Item
            label="Loại giấy tờ"
            name="documentType"
            rules={[validateForm.required]}
          >
            <CSelect
              fieldNames={{ label: 'code', value: 'value' }}
              loading={isLoadingIdTypeIdType}
              options={dataApplicationConfigIdType}
              placeholder="Chọn loại giấy tờ"
              onChange={() => setDisableButtonCheck(false)}
              showSearch={false}
            />
          </Form.Item>
          <Form.Item
            label="Nơi cấp"
            name="transferorPlaceOfIssue"
            rules={[validateForm.required, validateForm.maxLength(200)]}
          >
            <CInput
              placeholder="Nơi cấp"
              maxLength={200}
              onChange={() => setDisableButtonCheck(false)}
            />
          </Form.Item>
          <Form.Item
            label="Chọn giới tính"
            name="transferorSex"
            rules={[validateForm.required]}
          >
            <CSelect
              loading={isLoadingSex}
              fieldNames={{ label: 'name', value: 'value' }}
              options={dataApplicationConfigSex}
              placeholder="Giới tính"
              onChange={() => setDisableButtonCheck(false)}
              showSearch={false}
            />
          </Form.Item>
          <Form.Item
            label="Địa chỉ thường trú"
            name="transferorAddress"
            rules={[validateForm.required, validateForm.maxLength(200)]}
          >
            <CInput
              placeholder="Nhập địa chỉ thường trú"
              maxLength={200}
              onChange={() => setDisableButtonCheck(false)}
            />
          </Form.Item>
          <Form.Item
            label="Ngày hết hạn giấy tờ"
            name="expiry"
            rules={[{ validator: (_, value) => validateExpiry(value) }]}
          >
            <CDatePicker
              placeholder="Chọn ngày hết hạn giấy tờ"
              onChange={() => setDisableButtonCheck(false)}
            />
          </Form.Item>
          <Form.Item
            label="Ngày hết hạn"
            name="idExpiryDateNote"
            rules={[validateForm.maxLength(50)]}
          >
            <CInput
              placeholder="Nhập ngày hết hạn"
              maxLength={50}
              onChange={() => setDisableButtonCheck(false)}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Họ và tên"
            name="transferorName"
            rules={[validateForm.required, validateForm.maxLength(50)]}
          >
            <CInput
              placeholder="Nhập họ và tên"
              maxLength={50}
              onChange={() => setDisableButtonCheck(false)}
            />
          </Form.Item>
          <Form.Item
            label="Số giấy tờ"
            name="transferorIdNo"
            rules={[validateForm.required, validateForm.maxLength(50)]}
          >
            <CInput
              placeholder="Nhập số giấy tờ"
              maxLength={50}
              onlyNumber
              onChange={() => setDisableButtonCheck(false)}
            />
          </Form.Item>
          <Form.Item
            label="Ngày cấp"
            name="transferorDateOfIssue"
            rules={[validateForm.required]}
          >
            <CDatePicker
              placeholder="Chọn ngày cấp"
              disabledDate={disabledDate}
              onChange={() => {
                form.validateFields(['transferorDateOfBirth']);
                setDisableButtonCheck(false);
              }}
            />
          </Form.Item>
          <Form.Item
            label="Ngày sinh"
            name="transferorDateOfBirth"
            rules={[
              validateForm.required,
              { validator: (_, value) => validateBirthday(value) },
            ]}
          >
            <CDatePicker
              placeholder="Chọn ngày sinh"
              disabledDate={disabledDate}
              onChange={() => setDisableButtonCheck(false)}
            />
          </Form.Item>
          <CadastralSelect
            onChangeProp={() => setDisableButtonCheck(false)}
            required={true}
            formName={{
              province: 'city',
              district: 'district',
              village: 'ward',
            }}
          />
        </Col>
      </Row>
      <Form.Item name="idEkyc" hidden noStyle>
        <CInput />
      </Form.Item>
      <div className="flex justify-center">
        <Button
          loading={false}
          disabled={
            (!isSuccessIsdn || isSuccessCheckingCustomerInfor) &&
            isDisableButtonCheck
          }
          onClick={handleCheckingCustomerInfor}
        >
          Kiểm tra thông tin
        </Button>
      </div>
      <Form.Item label="" name="pkName" hidden />
      <Form.Item label="" name="publicKey" hidden />
      <Form.Item label="" name="sessionToken" hidden />
      <Form.Item label="" name="transferorNo" hidden />
      <Form.Item label="" name="transferorCountry" hidden />
      <Form.Item label="" name="ccdvvtOwnershipTransfer" hidden />
    </fieldset>
  );
};

export default CustomerInfo;
