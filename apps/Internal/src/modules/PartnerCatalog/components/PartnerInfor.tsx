import {
  CInput,
  CTextArea,
  IFieldErrorsItem,
  IModeAction,
  StatusEnum,
  useActionMode,
  validateForm,
} from '@vissoft-react/common';
import { Col, Form, Row } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { useGetPartnerInfoByCode } from '../hook';
import { IPartner } from '../types';

const PartnerInfor = () => {
  const actionMode = useActionMode();
  const form = useFormInstance();
  const onGetPartnerSuccess = (data: IPartner) => {
    form.setFieldsValue({
      orgName: data.orgName,
      taxCode: data.taxCode,
      phone: data.phone,
      address: data.address,
      representative: data.representative,
      status:
        data.status === StatusEnum.ACTIVE ? 'Hoạt động' : 'Không hoạt động',
      orgDescription: data.orgDescription,
      provinceCode: data.provinceCode,
      parentCode: data.parentCode,
    });
  };
  const onGetPartnerError = (error: IFieldErrorsItem[]) => {
    form.setFields(
      error.map((err) => ({ name: err.field, error: err.detail }))
    );
  };
  const { mutate: getPartnerInfoByCode } = useGetPartnerInfoByCode(
    (data) => onGetPartnerSuccess(data),
    (error: IFieldErrorsItem[]) => onGetPartnerError(error)
  );
  const handleGetPartnerInfo = () => {
    const orgCode = form.getFieldValue('orgCode');
    if (orgCode) getPartnerInfoByCode(orgCode);
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
              onBlur={handleGetPartnerInfo}
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
          <Form.Item label="Mã đại lý cha" name="parentCode">
            <CInput placeholder="Nhập mã đại lý cha" disabled />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Mã tỉnh" name="provinceCode">
            <CInput placeholder="Nhập mã tỉnh" disabled />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Địa chỉ" name="address">
            <CTextArea placeholder="Nhập địa chỉ" disabled />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Họ tên người liên hệ" name="representative">
            <CInput placeholder="Nhập họ tên người liên hệ" disabled />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Trạng thái" name="status">
            <CInput placeholder="Nhập trạng thái" disabled />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Mô tả" name="orgDescription">
            <CTextArea
              placeholder="Nhập mô tả"
              maxLength={200}
              disabled={actionMode === IModeAction.READ}
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

export default PartnerInfor;
