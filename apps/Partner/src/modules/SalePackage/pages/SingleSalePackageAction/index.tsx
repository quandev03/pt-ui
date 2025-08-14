import {
  CButton,
  CButtonClose,
  CInput,
  CInputNumber,
  CSelect,
  TitleHeader,
  validateForm,
} from '@vissoft-react/common';
import { Col, Form, Row } from 'antd';
import { ModalOtpMemo } from '../components/ModalOtp';
import { useLogicActionSingleSalePackage } from './useLogicActionSingleSalePackage';

export const SingleSalePackageAction = () => {
  const {
    form,
    handleClose,
    setOptionPackage,
    handleOpenOtp,
    handleCancel,
    openOtp,
    handleCheckNumberPhone,
    handleCloseOtp,
  } = useLogicActionSingleSalePackage();
  return (
    <div className="flex flex-col w-full h-full">
      <TitleHeader>Bán gói đơn lẻ cho thuê bao</TitleHeader>
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
              <Form.Item
                label="Số thuê bao"
                name="isdn"
                required
                rules={[validateForm.required, validateForm.maxLength(11)]}
              >
                <CInput
                  placeholder="Nhập số thuê bao"
                  maxLength={11}
                  onlyNumber
                  onChange={() => {
                    setOptionPackage([]);
                    form.setFieldValue('idPackage', null);
                  }}
                  onBlur={(e) => {
                    handleCheckNumberPhone(e);
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="idPackage"
                label="Gói cước"
                rules={[validateForm.required]}
              >
                {/* <CSelect
                  loading={loadingCheckIsdnAndGetPackage}
                  allowClear={false}
                  options={optionPackage}
                  className="min-w-[200px]"
                  placeholder="Chọn gói cước"
                /> */}
                <CInput />
              </Form.Item>
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
      <ModalOtpMemo
        handleSuccess={handleCancel}
        handleGenOtp={form.submit}
        open={openOtp}
        onClose={handleCloseOtp}
      />
    </div>
  );
};
