import CButton from '@react/commons/Button';
import { CUploadFileTemplate } from '@react/commons/index';
import CSelect from '@react/commons/Select';
import { TitleHeader } from '@react/commons/Template/style';
import { AnyElement } from '@react/commons/types';
import validateForm from '@react/utils/validator';
import { Card, Col, Flex, Form, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useCallback, useState } from 'react';
import useCheckData from '../hook/useCheckData';
import { useGetFile } from '../hook/useGetFile';
import { useSellSinglePackageStore } from '../store';
import { PaymentMethod, PaymentMethodValueType } from '../type';
import { ModalOtpMemo } from './ModalOtp';

const ModalAdd = () => {
  const [form] = useForm();
  const [openOtp, setOpenOtp] = useState<boolean>(false);
  const { setCount, reset, setDataGenOtp } = useSellSinglePackageStore();
  const { mutate: checkData, isPending: loadingCheckData } = useCheckData(
    (data) => {
      setCount(120);
      setOpenOtp(true);
      setDataGenOtp(data);
    }
  );
  const handleOpenOtp = useCallback(
    (value: AnyElement) => {
      checkData(value.attachment);
    },
    [checkData]
  );
  const optionPaymentMethod = [
    {
      label: PaymentMethod.PAYMENT_METHOD_DEBT,
      value: PaymentMethodValueType.PAYMENT_METHOD_DEBT,
    },
  ];
  const handleCloseOtp = useCallback(() => {
    setOpenOtp(false);
  }, [setOpenOtp]);
  const handleCancel = useCallback(() => {
    form.resetFields();
    setOpenOtp(false);
    reset();
  }, [form, reset]);
  const { mutate: downloadFile } = useGetFile();
  const handleDownloadTemplate = useCallback(() => {
    downloadFile();
  }, [downloadFile]);
  return (
    <>
      <TitleHeader>Bán gói theo lô cho thuê bao</TitleHeader>
      <Form
        form={form}
        colon={false}
        onFinish={handleOpenOtp}
        labelWrap
        labelCol={{ prefixCls: 'w-[200px]' }}
      >
        <Card>
          <Row gutter={[24, 24]}>
            <Col span={8}>
              <Form.Item
                name="typePayment"
                label="Hình thức thanh toán"
                rules={[validateForm.required]}
                initialValue={PaymentMethodValueType.PAYMENT_METHOD_DEBT}
              >
                <CSelect
                  disabled
                  showSearch={false}
                  onKeyDown={(e) => e.preventDefault()}
                  allowClear={false}
                  options={optionPaymentMethod}
                  className="min-w-[200px]"
                  placeholder="Chọn hình thức thanh toán"
                />
              </Form.Item>
            </Col>
            <Col span={16}></Col>
            <Col span={24}>
              <CUploadFileTemplate
                required
                onDownloadTemplate={handleDownloadTemplate}
                accept={[
                  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                ]}
                label="Tải file"
                name={'attachment'}
              />
            </Col>
          </Row>
        </Card>
        <Flex className="w-full mt-4" gap={12} justify="end">
          <CButton
            loading={loadingCheckData}
            disabled={false}
            htmlType="submit"
          >
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
        file={form.getFieldValue('attachment')}
        open={openOtp}
        onClose={handleCloseOtp}
      />
    </>
  );
};
export default ModalAdd;
