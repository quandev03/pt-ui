import CButton from '@react/commons/Button';
import { CInput, CUploadFileTemplate } from '@react/commons/index';
import { TitleHeader } from '@react/commons/Template/style';
import { AnyElement } from '@react/commons/types';
import { Card, Col, Flex, Form, InputProps, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import numeral from 'numeral';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useCheckData from '../hook/useCheckData';
import useGetAmount from '../hook/useGetAmount';
import { useGetFile } from '../hook/useGetFile';
import { useTopupAssignPackageStore } from '../store';
import { ModalOtpMemo } from './ModalOtp';
import { useNavigate } from 'react-router-dom';
import { IPayloadCheckFile, IPayloadConfirmOtp } from '../type';
import useCheckFileFormat from '../hook/useCheckFileFormat';
const InputAmount = ({ amount }: { amount: number } & InputProps) => {
  return (
    <CInput
      disabled
      value={amount ? numeral(amount).format('0,0') : undefined}
      className="topUp-subscription--hint max-w-[300px]"
      suffix="VNĐ"
    />
  );
};

const ModalAdd = () => {
  const navigate = useNavigate();
  const [form] = useForm();
  const [openOtp, setOpenOtp] = useState<boolean>(false);
  const { setCount, reset, setDataGenOtp, setFile } =
    useTopupAssignPackageStore();
  const { mutate: checkData, isPending: loadingCheckData, isError } = useCheckData(form,
    (data) => {
      setDataGenOtp(data);
      setCount(120);
      setOpenOtp(true);
      setFile(form.getFieldValue('attachment'));
    },
  );
  const { mutate: checkFileFormat } = useCheckFileFormat(form);
  const handleUploadFile = useCallback(
    async (value: AnyElement) => {
      await form.validateFields();
      checkFileFormat(value);
    },
    [checkFileFormat, form]
  );
  const handleCloseOtp = useCallback(() => {
    setOpenOtp(false);
  }, [setOpenOtp]);
  const handleCancel = useCallback(() => {
    form.resetFields();
    setOpenOtp(false);
    navigate(-1);
    reset();
  }, [form, reset, navigate, setOpenOtp]);
  const { mutate: downloadFile } = useGetFile();
  const handleDownloadTemplate = useCallback(() => {
    downloadFile();
  }, [downloadFile]);
  const { data: dataAmount } = useGetAmount();
  const amount = useMemo(() => {
    if (dataAmount) {
      return String(dataAmount.amount);
    }
    return '0';
  }, [dataAmount]);
  useEffect(() => {
    if (isError) {
      setDataGenOtp({} as IPayloadConfirmOtp);
    }
  }, [isError, setDataGenOtp]);
  const handleSubmit = useCallback((value: IPayloadCheckFile) => {
    checkData({ file: value.attachment, checkSubmit: true });
  }, [checkData]);
  return (
    <>
      <TitleHeader>Nạp tiền airtime và gán gói trừ TKC</TitleHeader>
      <Form
        form={form}
        colon={false}
        onFinish={handleSubmit}
        labelWrap
        labelCol={{ prefixCls: 'w-[200px]' }}
      >
        <Card>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={24} md={18} lg={16}>
              <Form.Item label="Số dư tài khoản Airtime" name="amount">
                <InputAmount amount={+amount.replace(',', '')} />
              </Form.Item>
            </Col>
            <Col xs={0} sm={0} md={6} lg={8}></Col>
            <Col span={24}>
              <CUploadFileTemplate
                required
                beforeUpload={handleUploadFile}
                onDownloadTemplate={handleDownloadTemplate}
                accept={[
                  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                ]}
                label="Danh sách thuê bao"
                name={'attachment'}
              />
            </Col>
          </Row>
        </Card>
        <Flex className="w-full mt-4" gap={12} justify="end">
          <CButton
            loading={loadingCheckData}
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
        open={openOtp}
        onClose={handleCloseOtp}
      />
    </>
  );
};
export default ModalAdd;
