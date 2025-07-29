import CInput from '@react/commons/Input';
import { Col, Form, Row } from 'antd';

const ThongTinKichHoat = () => {
  return (
    <fieldset>
      <legend>Thông tin khách hàng</legend>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Form.Item label="Số hợp đồng" name="contractNo" required hidden>
            <CInput />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item required label="Mã KH" name="customerCode" hidden>
            <CInput placeholder="Mã KH" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Số thuê bao" name="phoneNumber" required>
            <CInput placeholder="Số thuê bao" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Serial SIM" name="serialNumber" required>
            <CInput placeholder="Số serial SIM" />
          </Form.Item>
        </Col>
      </Row>
    </fieldset>
  );
};

export default ThongTinKichHoat;
