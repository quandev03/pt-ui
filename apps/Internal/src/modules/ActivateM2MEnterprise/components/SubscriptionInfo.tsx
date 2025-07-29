import validateForm from '@react/utils/validator';
import { Col, Form, Row } from 'antd';
import { useState } from 'react';
import {
  CInput,
  CTextArea,
  CUploadFileTemplate,
} from '../../../../../../commons/src/lib/commons';
import { useGetFileTemplate } from '../hooks/useGetFileTemplate';

const ThongTinKichHoat = () => {
  const [isContract, setIsContract] = useState(false);
  const { mutate: getFileTemplate } = useGetFileTemplate(isContract);

  const handleExport = (url: string) => {
    if (url === 'SO') {
      setIsContract(false);
      getFileTemplate('mau_kich_hoat_M2M.xlsx');
    } else if (url === 'HD') {
      setIsContract(true);
      getFileTemplate('HOP_DONG_KH_DOANH_NGHIEP.docx');
    }
  };

  return (
    <fieldset>
      <legend>
        <span>Thông tin thuê bao kích hoạt</span>
      </legend>
      <Row gutter={12}>
        <Col span={12}>
          <Form.Item
            label="Loại thuê bao"
            name="subType"
            rules={[validateForm.required]}
            initialValue={'M2M'}
          >
            <CInput disabled={true} maxLength={50} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Tên thiết bị"
            name="deviceName"
            rules={[validateForm.maxLength(200)]}
          >
            <CInput placeholder="Nhập tên thiết bị" maxLength={200} />
          </Form.Item>
        </Col>
        <Col span={24}>
          <CUploadFileTemplate
            onDownloadTemplate={() => handleExport('SO')}
            accept={[
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ]}
            label="Upload file số"
            name={'isdnFile'}
            required
            labelCol={{ span: 3 }}
          />
        </Col>
        <Col span={24}>
          <CUploadFileTemplate
            onDownloadTemplate={() => handleExport('HD')}
            accept={['image/png', 'image/jpeg', 'image/jpg', 'application/pdf']}
            label="File hợp đồng/biên bản"
            name={'contract'}
            required
            labelCol={{ span: 3 }}
          />
        </Col>
        <Col span={24}>
          <Form.Item
            label="Ghi chú"
            name="note"
            rules={[validateForm.maxLength(200)]}
          >
            <CTextArea placeholder="Nhập ghi chú" maxLength={200} />
          </Form.Item>
        </Col>
      </Row>
    </fieldset>
  );
};

export default ThongTinKichHoat;
