import { Button, CInput, NotificationSuccess } from '@react/commons/index';
import validateForm from '@react/utils/validator';
import { Col, Flex, Form, Row } from 'antd';
import { FC, useEffect, useState } from 'react';
import { useConfirmOTPCustomer } from '../../hooks/useConfirmOTPCustomer';
import { useGetOTPCustomer } from '../../hooks/useGetOTPCustomer';
import useOwnershipTransferStore from '../../store';

type CustomerInfoProps = {
  isSuccessCheckingCustomerInfor: boolean;
};

const CheckOtp: FC<CustomerInfoProps> = ({
  isSuccessCheckingCustomerInfor,
}) => {
  const form = Form.useFormInstance();
  const { dataTransferorInfo: data } = useOwnershipTransferStore();
  const {
    mutate: getOTPCustomer,
    isPending: loadingGetOTPCustomer,
    isSuccess: isSuccessGetOTPCustomer,
    data: dataGetOTPCustomer,
    reset: resetGetOTPCustomer,
  } = useGetOTPCustomer((data) => {
    setTimeLeft(120);
    setIsCounting(true);
  });
  const {
    setCheckIsSuccessGetOTPCustomer,
    isCheckSuccessGetOTPCustomer,
    checkIsSuccessConfirmOTP,
    setCheckIsSuccessConfirmOTP,
  } = useOwnershipTransferStore();
  const { isdn, idEkyc, otp, idNo, isShowOldOTP } =
    Form.useWatch((value) => value, form) ?? {};

  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isCounting, setIsCounting] = useState<boolean>(false);
  const [countFailOtp, setCountFailOtp] = useState<number>(0);
  const { mutate: confirmOTPCustomer, isSuccess: isSuccessConfirmOTP } =
    useConfirmOTPCustomer(
      () => {
        setCheckIsSuccessGetOTPCustomer(true);
        NotificationSuccess('Xác thực OTP thành công');
        setIsCounting(false);
        setCountFailOtp(0);
        setTimeLeft(0);
        setCheckIsSuccessConfirmOTP(isSuccessConfirmOTP);
      },
      (error) => {
        form.setFields([{ name: 'otp', errors: [error.detail] }]);
        setCountFailOtp(countFailOtp + 1);
        if (countFailOtp >= 5) {
          setCheckIsSuccessConfirmOTP(isSuccessConfirmOTP);
          setIsCounting(false);
          setTimeLeft(0);
          form.resetFields(['otp']);
          resetGetOTPCustomer();
        }
      }
    );
  // Định dạng thời gian
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCounting && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isCounting && timeLeft === 0) {
      setIsCounting(false);
      form.setFields([{ name: 'otp', errors: ['OTP đã hết hạn'] }]);
    }
    return () => clearInterval(timer);
  }, [isCounting, timeLeft]);

  const handleSendOtp = () => {
    form.resetFields(['otp']);
    getOTPCustomer({
      idEkyc: idEkyc,
      isdn: isdn,
    });
  };

  const handleConfirmOtp = () => {
    const { otp, isdn, idEkyc } = form.getFieldsValue();
    if (!otp || !dataGetOTPCustomer) return;
    confirmOTPCustomer({
      otp,
      id: dataGetOTPCustomer.id,
      isdn: isdn.replace(/0(\d+)/, '$1'),
      idEkyc: idEkyc,
      transactionId: dataGetOTPCustomer.transactionId,
      idNo: idNo,
    });
  };
  useEffect(() => {
    if (isdn) {
      setTimeLeft(0);
      form.resetFields(['otp']);
      form.setFields([{ name: 'otp', errors: [] }]);
      resetGetOTPCustomer();
    }
  }, [isdn, form, resetGetOTPCustomer]);
  if (!isShowOldOTP) return;
  return (
    <fieldset>
      <legend>Kiểm tra OTP</legend>
      <Row gutter={12}>
        <Col span={12}>
          <Form.Item
            label="Nhập OTP"
            name="otp"
            rules={[validateForm.required, validateForm.maxLength(10)]}
          >
            <CInput
              placeholder="Nhập OTP"
              onlyNumber
              maxLength={10}
              addonAfter={timeLeft ? formatTime(timeLeft) : undefined}
              allowClear={false}
              disabled={
                !isSuccessGetOTPCustomer || isCheckSuccessGetOTPCustomer
              }
            />
          </Form.Item>
          <Form.Item label=" " name="checkOtp">
            <Flex justify="center" gap={8}>
              <Button
                disabled={!!timeLeft || isCheckSuccessGetOTPCustomer}
                loading={loadingGetOTPCustomer}
                onClick={handleSendOtp}
                className="w-[8.5rem]"
              >
                Gửi OTP
              </Button>
              <Button
                disabled={
                  !otp ||
                  !isSuccessGetOTPCustomer ||
                  checkIsSuccessConfirmOTP ||
                  isCheckSuccessGetOTPCustomer
                }
                onClick={handleConfirmOtp}
                className="w-[8.5rem]"
              >
                Xác thực OTP
              </Button>
            </Flex>
          </Form.Item>
        </Col>
      </Row>
    </fieldset>
  );
};

export default CheckOtp;
