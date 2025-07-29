import { Col, Form, Row } from 'antd';
import { CDatePicker, CInput } from '../../../../../../commons/src/lib/commons';
import { useGenContractNo } from '../hooks/useGenContractNo';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import useActivateM2M from '../store';
import validateForm from '@react/utils/validator';

const ThongTinKichHoat = () => {
  const form = Form.useFormInstance();
  const { mutate: genContractNo } = useGenContractNo();
  const { isGenCode, setIsGenCode } = useActivateM2M();
  useEffect(() => {
    if (!form.getFieldValue('contractDate'))
      form.setFieldsValue({ contractDate: dayjs() });
  }, [form.getFieldValue('contractDate')]);

  useEffect(() => {
    if (isGenCode) genContractNo();
    setIsGenCode(false);
  }, [isGenCode]);

  return (
    <fieldset>
      <legend>Thông tin hợp đồng kích hoạt</legend>
      <Row gutter={12}>
        <Col span={12}>
          <Form.Item
            label="Số hợp đồng ĐK TTTB"
            name="contractNoM2M"
            labelCol={{ span: 6 }}
            rules={[validateForm.required]}
          >
            <CInput maxLength={20} placeholder="Số hợp đồng ĐK TTTB" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Ngày ký hợp đồng"
            name="contractDate"
            rules={[validateForm.required]}
          >
            <CDatePicker placeholder="Ngày ký hợp đồng" />
          </Form.Item>
        </Col>
      </Row>
    </fieldset>
  );
};

export default ThongTinKichHoat;
