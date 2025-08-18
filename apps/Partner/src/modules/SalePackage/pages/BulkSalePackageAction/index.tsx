import {
  CButton,
  CButtonClose,
  CInputNumber,
  TitleHeader,
  UploadFileTemplate,
} from '@vissoft-react/common';
import { Col, Form, Row } from 'antd';
import { useEffect } from 'react'; // 1. Import useEffect
import { useGetDebitLimit } from '../../../../../src/hooks/useGetDebitLimit'; // 1. Import the hook
import { ModalOtpMemo } from '../components/ModalOtp';
import { useLogicBulkSalePackageAction } from './useLogicBulkSalePackageAction';

export const BulkSalePackageAction = () => {
  const {
    form,
    handleClose,
    handleDownloadTemplate,
    handleCancel,
    openOtp,
    handleOpenOtp,
    loadingCheckData,
    handleCloseOtp,
  } = useLogicBulkSalePackageAction();

  // 2. Call the hook to get the debit limit data
  const { data: debitLimitData } = useGetDebitLimit();

  // 3. Use useEffect to set the form values when the data arrives
  useEffect(() => {
    if (debitLimitData) {
      form.setFieldsValue({
        debitLimit: debitLimitData.debitLimit,
        debitLimitMbf: debitLimitData.debitLimitMbf,
      });
    }
  }, [debitLimitData, form]);

  return (
    <div className="flex flex-col w-full h-full">
      <TitleHeader>Bán gói theo lô cho thuê bao</TitleHeader>
      <Form
        form={form}
        onFinish={handleOpenOtp}
        labelAlign="left"
        labelCol={{ span: 5 }}
        labelWrap={true}
        validateTrigger={['onSubmit']}
        colon={false}
        initialValues={{
          status: 1,
        }}
      >
        <div className="bg-white rounded-[10px] px-6 pt-4 pb-8">
          <Row gutter={[30, 0]}>
            <Col span={12}>
              <Form.Item label="Hạn mức tạm tính" name="debitLimit">
                <CInputNumber disabled className="!text-black" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Hạn mức với MBF" name="debitLimitMbf">
                <CInputNumber disabled className="!text-black" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <UploadFileTemplate
                required
                onDownloadTemplate={handleDownloadTemplate}
                accept={[
                  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                ]}
                label="File số"
                name={'attachment'}
              />
            </Col>
          </Row>
        </div>
        <div className="flex gap-4 flex-wrap justify-end mt-7">
          <CButton
            loading={loadingCheckData}
            onClick={() => {
              form.submit();
            }}
          >
            Thực hiện
          </CButton>
          <CButtonClose onClick={handleClose} />
        </div>
      </Form>
      <ModalOtpMemo
        handleSuccess={handleCancel}
        handleGenOtp={form.submit}
        open={openOtp}
        onClose={handleCloseOtp || handleClose}
      />
    </div>
  );
};
