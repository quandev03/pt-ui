import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Form, Row, Typography } from 'antd';
import validateForm from '@react/utils/validator';
import React, { useState } from 'react';
import {
  Button,
  CInput,
  CSelect,
  NotificationError,
  NotificationSuccess,
} from '@react/commons/index';
import { useGetOtp } from '../hooks/useGetOtp';
import { useConfirmOtp } from '../hooks/useConfirmOtp';
import { AnyElement, FieldErrorsType, OptionsType } from '@react/commons/types';
import useActiveSubscriptStore from '../store';
import { SignEnum, useGenContractNo } from '../hooks/useGenContractNo';
import dayjs from 'dayjs';

export const scrollErrorField = () => {
  setTimeout(() => {
    const firstErrorField = document.querySelector('.ant-form-item-has-error');
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ block: 'center', behavior: 'smooth' });
      return;
    }
  }, 100);
};

const CheckOtp = () => {
  const form = Form.useFormInstance();

  const {
    dataActivateInfo: data,
    isShowSignLink,
    setIsShowSignLink,
    activeSubmitMore3,
    countFailOtp,
    setCountFailOtp,
    isSuccessCheckCondition,
  } = useActiveSubscriptStore();
  const [counter, setCounter] = React.useState(-1);
  const { signLink, otp, phoneNumber, pkName, checkSimError, id } =
    Form.useWatch((value) => value, form) ?? {};
  const [phoneOptions, setPhoneOptions] = useState<OptionsType[]>([]);
  const [expireTime, setExpireTime] = useState<string>('');

  const { mutate: mutateSendOtp, data: dataOtp } = useGetOtp();
  const { mutate: mutateConfirmOtp } = useConfirmOtp();
  const { mutate: mutateGenContractNo } = useGenContractNo();
  const [checkSendOtp, setCheckSendOtp] = useState<boolean>(false);

  React.useEffect(() => {
    if (data?.list_phoneNumber.length > 0) {
      form.setFieldsValue({
        phoneNumber: data?.list_phoneNumber[0],
      });
    }
    setPhoneOptions(
      data?.list_phoneNumber?.map((e: string) => ({ label: e, value: e }))
    );
  }, [data?.list_phoneNumber]);

  React.useEffect(() => {
    if (data.list_phoneNumber?.length === 0) {
      setCounter(-1);
      setExpireTime('');
      return;
    }
    if (counter < 0) return;
    const id = setTimeout(() => {
      setCounter(counter - 1);
    }, 1000);
    setExpireTime(
      counter > 0
        ? `Thời gian hết hạn ${dayjs()
          .startOf('day')
          .add(counter, 'second')
          .format('mm:ss')}`
        : 'OTP đã hết hạn'
    );
    return () => {
      clearTimeout(id);
    };
  }, [counter, data.list_phoneNumber?.length]);

  const handleSendOtp = () => {
    mutateSendOtp(
      { isdn: phoneNumber, idEkyc: data.id_ekyc },
      {
        onSuccess() {
          NotificationSuccess('Gửi OTP thành công');
          setCounter(120);
          setCountFailOtp(0);
          setCheckSendOtp(true);
        },
        onError() {
          setCheckSendOtp(false);
        }
      },
    );
  };
  const handleConfirmOtp = () => {
    if (!otp) return;
    const payload = dataOtp;
    mutateConfirmOtp(
      { ...payload, otp, idNo: id },
      {
        onSuccess: () => {
          NotificationSuccess('Xác thực OTP thành công');
          setIsShowSignLink(true);
          setExpireTime('');
          setCountFailOtp(0);
          setCounter(-1);
        },
        onError: (err: AnyElement) => {
          if (err.errors && err.errors.length > 0) {
            form.setFields(
              err.errors.map((e: FieldErrorsType) => ({
                name: e.field,
                errors: [e.detail],
              }))
            );
          }
          setCountFailOtp(countFailOtp + 1);
        },
      }
    );
  };

  const handleCreateContract = (activeType: SignEnum) => {
    form
      .validateFields([
        'phone',
        'serialSim',
        'document',
        'name',
        'id',
        'issue_by',
        'issue_date',
        'birthday',
        'sex',
        'address',
        'city',
        'district',
        'ward',
      ])
      .then(() => {
        if (!pkName) {
          NotificationError(checkSimError);
          return;
        }
        mutateGenContractNo({
          idNo: data.id,
          activeType: activeType,
        });
      });
    scrollErrorField();
  };
  if (!activeSubmitMore3) return null;
  if ((!data.errors?.length && !data.c06_errors) || isSuccessCheckCondition)
    return (
      <>
        {data.check_sendOTP === true && data.list_phoneNumber?.length > 0 && (
          <fieldset>
            <legend>Kiểm tra OTP</legend>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item
                  label="SĐT nhận OTP"
                  name="phoneNumber"
                  rules={[validateForm.required]}
                >
                  <CSelect
                    disabled={isShowSignLink}
                    options={phoneOptions}
                    placeholder="Chọn SĐT nhận OTP"
                    maxCount={1}
                    allowClear={false}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Button
                  disabled={isShowSignLink}
                  onClick={handleSendOtp}
                  className="w-[8.5rem]"
                >
                  Gửi OTP
                </Button>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Nhập OTP"
                  name="otp"
                  rules={[validateForm.required, validateForm.maxLength(10)]}
                >
                  <CInput
                    disabled={isShowSignLink || !checkSendOtp}
                    placeholder="Nhập OTP"
                    onlyNumber
                    maxLength={10}
                  />
                </Form.Item>
                {!!expireTime && countFailOtp < 6 && (
                  <Form.Item label=" " name="expireTime">
                    <Typography.Text type="danger">
                      {expireTime}
                    </Typography.Text>
                  </Form.Item>
                )}
              </Col>
              <Col span={12}>
                <Button
                  disabled={!otp || isShowSignLink || countFailOtp >= 6}
                  onClick={handleConfirmOtp}
                  className="w-[8.5rem]"
                >
                  Xác thực OTP
                </Button>
              </Col>
            </Row>
          </fieldset>
        )}
        {(isShowSignLink ||
          data.check_sendOTP === false ||
          data.list_phoneNumber?.length === 0) &&
          !!data?.id && (
            <fieldset>
              <legend>Thông tin ký</legend>
              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item label="Linh ký" name="signLink" rules={[]}>
                    <CInput
                      disabled={true}
                      placeholder="Link ký"
                      suffix={
                        signLink ? (
                          <FontAwesomeIcon
                            icon={faCopy}
                            size="xl"
                            onClick={() => {
                              navigator.clipboard.writeText(signLink);
                              NotificationSuccess('Copy thành công');
                            }}
                            className="cursor-pointer"
                            title="Copy"
                          />
                        ) : undefined
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Button
                    disabled={false}
                    onClick={() => handleCreateContract(SignEnum.ONLINE)} //1 là Online, 2 là offline
                    className="w-[8.5rem]"
                  >
                    Tạo link ký
                  </Button>
                </Col>
                <Col span={12}></Col>

                <Col span={12}>
                  <Button
                    disabled={false}
                    onClick={() => handleCreateContract(SignEnum.OFFLINE)} //1 là Online, 2 là offline
                    className="w-[8.5rem]"
                  >
                    Tạo biểu mẫu
                  </Button>
                </Col>
              </Row>
            </fieldset>
          )}
      </>
    );
};

export default CheckOtp;
