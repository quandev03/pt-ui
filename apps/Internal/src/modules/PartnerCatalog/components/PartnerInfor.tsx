import { CInput, CTextArea, IModeAction, useActionMode, validateForm } from '@vissoft-react/common';
import { Col, Form, Row, Select, Switch, ConfigProvider } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { useCommunes, useProvinces } from '../hook';
import { FocusEvent } from 'react';

const PartnerInfor = () => {
  const actionMode = useActionMode();
  const form = useFormInstance();
  const handleBlur = (e: FocusEvent<HTMLInputElement>, field: string) => {
    form.setFieldValue(field, e.target.value.trim());
    form.validateFields([field]);
  };
  const { data: provincesData, isLoading: loadingProvinces } = useProvinces();
  const provinceOptions = (provincesData?.provinces || []).map((p) => ({
    label: p.name,
    value: p.code,
  }));

  const selectedProvince = Form.useWatch('provinceCode', form);
  const { data: communesData, isLoading: loadingCommunes } = useCommunes(selectedProvince);
  const communeOptions = (communesData?.communes || []).map((c) => ({
    label: c.name,
    value: c.code,
  }));

  return (
    <div className="relative p-5 border rounded-md">
      <div className="text-lg !text-[#076AB3] font-bold flex gap-4 bg-white absolute -top-[15px]">
        <div>Thông tin đối tác</div>
      </div>
      <Row gutter={[30, 0]}>
        <Col span={12}>
          <Form.Item label="Hoạt động" name="status" valuePropName="checked">
            <ConfigProvider
              theme={{
                components: {
                  Switch: {
                    colorPrimary: '#64a858',
                    colorPrimaryHover: '#57944d',
                  },
                },
              }}
            >
              <Switch disabled={actionMode === IModeAction.READ} />
            </ConfigProvider>
          </Form.Item>
        </Col>
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
              onBlur={(e) => {
                handleBlur(e, 'orgCode');
              }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Loại đối tác"
            name="orgType"
            required
            rules={[validateForm.required]}
          >
            <Select
              placeholder="Chọn loại đối tác"
              options={[
                { label: 'Nhà Trọ', value: 1 },
                { label: 'Dịch vụ', value: 2 },
              ]}
              disabled={actionMode === IModeAction.READ}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Tên đối tác" name="orgName">
            <CTextArea placeholder="Nhập tên đối tác" disabled={actionMode === IModeAction.READ} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Mã số thuế" name="taxCode">
            <CInput placeholder="Nhập mã số thuế" disabled={actionMode === IModeAction.READ} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Số điện thoại" name="phone">
            <CInput placeholder="Nhập số điện thoại" disabled={actionMode === IModeAction.READ} />
          </Form.Item>
        </Col>
        

        <Col span={12}>
          <Form.Item label="Tỉnh/Thành phố" name="provinceCode" rules={[validateForm.required]}>
            <Select
              options={provinceOptions}
              loading={loadingProvinces}
              placeholder="Chọn tỉnh/thành phố"
              disabled={actionMode === IModeAction.READ}
              showSearch
              optionFilterProp="label"
              onChange={() => {
                form.setFieldValue('wardCode', undefined);
              }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Xã/Phường" name="wardCode" rules={[validateForm.required]}>
            <Select
              options={communeOptions}
              loading={loadingCommunes}
              placeholder="Chọn xã/phường"
              disabled={actionMode === IModeAction.READ || !selectedProvince}
              showSearch
              optionFilterProp="label"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Địa chỉ chi tiết" name="address">
            <CTextArea placeholder="Nhập địa chỉ chi tiết" disabled={actionMode === IModeAction.READ} />
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
