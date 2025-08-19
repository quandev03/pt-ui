import {
  CButton,
  CButtonClose,
  CInputNumber,
  TitleHeader,
  UploadFileTemplate,
} from '@vissoft-react/common';
import { Col, Form, Row } from 'antd';
import { useEffect } from 'react';
import { useGetDebitLimit } from '../../../../../src/hooks/useGetDebitLimit';
import { ModalOtpMemo } from '../components/ModalOtp';
import { useLogicBulkSalePackageAction } from './useLogicBulkSalePackageAction';

export const BulkSalePackageAction = () => {
  const {
    form,
    handleClose,
    handleDownloadTemplate,
    handleCancel,
    openOtp,
    loadingCheckData,
    handleCloseOtp,
    handleSubmitAndCheckFile,
    handleConfirmWithPin,
    loadingAddBulk,
  } = useLogicBulkSalePackageAction();

  const { data: debitLimitData } = useGetDebitLimit();

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
        onFinish={handleSubmitAndCheckFile}
        labelAlign="left"
        labelCol={{ span: 5 }}
        labelWrap={true}
      >
        <div className="bg-white rounded-[10px] px-6 pt-4 pb-8">
          <Row gutter={[30, 0]}>
            <Col span={12}>
              <Form.Item label="Hạn mức tạm tính" name="debitLimit">
                <CInputNumber
                  disabled
                  className="!text-black"
                  formatter={(value) =>
                    value ? `${value.toLocaleString('vi-VN')} ₫` : ''
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="debitLimitMbf" label="Hạn mức với MBF">
                <CInputNumber
                  disabled
                  className="!text-black"
                  formatter={(value) =>
                    value ? `${value.toLocaleString('vi-VN')} ₫` : ''
                  }
                />
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
          <CButton loading={loadingCheckData} onClick={() => form.submit()}>
            Thực hiện
          </CButton>
          <CButtonClose onClick={handleClose} />
        </div>
      </Form>
      <ModalOtpMemo
        handleSuccess={handleCancel}
        open={openOtp}
        onClose={handleCloseOtp}
        onConfirm={handleConfirmWithPin}
        loading={loadingAddBulk}
      />
    </div>
  );
};
