import { Col, Form, Row, Tooltip } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { FocusEvent, useRef } from 'react';
import usePartnerStore from '../stores';
import { ChildRef } from '../types';
import FileUpload from './FileUpload';
import {
  CDatePicker,
  CInput,
  cleanUpPhoneNumber,
  CSelect,
  CTextArea,
  emailRegex,
  formatDate,
  handlePasteRemoveSpace,
  ImageFileType,
  IModeAction,
  useActionMode,
  validateForm,
} from '@vissoft-react/common';
import { RotateCcw } from 'lucide-react';
import useConfigAppStore from '../../Layouts/stores';

const PartnerInfor = () => {
  const contractFileRef = useRef<ChildRef>(null);
  const businessLicenseFileRef = useRef<ChildRef>(null);
  const actionMode = useActionMode();
  const form = Form.useFormInstance();
  const taxCode: string = useWatch('taxCode', form) ?? '';
  const { partnerDetail, setPartnerDetail } = usePartnerStore();

  const {
    params: { PARTNER_TYPE = [], PARTNER_SUB_TYPE = [] },
  } = useConfigAppStore();

  const handleBlur = (e: FocusEvent<HTMLInputElement>, field: string) => {
    form.setFieldValue(field, e.target.value.trim());
    form.validateFields([field]);
  };

  const handleRefreshPartnerInfor = () => {
    form.resetFields(['contractFile', 'businessLicenseFile']);
    if (partnerDetail) {
      setPartnerDetail({
        ...partnerDetail,
        contractNoFileUrl: undefined,
        businessLicenseFileUrl: undefined,
        contractNoFileLink: undefined,
        businessLicenseFileLink: undefined,
      });
    }
    contractFileRef.current?.clearImage();
    businessLicenseFileRef.current?.clearImage();
  };

  return (
    <div className="border rounded-md p-5 relative">
      <div className="text-lg !text-[#076AB3] font-bold flex gap-4 bg-white absolute -top-[15px]">
        <div>Thông Tin</div>
        {actionMode !== IModeAction.READ && (
          <Tooltip title="Làm mới">
            <RotateCcw
              className="cursor-pointer self-center"
              onClick={handleRefreshPartnerInfor}
            />
          </Tooltip>
        )}
      </div>
      <Row gutter={[30, 0]}>
        <Col span={24}>
          <div className="w-full ">
            <div className="flex !w-2/4 m-auto">
              <Col span={12}>
                <FileUpload
                  imageUrl={partnerDetail?.contractNoFileLink}
                  label="Upload file hợp đồng"
                  name="contractFile"
                  disabled={actionMode === IModeAction.READ}
                  showIconRequired={false}
                  required={false}
                  fileAccess={[...ImageFileType, 'application/pdf']}
                  messageErrorFormat="File hợp đồng không đúng định dạng"
                  ref={contractFileRef}
                  mimeType={
                    partnerDetail?.contractNoFileUrl?.endsWith('.pdf')
                      ? 'application/pdf'
                      : 'application/octet-stream'
                  }
                />
              </Col>
              <Col span={12}>
                <FileUpload
                  imageUrl={partnerDetail?.businessLicenseFileLink}
                  label="Upload file ảnh ĐKKD"
                  name="businessLicenseFile"
                  disabled={actionMode === IModeAction.READ}
                  showIconRequired={false}
                  required={false}
                  ref={businessLicenseFileRef}
                />
              </Col>
            </div>
          </div>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Loại đối tác"
            name="orgSubType"
            required
            rules={[
              {
                validator(_, value) {
                  if (!value) {
                    return Promise.reject('Không được để trống trường này');
                  } else {
                    return Promise.resolve();
                  }
                },
              },
            ]}
          >
            <CSelect
              placeholder="Chọn loại đối tác"
              options={PARTNER_TYPE ?? []}
              disabled={actionMode === IModeAction.READ}
              allowClear={false}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Kiểu đối tác"
            name="orgPartnerType"
            required
            rules={[
              {
                validator(_, value) {
                  if (!value) {
                    return Promise.reject('Không được để trống trường này');
                  } else {
                    return Promise.resolve();
                  }
                },
              },
            ]}
          >
            <CSelect
              placeholder="Chọn kiểu đối tác"
              options={PARTNER_SUB_TYPE ?? []}
              disabled={actionMode === IModeAction.READ}
              allowClear={false}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Mã đối tác"
            name="orgCode"
            required
            rules={[validateForm.required]}
          >
            <CInput
              placeholder="Nhập mã đối tác"
              maxLength={5}
              disabled={actionMode !== IModeAction.CREATE}
              preventSpecial
              preventVietnamese
              uppercase
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Tên đối tác"
            name="orgName"
            required
            rules={[
              {
                validator(_, value) {
                  if (!value) {
                    return Promise.reject('Không được để trống trường này');
                  } else {
                    return Promise.resolve();
                  }
                },
              },
            ]}
          >
            <CInput
              placeholder="Nhập tên đối tác"
              maxLength={100}
              disabled={actionMode === IModeAction.READ}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Số hợp đồng" name="contractNo">
            <CInput
              placeholder="Nhập số hợp đồng"
              maxLength={50}
              disabled={actionMode === IModeAction.READ}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Mã số thuế"
            name="taxCode"
            required
            rules={[
              {
                validator(_, value: string) {
                  if (!value) {
                    return Promise.reject('Không được để trống trường này');
                  } else {
                    if (
                      value.length === 10 ||
                      value.length === 14 ||
                      value.length === 13
                    ) {
                      return Promise.resolve();
                    }
                    return Promise.reject('Mã số thuế không đúng định dạng');
                  }
                },
              },
            ]}
          >
            <CInput
              placeholder="Nhập mã số thuế"
              onlyNumber
              preventSpace
              maxLength={taxCode.includes('-') ? 14 : 13}
              disabled={actionMode === IModeAction.READ}
              onBlur={(e) => {
                const value = e.target.value;
                if (value.length === 13) {
                  const formattedValue = `${value.slice(0, -3)}-${value.slice(
                    -3
                  )}`;
                  form.setFieldsValue({ taxCode: formattedValue });
                }
              }}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Ngày hiệu lực hợp đồng"
            name="contractDate"
            required
            validateTrigger={['onBlur']}
            rules={[
              {
                validator(_, value: string) {
                  if (!value) {
                    return Promise.reject('Không được để trống trường này');
                  } else {
                    return Promise.resolve();
                  }
                },
              },
            ]}
          >
            <CDatePicker
              placeholder="Chọn ngày hiệu lực hợp đồng"
              format={formatDate}
              disabled={actionMode === IModeAction.READ}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label={'Email'}
            name="email"
            required
            rules={[
              {
                validator(_, value) {
                  if (!value) {
                    return Promise.reject('Không được để trống trường này');
                  } else if (!emailRegex.test(value)) {
                    return Promise.reject('Email không đúng định dạng');
                  } else {
                    return Promise.resolve();
                  }
                },
              },
            ]}
          >
            <CInput
              placeholder="Nhập email"
              onBlur={(e) => {
                handleBlur(e, 'email');
              }}
              onPaste={(event) => handlePasteRemoveSpace(event, 100)}
              maxLength={100}
              disabled={actionMode === IModeAction.READ}
              onInput={(e: any) =>
                (e.target.value = cleanUpPhoneNumber(e.target.value))
              }
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="TK ngân hàng" name="orgBankAccountNo">
            <CInput
              placeholder="Nhập tài khoản ngân hàng"
              maxLength={50}
              disabled={actionMode === IModeAction.READ}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            required
            rules={[validateForm.required]}
          >
            <CInput
              onlyNumber
              preventSpace
              maxLength={12}
              placeholder="Nhập số điện thoại"
              disabled={actionMode === IModeAction.READ}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Địa chỉ GPĐKKD" name="businessLicenseAddress">
            <CInput
              maxLength={100}
              placeholder="Nhập địa chỉ GPĐKKD"
              disabled={actionMode === IModeAction.READ}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Mô tả" name="orgDescription">
            <CTextArea
              maxLength={200}
              placeholder="Nhập mô tả"
              autoSize={{ minRows: 1, maxRows: 2 }}
              disabled={actionMode === IModeAction.READ}
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

export default PartnerInfor;
