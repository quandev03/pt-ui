import CInput from '@react/commons/Input';
import { Card, Col, Form, Row } from 'antd';

const Enterprise: React.FC = () => {
  return (
    <Card>
      <legend className="!mb-5">Thông tin doanh nghiệp</legend>
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item label="Mã số thuế" name="taxCode">
            <CInput disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Tên doanh nghiệp" name="enterpriseName">
            <CInput disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Người phụ trách" name="representativeName">
            <CInput disabled />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};

export default Enterprise;
