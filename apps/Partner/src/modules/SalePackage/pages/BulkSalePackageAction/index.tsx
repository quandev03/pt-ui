import {
  CButton,
  CButtonClose,
  CInput,
  TitleHeader,
  UploadFileTemplate,
} from '@vissoft-react/common';
import { Col, Form, Row } from 'antd';
import { useLogicBulkSalePackageAction } from './useLogicBulkSalePackageAction';

export const BulkSalePackageAction = () => {
  const { form, handleClose, handleDownloadTemplate } =
    useLogicBulkSalePackageAction();
  return (
    <div className="flex flex-col w-full h-full">
      <TitleHeader>Bán gói theo lô cho thuê bao</TitleHeader>
      <Form
        form={form}
        onFinish={undefined}
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
              <Form.Item
                label="Công nợ tạm tính"
                name="isdn"
                // required
                // rules={[
                //   validateForm.required,
                //   validateForm.maxLength(11),
                //   prefixIsdn,
                // ]}
              >
                <CInput
                  placeholder="Nhập công nợ tạm tính"
                  maxLength={11}
                  onlyNumber
                  onChange={() => {
                    // setOptionPackage([]);
                    form.setFieldValue('idPackage', null);
                  }}
                  // onBlur={(e) => {
                  //   handleCheckNumberPhone(e);
                  // }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="idPackage"
                label="Công nợ với MBF"
                // rules={[validateForm.required]}
              >
                <CInput className="min-w-[200px]" placeholder="Chọn gói cước" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <UploadFileTemplate
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
        </div>
        <div className="flex gap-4 flex-wrap justify-end mt-7">
          <CButton
            onClick={() => {
              form.submit();
            }}
          >
            Thực hiện
          </CButton>
          <CButtonClose onClick={handleClose} />
        </div>
      </Form>
      {/* <ModalOtpMemo
        handleSuccess={handleCancel}
        handleGenOtp={form.submit}
        open={openOtp}
        onClose={handleCloseOtp}
      /> */}
    </div>
  );
};
