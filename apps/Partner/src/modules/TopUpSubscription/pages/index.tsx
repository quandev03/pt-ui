import { CButtonClose, CButtonSave } from '@react/commons/Button';
import { CInput } from '@react/commons/index';
import { TitleHeader } from '@react/commons/Template/style';
import validateForm from '@react/utils/validator';
import { Button, Card, Col, Flex, Form, Row, Space, Spin } from 'antd';
import numeral from 'numeral';
import { useEffect, useState } from 'react';
import ModalConfirm from '../components/ModalConfirm';
import { useGetAirtimeAcct } from '../hooks/useGetAirtimeAcct';
import { useTopUpSubscription } from '../hooks/useTopUpSubscription';
import '../index.scss';
import { InputProps } from 'antd/lib';
import { usePrefixIsdnRegex } from 'apps/Partner/src/hooks/usePrefixIsdnQuery';

const roundNumber = 10000;
const valueOptions = [1, 2, 5, 10, 20, 50].map((x) =>
  numeral(x * roundNumber).format('0,0')
);

const getRealAmount = (amount: string) => {
  const amountCur = Number(amount.replace(/\,/g, ''));
  return String(amountCur * roundNumber);
};

const InputAmount = ({ amount, ...props }: { amount: number } & InputProps) => {
  return (
    <>
      <CInput
        maxLength={10}
        placeholder="0,000"
        onlyNumber
        className="topUp-subscription--amount"
        {...props}
      />
      <CInput
        disabled
        value={amount ? numeral(amount * roundNumber).format('0,0') : undefined}
        className="topUp-subscription--hint"
      />
    </>
  );
};

const SubscriptionPage: React.FC = () => {
  const [form] = Form.useForm();
  const [isOpenConfirm, setIsOpenConfirm] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const prefixIsdn = usePrefixIsdnRegex();
  const {
    mutateAsync: mutateTopUp,
    isPending: isLoadingTopUp,
    data: dataTopUp,
  } = useTopUpSubscription();
  const {
    data: dataAirtime,
    isFetching: isLoadingAirtime,
    refetch: refetchAirtime,
  } = useGetAirtimeAcct();
  const { isdn, amount } = Form.useWatch((e) => e, form) ?? {};
  useEffect(() => {
    if (dataAirtime?.amount) {
      form.setFieldValue('balance', numeral(dataAirtime.amount).format('0,0'));
    }
  }, [dataAirtime?.amount, form, isLoadingAirtime]);
  useEffect(() => {
    form.setFieldValue(
      'amount',
      amount
        ? numeral(+String(amount).replace(/\,/g, '') * roundNumber)
          .format('0,0')
          .slice(0, 15) //get max length 15
          .slice(0, -5) //trim 5 last character
        : ''
    );
  }, [amount, form]);
  const handleFinish = ({ isdn, amount }: any) => {
    mutateTopUp(
      { isdn: isdn.replace(/^0/, ''), amount: getRealAmount(amount) },
      {
        onSuccess: () => {
          setIsOpenConfirm(true);
        },
      }
    );
  };
  const handleCancel = () => {
    form.resetFields(['amount', 'isdn']);
  };
  const handleClickValue = (value: string, idx: number) => {
    form.setFieldValue('amount', value.slice(0, -5));
    setSelectedIndex(idx);
    form.validateFields(['amount']);
  };

  return (
    <>
      <TitleHeader>Nạp tiền cho thuê bao</TitleHeader>
      <Spin spinning={isLoadingTopUp || isLoadingAirtime}>
        <Form
          form={form}
          colon={false}
          onFinish={handleFinish}
          labelCol={{ prefixCls: 'w-[240px]' }}
        >
          <Card className="mb-5">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label="Số dư tài khoản Airtime" name="balance">
                  <CInput placeholder="Số dư tài khoản Airtime" disabled />
                </Form.Item>
              </Col>
              <Col span={12} />
              <Col span={12}>
                <Form.Item
                  label="Nhập số thuê bao"
                  name="isdn"
                  rules={[
                    validateForm.required,
                    validateForm.maxLength(11),
                    prefixIsdn,
                  ]}
                >
                  <CInput
                    maxLength={11}
                    placeholder="Nhập số thuê bao"
                    onlyNumber
                  />
                </Form.Item>
              </Col>
              <Col span={12} />
              <Col span={12}>
                <Form.Item
                  label="Chọn mệnh giá hoặc nhập số tiền"
                  name="amount"
                  rules={[
                    validateForm.required,
                    validateForm.maxNumber(
                      500,
                      'Hạn mức tối đa 5 triệu đồng/1 giao dịch'
                    ),
                  ]}
                >
                  <InputAmount amount={+amount?.replaceAll(',', '')} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Flex gap="middle">
                  {valueOptions.map((x, idx: number) => (
                    <Button
                      className="w-full"
                      type={idx !== selectedIndex ? 'default' : 'primary'}
                      onClick={() => handleClickValue(x, idx)}
                    >
                      {x}
                    </Button>
                  ))}
                </Flex>
              </Col>
            </Row>
            <Row justify="end" className="mt-4">
              <Space size="middle">
                <CButtonSave htmlType="submit">Thực hiện</CButtonSave>
                <CButtonClose type="default" onClick={handleCancel}>
                  Hủy
                </CButtonClose>
              </Space>
            </Row>
          </Card>
        </Form>
      </Spin>
      <ModalConfirm
        isOpen={isOpenConfirm}
        setIsOpen={setIsOpenConfirm}
        data={dataTopUp}
        onSendOtp={() => mutateTopUp({ isdn, amount: getRealAmount(amount) })}
        onRefresh={() => {
          refetchAirtime();
          handleCancel();
        }}
      />
    </>
  );
};

export default SubscriptionPage;
