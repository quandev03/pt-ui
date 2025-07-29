import { faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CButtonClose } from '@react/commons/Button';
import {
  Button,
  CInput,
  CModal,
  NotificationSuccess,
} from '@react/commons/index';
import validateForm from '@react/utils/validator';
import { useIsMutating, UseMutateAsyncFunction } from '@tanstack/react-query';
import { Flex, Form, Typography } from 'antd';
import dayjs from 'dayjs';
import React, { useMemo, useState } from 'react';
import { useConfirmOtp } from '../hooks/useConfirmOtp';
import { queryKeyTopUp, TopUpResponse } from '../hooks/useTopUpSubscription';
import { useGetProfileTopupSubscription } from '../hooks/useGetProfileTopupSubscription';
import { AnyElement, FieldErrorsType } from '@react/commons/types';

export interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  data: TopUpResponse | undefined;
  onSendOtp: UseMutateAsyncFunction<TopUpResponse>;
  onRefresh: () => void;
}

const expiredTimeDefault = 120; //milliseconds

const ModalConfirm: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  data,
  onSendOtp,
  onRefresh,
}) => {
  const [form] = Form.useForm();
  const [counter, setCounter] = useState(expiredTimeDefault);
  const [expiredTime, setExpiredTime] = useState<string>('');
  const { mutate: mutateOtp, isPending: isLoadingOtp } = useConfirmOtp();
  const isLoadingTopUp = !!useIsMutating({ mutationKey: [queryKeyTopUp] });
  const { data: dataProfile } = useGetProfileTopupSubscription(isOpen);
  const phoneNumber = useMemo(() => {
    if (dataProfile) return dataProfile?.phoneNumber;
  }, [dataProfile]);
  React.useEffect(() => {
    if (counter < 0 || !isOpen) return;
    const myTimeout = setTimeout(() => {
      setCounter(counter - 1);
    }, 1000);
    setExpiredTime(
      counter > 0
        ? `${dayjs().startOf('day').add(counter, 'second').format('mm:ss')} `
        : ''
    );
    return () => {
      if (!isOpen) {
        setCounter(expiredTimeDefault);
        setExpiredTime('');
        clearTimeout(myTimeout);
      }
    };
  }, [counter, isOpen]);
  const handleCancel = () => {
    setIsOpen(false);
    form.resetFields();
  };
  const handleFinish = ({ otp }: { otp: string }) => {
    mutateOtp(
      { ...data, otp },
      {
        onSuccess: () => {
          NotificationSuccess('Nạp tiền thành công');
          handleCancel();
          onRefresh();
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
        },
      }
    );
  };
  const handleSendOtp = () => {
    onSendOtp().then(() => {
      setCounter(expiredTimeDefault);
    });
  };
  return (
    <CModal
      title={'Xác nhận'}
      open={isOpen}
      width={500}
      onCancel={handleCancel}
      className="modal-body-shorten"
      loading={isLoadingOtp || isLoadingTopUp}
      footer={[
        <CButtonClose type="default" htmlType="reset" onClick={handleCancel}>
          Hủy
        </CButtonClose>,
        <Button
          icon={<FontAwesomeIcon icon={faSave} />}
          onClick={form.submit}
          htmlType="submit"
          disabled={isLoadingOtp}
        >
          Xác nhận
        </Button>,
      ]}
    >
      <Flex vertical align="center" justify="center">
        <div>{`Nhập mã OTP gửi về SĐT ${phoneNumber ?? ''} để xác nhận`}</div>
        <div className="mb-4">nạp gói cho thuê bao</div>
        <Form form={form} onFinish={handleFinish} colon={false} layout="inline">
          <Form.Item
            labelAlign="left"
            label={'Mã OTP'}
            name="otp"
            rules={[
              validateForm.required,
              validateForm.minLength(6, 'OTP không đúng định dạng'),
            ]}
            className="mb-0"
          >
            <CInput maxLength={6} placeholder="Nhập mã OTP" onlyNumber />
          </Form.Item>
          <Flex vertical align="center" gap={4}>
            <Button onClick={handleSendOtp} disabled={!!expiredTime}>
              Gửi lại
            </Button>
            {!!expiredTime && (
              <Typography.Text type="danger">{expiredTime}</Typography.Text>
            )}
          </Flex>
        </Form>
      </Flex>
    </CModal>
  );
};

export default ModalConfirm;
