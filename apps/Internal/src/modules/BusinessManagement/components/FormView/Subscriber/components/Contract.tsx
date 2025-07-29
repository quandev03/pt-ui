import CInput from '@react/commons/Input';
import { Card, Col, Form, Row } from 'antd';
import { useState } from 'react';
import { CViewLinkInput } from '@react/commons/index';
import FileModal from 'apps/Internal/src/modules/SearchSubscription/components/FileModal';

const Contract: React.FC = () => {
  const [isOpenFile, setIsOpenFile] = useState(false);

  return (
    <Card>
      <legend className="!mb-5">Thông tin hợp đồng</legend>
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item label="Số BBXN/Hợp đồng" name="contractNo">
            <CInput disabled />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="File BBXN/Hợp đồng" name="fileContract">
            <CViewLinkInput
              children="File BBXN/Hợp đồng"
              onView={() => setIsOpenFile(true)}
            />
          </Form.Item>
        </Col>
      </Row>
      <FileModal
        isOpen={isOpenFile}
        setIsOpen={setIsOpenFile}
        name="fileContract"
      />
    </Card>
  );
};

export default Contract;
