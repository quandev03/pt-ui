import validateForm from '@react/utils/validator';
import { Checkbox, Col, Form, Row, Typography } from 'antd';
import React, { useState } from 'react';
import ModalPdf from '../ModalPdf';

type Props = {
  pdfBlobUrl: any;
};
const FormCheckND13: React.FC<Props> = ({ pdfBlobUrl }) => {
  const [isOpenPdf, setIsOpenPdf] = useState<boolean>(false);

  const handlePreview = () => {
    setIsOpenPdf(true);
  };
  return (
    <fieldset>
      <legend>
        <Checkbox checked={true} disabled></Checkbox>Đồng ý chia sẻ dữ liệu theo
        NĐ13
      </legend>
      <Row gutter={12}>
        <Col span={12}>
          <Form.Item
            label="Biên bản xác nhận"
            name="fileND13"
            rules={[validateForm.required]}
          >
            <Typography.Link underline target="_blank" onClick={handlePreview}>
              Biên_bản_xác_nhận_NĐ13
            </Typography.Link>
          </Form.Item>
        </Col>
      </Row>
      {isOpenPdf && (
        <ModalPdf
          isOpen={isOpenPdf}
          setIsOpen={setIsOpenPdf}
          isSigned={false}
          pdfUrl={pdfBlobUrl}
        />
      )}
    </fieldset>
  );
};
export default FormCheckND13;
