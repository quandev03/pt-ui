import validateForm from '@react/utils/validator';
import { Col, Form, Row } from 'antd';
import { useEffect } from 'react';
import { CInput } from '../../../../../../commons/src/lib/commons';
import useCensorshipStore from '../store';
import { ISubDocument } from '../types';
type Props = {
  subDocDetail: ISubDocument | undefined;
};
const CustomerInfo: React.FC<Props> = ({ subDocDetail }) => {
  const form = Form.useFormInstance();
  const { setContractUploadType } = useCensorshipStore();
  const currentUrl = window.location.href;
  const isUpdateHistory =
    currentUrl.includes('history-edit') || currentUrl.includes('history-view');
  useEffect(() => {
    if (subDocDetail) {
      setContractUploadType(Number(subDocDetail.contractUploadType));
      form.setFieldsValue({
        phoneNumber: isUpdateHistory
          ? subDocDetail.isdn
          : subDocDetail.phoneNumber,
        serialSim: subDocDetail.serialSim,
        contractNo: subDocDetail.contractNo,
        customerCode: subDocDetail.customerCode,
        contractUploadType: Number(subDocDetail.contractUploadType),
      });
    }
  }, [subDocDetail]);
  return (
    <fieldset>
      <legend>Thông tin khách hàng</legend>
      <Row gutter={20}>
        <Col span={12}>
          <Form.Item
            label="Số thuê bao"
            name="phoneNumber"
            rules={[
              validateForm.required,
              // validateForm.maxLength(10),
              // validateForm.phoneNumber,
            ]}
          >
            <CInput
              disabled={true}
              placeholder="Số thuê bao"
              onlyNumber
              maxLength={10}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Serial SIM"
            name="serialSim"
            rules={[
              validateForm.required,
              // validateForm.lengthNumber(16)
            ]}
          >
            <CInput
              disabled={true}
              placeholder="Số serial SIM"
              onlyNumber
              maxLength={16}
            />
          </Form.Item>
        </Col>
        <Form.Item name={'contractNo'}></Form.Item>
        <Form.Item name={'contractUploadType'} hidden></Form.Item>
      </Row>
    </fieldset>
  );
};

export default CustomerInfo;
