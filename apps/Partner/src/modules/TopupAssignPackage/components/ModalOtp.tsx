import CButton from '@react/commons/Button';
import CInput from '@react/commons/Input';
import CModal from '@react/commons/Modal';
import validateForm from '@react/utils/validator';
import { Col, Form, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useCallback, useEffect, useState } from 'react';
import useAdd from '../hook/useAdd';
import { useTopupAssignPackageStore } from '../store';
import { handleConvertIsdn, IPayloadRegister } from '../type';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import { REACT_QUERY_KEYS } from 'apps/Partner/src/constants/querykeys';
import { IUserInfo } from 'apps/Partner/src/components/layouts/types';

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
  const { count, setCount, dataGenOtp, file } = useTopupAssignPackageStore();
  const { mutate: addPackage, isPending: loadingAdd } = useAdd(() => {
    handleSuccess();
    form.resetFields();
  }, form);
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
  }, [count, setCount]);
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
        otpConfirmRequest: {
          otp: value.otp,
          id: dataGenOtp?.id,
          transactionId: dataGenOtp?.transactionId,
          isdn: handleConvertIsdn(dataGenOtp?.isdn),
          idEkyc: dataGenOtp?.idEkyc,
        },
        file: file,
      };
      addPackage(data as IPayloadRegister);
    },
    [dataGenOtp, file, addPackage]
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
          Nhập mã OTP gửi về SĐT {userLogin?.phoneNumber} để xác nhận nạp tiền và gán gói cho thuê bao:
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
