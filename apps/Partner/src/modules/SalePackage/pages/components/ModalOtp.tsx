import { useForm } from 'antd/es/form/Form';
import React, { useCallback, useEffect, useState } from 'react';
import { useSellSinglePackageStore } from '../../store';
import { useAddPackageSingle } from '../../hooks';
import {
  CButton,
  CInput,
  CModal,
  IUserInfo,
  useGetDataFromQueryKey,
  validateForm,
} from '@vissoft-react/common';
import { REACT_QUERY_KEYS } from '../../../../../src/constants/query-key';
import { handleConvertIsdn } from '../../utils';
import { IPayloadRegister } from '../../types';
import { Col, Form, Row } from 'antd';

const ModalOtp = ({
  open,
  onClose,
  handleGenOtp,
  handleSuccess,
}: {
  open: boolean;
  onClose: () => void;
  handleGenOtp: () => void;
  handleSuccess: () => void;
}) => {
  const [form] = useForm();
  const [isDisabled, setIsDisabled] = useState(true);
  const { count, setCount, dataGenOtp } = useSellSinglePackageStore();
  const { mutate: addPackageSingle, isPending: loadingAdd } =
    useAddPackageSingle(() => {
      handleSuccess();
      form.resetFields();
    });
  useEffect(() => {
    if (count === 0) {
      setIsDisabled(false);
      return;
    }
    const timer = setInterval(() => {
      setIsDisabled(true);
      setCount(count - 1);
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);
  const userLogin = useGetDataFromQueryKey<IUserInfo>([
    REACT_QUERY_KEYS.GET_PROFILE,
  ]);
  const formatTime = (time: number) => {
    const minutes = String(Math.floor(time / 60)).padStart(2, '0');
    const seconds = String(time % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };
  const handleSubmit = useCallback(
    (value: { otp: string }) => {
      const data = {
        isdn: handleConvertIsdn(dataGenOtp?.isdn),
        idPackage: dataGenOtp?.idPackage,
        pckCode: dataGenOtp?.pckCode,
        otpConfirmRequest: {
          otp: value.otp,
          id: dataGenOtp?.id,
          transactionId: dataGenOtp?.transactionId,
          isdn: handleConvertIsdn(dataGenOtp?.isdn),
        },
        cycle: dataGenOtp.cycle,
        unit: dataGenOtp.unit,
      };
      addPackageSingle(data as IPayloadRegister);
    },
    [dataGenOtp, addPackageSingle]
  );
  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [open, form]);
  return (
    <CModal closeIcon open={open} onCancel={onClose} footer={null}>
      <div>
        <strong className="block text-center text-lg py-3">Xác nhận</strong>
        <p className="text-center mb-6 mx-16">
          Nhập mã OTP gửi về SĐT ${userLogin?.phoneNumber} để xác nhận nạp gói
          cho thuê bao:
        </p>
        <Form form={form} colon={false} onFinish={handleSubmit} labelWrap>
          <Row>
            <Col>
              <Row>
                <Form.Item
                  name="otp"
                  label="Mã OTP"
                  className="flex pl-10"
                  rules={[validateForm.required]}
                >
                  <CInput
                    onlyNumber
                    className="max-w-[220px] h-[36px] mr-4"
                    maxLength={6}
                    placeholder="Nhập mã OTP"
                  />
                </Form.Item>
                <Row
                  align="middle"
                  justify="center"
                  style={{ flexDirection: 'column' }}
                >
                  <Col>
                    <CButton
                      disabled={isDisabled}
                      onClick={() => {
                        handleGenOtp();
                      }}
                      className="disabled:bg-[#C6C6C6] h-max-[90%] disabled:text-black font-medium"
                    >
                      Gửi lại
                    </CButton>
                  </Col>
                  <p className="font-medium italic mt-[2px]">
                    {formatTime(count)}
                  </p>
                </Row>
              </Row>
            </Col>
          </Row>
          <div className="flex justify-center items-center gap-4 mt-2 ml-6">
            <CButton type="default" className="min-w-[90px]" onClick={onClose}>
              Hủy
            </CButton>
            <CButton
              loading={loadingAdd}
              className="min-w-[90px]"
              htmlType="submit"
            >
              Xác nhận
            </CButton>
          </div>
        </Form>
      </div>
    </CModal>
  );
};
export const ModalOtpMemo = React.memo(ModalOtp);
