import {
  CInput,
  CTextArea,
  IModeAction,
  useActionMode,
  validateForm,
} from '@vissoft-react/common';
import { Col, Form, Row } from 'antd';

const PartnerInfor = () => {
  const actionMode = useActionMode();
  const handleBlurOrgCode = () => {
    console.log('blur');
  };
  return (
    <div className="relative p-5 border rounded-md">
      <div className="text-lg !text-[#076AB3] font-bold flex gap-4 bg-white absolute -top-[15px]">
        <div>Thông tin đối tác</div>
      </div>
      <Row gutter={[30, 0]}>
        <Col span={12}>
          <Form.Item
            label="Mã đối tác"
            name="orgCode"
            required
            rules={[validateForm.required]}
          >
            <CInput
              placeholder="Nhập mã đối tác"
              maxLength={30}
              disabled={actionMode !== IModeAction.CREATE}
              preventSpecial
              preventVietnamese
              uppercase
              onBlur={handleBlurOrgCode}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Tên đối tác" name="orgName">
            <CTextArea placeholder="Nhập tên đối tác" disabled />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Mã số thuế" name="taxCode">
            <CInput placeholder="Nhập mã số thuế" disabled />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Số điện thoại" name="phone">
            <CInput placeholder="Nhập số điện thoại" disabled />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Địa chỉ" name="address">
            <CTextArea placeholder="Nhập địa chỉ" disabled />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Họ tên người liên hệ" name="name">
            <CInput placeholder="Nhập họ tên người liên hệ" disabled />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Trạng thái" name="status">
            <CInput placeholder="Nhập trạng thái" disabled />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Mô tả" name="name">
            <CTextArea placeholder="Nhập mô tả" maxLength={200} />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

export default PartnerInfor;
