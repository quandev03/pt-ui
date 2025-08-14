import {
  CButton,
  CButtonClose,
  CInputNumber,
  TitleHeader,
  UploadFileTemplate,
} from '@vissoft-react/common';
import { Col, Form, Row } from 'antd';
import { useLogicBulkSalePackageAction } from './useLogicBulkSalePackageAction';
import { ModalOtpMemo } from '../components/ModalOtp';

export const BulkSalePackageAction = () => {
  const {
    form,
    handleClose,
    handleDownloadTemplate,
    handleCancel,
    openOtp,
    handleOpenOtp,
    loadingCheckData,
  } = useLogicBulkSalePackageAction();
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
              <Form.Item label="Hạn mức tạm tính" name="isdn">
                <CInputNumber disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="idPackage" label="Hạn mức với MBF">
                <CInputNumber disabled />
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
        onClose={handleClose}
      />
    </div>
  );
};
