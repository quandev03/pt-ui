import CButton from '@react/commons/Button';
import CInput from '@react/commons/Input';
import CSelect from '@react/commons/Select';
import { TitleHeader } from '@react/commons/Template/style';
import useGetDataFromQueryKey from '@react/hooks/useGetDataFromQueryKey';
import validateForm from '@react/utils/validator';
import { Card, Col, Flex, Form, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { IUserInfo } from 'apps/Partner/src/components/layouts/types';
import { REACT_QUERY_KEYS } from 'apps/Partner/src/constants/querykeys';
import {
  usePrefixIsdnQuery,
  usePrefixIsdnRegex,
} from 'apps/Partner/src/hooks/usePrefixIsdnQuery';
import { useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import useCheckIsdnAndGetPackage from '../hook/useCheckIsdnAndGetPackage';
import useGenOtp from '../hook/useGenOtp';
import { useSellSinglePackageStore } from '../store';
import {
  handleConvertIsdn,
  PaymentMethod,
  PaymentMethodValueType,
} from '../type';
import { ModalOtpMemo } from './ModalOtp';
import { AnyElement } from '@react/commons/types';

const ModalAdd = () => {
  const [form] = useForm();
  const intl = useIntl();
  const [openOtp, setOpenOtp] = useState<boolean>(false);
  const prefixIsdn = usePrefixIsdnRegex();
  const { setDataGenOtp, setCount, reset } = useSellSinglePackageStore();
  const { data: prefixIsdnAll } = usePrefixIsdnQuery();

  const regexPrefixIsdn = useMemo(() => {
    if (!prefixIsdnAll) return;
    const newData = (prefixIsdnAll ?? [])
      ?.map((item) => item.substring(1))
      ?.join('|');
    const prefixIsdn = new RegExp(`^0?(${newData})`);
    return prefixIsdn;
  }, [prefixIsdnAll]);

  const { mutate: genOtp } = useGenOtp((data) => {
    const { idPackage, isdn, typePayment } = form.getFieldsValue();
    setDataGenOtp({
      isdn,
      transactionId: data.transactionId,
      id: data.id,
      otp: undefined,
      cycle: optionPackage.find((item) => item.value === idPackage)?.cycle,
      unit: optionPackage.find((item) => item.value === idPackage)?.unit,
      type: typePayment,
      idPackage: idPackage,
      pckCode: optionPackage.find((item) => item.value === idPackage)?.label,
      idEkyc: data.idEkyc
    });
    setOpenOtp(true);
    setCount(120);
  });

  const [optionPackage, setOptionPackage] = useState<
    { label: string; value: string; cycle: number | string; unit: string }[]
  >([]);

  const {
    mutate: checkIsdnAndGetPackage,
    isPending: loadingCheckIsdnAndGetPackage,
  } = useCheckIsdnAndGetPackage((data) => {
    setOptionPackage(
      data.map((option) => ({
        label: option.packageCode,
        value: option.packageId,
        cycle: option.cycle,
        unit: option.unit,
      }))
    );
  });

  const handleOpenOtp = useCallback(
    (value: AnyElement) => {
      const data = {
        isdn: handleConvertIsdn(value.isdn),
        isPackage: value.idPackage,
        pckCode: optionPackage.find((item) => item.value === value.idPackage)
          ?.label,
        typePayment: Number(value.typePayment),
      };
      genOtp(data);
    },
    [genOtp, optionPackage]
  );

  const optionPaymentMethod = [
    {
      label: PaymentMethod.PAYMENT_METHOD_DEBT,
      value: PaymentMethodValueType.PAYMENT_METHOD_DEBT,
    },
    {
      label: PaymentMethod.EXCEPT_TKC,
      value: PaymentMethodValueType.EXCEPT_TKC,
    },
  ];

  const handleCloseOtp = useCallback(() => {
    setOpenOtp(false);
  }, [setOpenOtp]);

  const handleCheckNumberPhone = useCallback(
    (e: AnyElement) => {
      const value = e.target.value.trim();
      if (regexPrefixIsdn?.test(value) && value) {
        if (value.startsWith('84')) {
          form.setFieldValue('isdn', value.replace('84', '0'));
          form.validateFields(['isdn']);
          checkIsdnAndGetPackage({
            isdn: handleConvertIsdn(value),
            type: form.getFieldValue('typePayment'),
          });
        } else if (
          !value.startsWith('0') &&
          value.length > 0 &&
          value.length < 11
        ) {
          form.setFieldValue('isdn', '0' + value);
          form.validateFields(['isdn']);
          checkIsdnAndGetPackage({
            isdn: handleConvertIsdn(value),
            type: form.getFieldValue('typePayment'),
          });
        } else if (
          value.startsWith('0') &&
          value.length > 0 &&
          value.length <= 11
        ) {
          checkIsdnAndGetPackage({
            isdn: handleConvertIsdn(value),
            type: form.getFieldValue('typePayment'),
          });
        } else if (value.length === 11) {
          form.setFields([
            {
              name: 'isdn',
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
      }
    },
    [form, checkIsdnAndGetPackage, intl, regexPrefixIsdn]
  );

  const handleCancel = useCallback(() => {
    form.resetFields();
    setOpenOtp(false);
    reset();
  }, [form, reset]);

  return (
    <>
      <TitleHeader>Bán gói đơn lẻ cho thuê bao</TitleHeader>
      <Form
        form={form}
        colon={false}
        onFinish={handleOpenOtp}
        labelWrap
        labelCol={{ prefixCls: 'w-[200px]' }}
      >
        <Card>
          <Row gutter={[0, 0]}>
            <Col span={12}>
              <Form.Item
                name="typePayment"
                label="Hình thức thanh toán"
                rules={[validateForm.required]}
              >
                <CSelect
                  showSearch={false}
                  onKeyDown={(e) => {
                    if (e.key !== 'Tab' && !(e.key === 'Tab' && e.shiftKey)) {
                      e.preventDefault();
                    }
                  }}
                  allowClear={false}
                  options={optionPaymentMethod}
                  className="min-w-[200px]"
                  placeholder="Chọn hình thức thanh toán"
                  onChange={() => {
                    if (form.getFieldValue('isdn')) {
                      handleCheckNumberPhone({ target: { value: form.getFieldValue('isdn') } });
                    }
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}></Col>
            <Col span={12}>
              <Form.Item
                label="Số thuê bao"
                name="isdn"
                rules={[
                  validateForm.required,
                  validateForm.maxLength(11),
                  prefixIsdn,
                ]}
              >
                <CInput
                  placeholder="Số thuê bao"
                  onlyNumber
                  onChange={() => {
                    setOptionPackage([]);
                    form.setFieldValue('idPackage', null);
                  }}
                  className="min-w-[200px]"
                  maxLength={11}
                  onBlur={(e) => {
                    handleCheckNumberPhone(e);
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}></Col>
            <Col span={12}>
              <Form.Item
                name="idPackage"
                label="Gói cước"
                rules={[validateForm.required]}
              >
                <CSelect
                  loading={loadingCheckIsdnAndGetPackage}
                  allowClear={false}
                  options={optionPackage}
                  className="min-w-[200px]"
                  placeholder="Chọn gói cước"
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Flex className="w-full mt-4" gap={12} justify="end">
          <CButton disabled={false} htmlType="submit">
            Thực hiện
          </CButton>
          <CButton disabled={false} type="default" onClick={handleCancel}>
            Hủy
          </CButton>
        </Flex>
      </Form>
      <ModalOtpMemo
        handleSuccess={handleCancel}
        handleGenOtp={form.submit}
        typePayment={form.getFieldValue('typePayment')}
        open={openOtp}
        onClose={handleCloseOtp}
      />
    </>
  );
};
export default ModalAdd;
