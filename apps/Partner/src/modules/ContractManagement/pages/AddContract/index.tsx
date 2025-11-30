import {
  CButton,
  CButtonClose,
  CInput,
  TitleHeader,
  CDatePicker,
} from '@vissoft-react/common';
import { Col, Form, Row, Upload, Card, Spin, TreeSelect } from 'antd';
import { memo } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/es/upload';
import { useLogicAddContract, StepEnum } from './useLogicAddContract';
import { useGetAgencyOptions } from '../../../../hooks/useGetAgencyOptions';
import dayjs from 'dayjs';

export const AddContract = memo(() => {
  const {
    form,
    currentStep,
    ocrData,
    contractFileUrl,
    contractFileType,
    loadingOCR,
    loadingGenContract,
    loadingSave,
    handleNext,
    handleBack,
    handleClose,
    handleRegenContract,
    handleSaveContract,
    validateImageFile,
  } = useLogicAddContract();

  const { data: agencyOptions = [] } = useGetAgencyOptions();

  const renderStepContent = () => {
    switch (currentStep) {
      case StepEnum.STEP1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Bước 1: Upload ảnh giấy tờ</h3>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Form.Item
                  label="Mặt trước CCCD"
                  name="front"
                  valuePropName="fileList"
                  getValueFromEvent={(e) => {
                    if (Array.isArray(e)) {
                      return e;
                    }
                    return e?.fileList;
                  }}
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng upload ảnh mặt trước',
                    },
                  ]}
                >
                  <Upload
                    listType="picture-card"
                    maxCount={1}
                    multiple={false}
                    beforeUpload={(file: RcFile) => {
                      if (!validateImageFile(file)) {
                        return Upload.LIST_IGNORE;
                      }
                      return false;
                    }}
                    onChange={(info) => {
                      // Đảm bảo chỉ giữ lại file mới nhất
                      if (info.fileList.length > 1) {
                        info.fileList = [info.fileList[info.fileList.length - 1]];
                      }
                    }}
                    onRemove={() => {
                      form.setFieldValue('front', []);
                      return true;
                    }}
                  >
                    {(form.getFieldValue('front')?.length || 0) < 1 && (
                      <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </div>
                    )}
                  </Upload>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Mặt sau CCCD"
                  name="back"
                  valuePropName="fileList"
                  getValueFromEvent={(e) => {
                    if (Array.isArray(e)) {
                      return e;
                    }
                    return e?.fileList;
                  }}
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng upload ảnh mặt sau',
                    },
                  ]}
                >
                  <Upload
                    listType="picture-card"
                    maxCount={1}
                    multiple={false}
                    beforeUpload={(file: RcFile) => {
                      if (!validateImageFile(file)) {
                        return Upload.LIST_IGNORE;
                      }
                      return false;
                    }}
                    onChange={(info) => {
                      // Đảm bảo chỉ giữ lại file mới nhất
                      if (info.fileList.length > 1) {
                        info.fileList = [info.fileList[info.fileList.length - 1]];
                      }
                    }}
                    onRemove={() => {
                      form.setFieldValue('back', []);
                      return true;
                    }}
                  >
                    {(form.getFieldValue('back')?.length || 0) < 1 && (
                      <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </div>
                    )}
                  </Upload>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Ảnh chân dung"
                  name="portrait"
                  valuePropName="fileList"
                  getValueFromEvent={(e) => {
                    if (Array.isArray(e)) {
                      return e;
                    }
                    return e?.fileList;
                  }}
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng upload ảnh chân dung',
                    },
                  ]}
                >
                  <Upload
                    listType="picture-card"
                    maxCount={1}
                    multiple={false}
                    beforeUpload={(file: RcFile) => {
                      if (!validateImageFile(file)) {
                        return Upload.LIST_IGNORE;
                      }
                      return false;
                    }}
                    onChange={(info) => {
                      // Đảm bảo chỉ giữ lại file mới nhất
                      if (info.fileList.length > 1) {
                        info.fileList = [info.fileList[info.fileList.length - 1]];
                      }
                    }}
                    onRemove={() => {
                      form.setFieldValue('portrait', []);
                      return true;
                    }}
                  >
                    {(form.getFieldValue('portrait')?.length || 0) < 1 && (
                      <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </div>
                    )}
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
          </div>
        );

      case StepEnum.STEP2:
        const ocrFront = ocrData?.data_ocr?.ocr_front;
        if (!ocrFront) {
          return (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">
                Bước 2: Xác nhận thông tin từ OCR
              </h3>
              <div className="text-center text-red-500">
                Không có dữ liệu OCR để hiển thị
              </div>
            </div>
          );
        }
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">
              Bước 2: Xác nhận thông tin từ OCR
            </h3>
            <Spin spinning={loadingOCR}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item label="Họ và tên" name="name">
                    <CInput readOnly />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Số CCCD" name="idCard">
                    <CInput readOnly />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Địa chỉ" name="address">
                    <CInput readOnly />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Ngày cấp" name="issueDate">
                    <CInput readOnly />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Nơi cấp" name="issueBy">
                    <CInput readOnly />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Số điện thoại" name="phone">
                    <CInput placeholder="Nhập số điện thoại" />
                  </Form.Item>
                </Col>
              </Row>
            </Spin>
          </div>
        );

      case StepEnum.STEP3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Bước 3: Chọn phòng</h3>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  label="Phòng"
                  name="roomId"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng chọn phòng',
                    },
                  ]}
                >
                  <TreeSelect
                    placeholder="Chọn phòng"
                    treeData={agencyOptions}
                    showSearch
                    treeDefaultExpandAll
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Thời gian bắt đầu" name="startDate">
                  <CDatePicker
                    style={{ width: '100%' }}
                    placeholder="Chọn ngày bắt đầu"
                    format="DD/MM/YYYY"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Thời gian kết thúc" name="endDate">
                  <CDatePicker
                    style={{ width: '100%' }}
                    placeholder="Chọn ngày kết thúc"
                    format="DD/MM/YYYY"
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
        );

      case StepEnum.STEP4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">
              Bước 4: Tạo và lưu hợp đồng
            </h3>
            <Spin spinning={loadingGenContract} tip="Đang tạo hợp đồng...">
              <Row gutter={[16, 16]}>
                {contractFileUrl ? (
                  <Col span={24}>
                    <Card title="Hợp đồng đã tạo" className="mt-4">
                      {(() => {
                        // Kiểm tra type thực tế của file
                        const isDocx = contractFileType?.includes('wordprocessingml') || 
                                      contractFileType?.includes('docx') || 
                                      contractFileType?.includes('msword');
                        const isPdf = contractFileType?.includes('pdf') || !contractFileType || contractFileType === '';
                        
                        return isDocx ? (
                        // File DOCX - không thể hiển thị trực tiếp trong browser, chỉ cho download
                        <div className="text-center py-12 border border-gray-300 rounded">
                          <div className="mb-4">
                            <svg
                              className="mx-auto h-16 w-16 text-blue-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <p className="text-lg font-semibold text-gray-700 mb-2">
                            File hợp đồng đã được tạo thành công
                          </p>
                          <p className="text-sm text-gray-500 mb-4">
                            Định dạng: DOCX (Microsoft Word)
                          </p>
                          <p className="text-sm text-gray-600">
                            Vui lòng tải xuống để xem và chỉnh sửa nội dung hợp đồng
                          </p>
                        </div>
                        ) : (
                          // File PDF - hiển thị trực tiếp
                          <iframe
                            src={contractFileUrl}
                            style={{ width: '100%', height: '600px', border: '1px solid #d9d9d9' }}
                            title="Contract Preview"
                          />
                        );
                      })()}
                      <div className="mt-4 flex gap-2">
                        <CButton
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = contractFileUrl;
                            link.download = contractFileType.includes('wordprocessingml') || contractFileType.includes('docx') 
                              ? 'contract.docx' 
                              : 'contract.pdf';
                            link.click();
                          }}
                        >
                          Tải xuống
                        </CButton>
                        <CButton onClick={handleRegenContract} disabled={loadingGenContract}>
                          Tạo lại hợp đồng
                        </CButton>
                      </div>
                    </Card>
                  </Col>
                ) : loadingGenContract ? (
                  <Col span={24}>
                    <div className="text-center text-gray-500 py-8">
                      <p>Đang tạo hợp đồng, vui lòng đợi...</p>
                    </div>
                  </Col>
                ) : (
                  <Col span={24}>
                    <div className="text-center text-gray-500 py-8">
                      <p>Chưa có hợp đồng. Vui lòng đợi hệ thống tạo hợp đồng...</p>
                    </div>
                  </Col>
                )}
              </Row>
            </Spin>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      <TitleHeader>Thêm hợp đồng mới</TitleHeader>
      <Form
        form={form}
        layout="vertical"
        className="bg-white rounded-[10px] px-6 pt-4 pb-8 mt-4"
        initialValues={{
          startDate: dayjs(),
          endDate: dayjs().add(1, 'year'),
        }}
      >
        {/* Progress indicator */}
        <div className="flex gap-[10px] justify-between mt-1 mb-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className={`h-[5px] rounded-lg flex-1 ${
                index <= currentStep
                  ? 'bg-[#3371cd]'
                  : 'bg-[#E8F2FF]'
              }`}
            />
          ))}
        </div>

        {renderStepContent()}

        <div className="flex gap-4 flex-wrap justify-end mt-7">
          {currentStep > StepEnum.STEP1 && (
            <CButton onClick={handleBack}>Quay lại</CButton>
          )}
          {currentStep < StepEnum.STEP3 && (
            <CButton
              onClick={handleNext}
              loading={loadingOCR}
              disabled={loadingOCR}
            >
              Tiếp theo
            </CButton>
          )}
          {currentStep === StepEnum.STEP3 && (
            <CButton
              onClick={handleNext}
            >
              Tiếp theo
            </CButton>
          )}
          {currentStep === StepEnum.STEP4 && (
            <CButton
              onClick={handleSaveContract}
              loading={loadingSave}
              disabled={loadingSave || loadingGenContract || !contractFileUrl}
            >
              Lưu hợp đồng
            </CButton>
          )}
          <CButtonClose onClick={handleClose} />
        </div>
      </Form>
    </div>
  );
});

