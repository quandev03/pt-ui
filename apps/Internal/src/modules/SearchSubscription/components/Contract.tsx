import CInput from '@react/commons/Input';
import { Card, Col, Form, Row } from 'antd';
import { useState } from 'react';
import FileModal from './FileModal';
import useSubscriptionStore from '../store';
import IdentificationModal from './IdentificationModal';
import { useIsAdmin } from '../hooks/useIsAdmin';
import { CViewLinkInput } from '@react/commons/index';

const Contract: React.FC = () => {
  const [isOpenFile, setIsOpenFile] = useState(false);
  const isAdmin = useIsAdmin();
  const { isIdentification } = useSubscriptionStore();
  const [isOpenIdentification, setIsOpenIdentification] = useState(false);

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
              onView={() =>
                isAdmin || isIdentification
                  ? setIsOpenFile(true)
                  : setIsOpenIdentification(true)
              }
            />
          </Form.Item>
        </Col>
      </Row>
      <IdentificationModal
        isOpen={isOpenIdentification}
        setIsOpen={setIsOpenIdentification}
        callback={() => setIsOpenFile(true)}
      />
      <FileModal
        isOpen={isOpenFile}
        setIsOpen={setIsOpenFile}
        name="fileContract"
      />
    </Card>
  );
};

export default Contract;
