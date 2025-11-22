import {
  CButtonClose,
  CButtonEdit,
  CButtonSave,
  CButtonSaveAndAdd,
  CInput,
  cleanUpString,
  CSwitch,
  IModeAction,
  MESSAGE,
  TitleHeader,
  usePermissions,
  UploadFileMax,
} from '@vissoft-react/common';
import { Col, Form, Row, Spin, Upload } from 'antd';
import { RcFile } from 'antd/es/upload';
import { PlusOutlined } from '@ant-design/icons';
import { memo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { pathRoutes } from '../../../../../src/routers';
import useConfigAppStore from '../../../Layouts/stores';
import { useLogicActionAgency } from './useLogicActionAgency';

export const AgencyAction = memo(() => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { menuData } = useConfigAppStore();
  const permission = usePermissions(menuData);
  const {
    form,
    loadingGetAgency,
    loadingAdd,
    loadingUpdate,
    loadingUploadImages,
    handleFinish,
    handleClose,
    Title,
    actionMode,
    setIsSubmitBack,
    agencyDetail,
  } = useLogicActionAgency();

  // Cleanup blob URLs khi component unmount (đã được xử lý trong useImageBlobUrls hook)
  return (
    <div className="flex flex-col w-full h-full">
      <TitleHeader>{Title}</TitleHeader>
      <Spin spinning={loadingGetAgency || loadingUploadImages}>
        <Form
          form={form}
          onFinish={handleFinish}
          labelAlign="left"
          labelCol={{ span: 5 }}
          labelWrap={true}
          validateTrigger={['onSubmit']}
          colon={false}
          initialValues={{
            status: 1,
          }}
        >
          <div className="bg-white rounded-[10px] px-6 pt-4 pb-8">
            <Row gutter={[30, 0]}>
              <Col span={12}>
                <Form.Item
                  label="Hoạt động"
                  name="status"
                  valuePropName="checked"
                >
                  <CSwitch disabled={IModeAction.UPDATE !== actionMode} />
                </Form.Item>
              </Col>
              <Col span={12}></Col>
              <Col span={12}>
                <Form.Item
                  label="Mã phòng"
                  name="orgCode"
                  required
                  rules={[
                    {
                      validator(_, value) {
                        if (!value) {
                          return Promise.reject(
                            'Không được để trống trường này'
                          );
                        } else {
                          return Promise.resolve();
                        }
                      },
                    },
                  ]}
                >
                  <CInput
                    placeholder="Nhập mã phòng"
                    maxLength={30}
                    disabled={actionMode === IModeAction.READ}
                    preventSpecialExceptHyphenAndUnderscore
                    preventSpace
                    preventVietnamese
                    uppercase
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Tên phòng"
                  name="orgName"
                  required
                  rules={[
                    {
                      validator(_, value) {
                        if (!value) {
                          return Promise.reject(
                            'Không được để trống trường này'
                          );
                        } else {
                          return Promise.resolve();
                        }
                      },
                    },
                  ]}
                >
                  <CInput
                    placeholder="Nhập tên phòng"
                    maxLength={100}
                    disabled={actionMode === IModeAction.READ}
                    onBlur={(e) => {
                      const value = cleanUpString(e.target.value);
                      form.setFieldValue('orgName', value);
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="Ảnh phòng"
                  name="images"
                  valuePropName="fileList"
                  getValueFromEvent={(e) => {
                    if (Array.isArray(e)) {
                      return e;
                    }
                    return e?.fileList;
                  }}
                >
                  <Upload
                    listType="picture-card"
                    multiple
                    beforeUpload={(file: RcFile) => {
                      const isImage = file.type?.startsWith('image/');
                      if (!isImage) {
                        form.setFields([
                          {
                            name: 'images',
                            errors: ['Chỉ được upload file ảnh'],
                          },
                        ]);
                        return Upload.LIST_IGNORE;
                      }
                      // UploadFileMax là số bytes, chuyển sang MB để so sánh
                      const maxSizeMB = UploadFileMax / 1024 / 1024;
                      const fileSizeMB = file.size / 1024 / 1024;
                      if (fileSizeMB > maxSizeMB) {
                        form.setFields([
                          {
                            name: 'images',
                            errors: [`Kích thước file không được vượt quá ${maxSizeMB.toFixed(2)}MB`],
                          },
                        ]);
                        return Upload.LIST_IGNORE;
                      }
                      form.setFields([
                        {
                          name: 'images',
                          errors: [],
                        },
                      ]);
                      return false; // Prevent auto upload
                    }}
                    disabled={actionMode === IModeAction.READ}
                    onRemove={(file) => {
                      // Khi xóa ảnh, cần xử lý cleanup nếu là ảnh từ server
                      if (file.url && file.url.startsWith('blob:')) {
                        // Không cần cleanup vì sẽ được cleanup khi component unmount
                      }
                      return true;
                    }}
                  >
                    {(form.getFieldValue('images')?.length || 0) < 10 && (
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
          <div className="flex gap-4 flex-wrap justify-end mt-7">
            {actionMode === IModeAction.CREATE && (
              <CButtonSaveAndAdd
                onClick={() => {
                  form.submit();
                }}
                loading={loadingAdd || loadingUpdate || loadingUploadImages}
                disabled={loadingAdd || loadingUpdate || loadingUploadImages}
              />
            )}
            {actionMode !== IModeAction.READ &&
              (permission.canUpdate || permission.canCreate) && (
                <CButtonSave
                  onClick={() => {
                    setIsSubmitBack(true);
                    form.submit();
                  }}
                  loading={loadingAdd || loadingUpdate || loadingUploadImages}
                  disabled={loadingAdd || loadingUpdate || loadingUploadImages}
                />
              )}
            {actionMode === IModeAction.READ && permission.canUpdate && (
              <CButtonEdit
                onClick={() => {
                  navigate(pathRoutes.agencyEdit(id || ''));
                }}
              />
            )}
            <CButtonClose onClick={handleClose} />
          </div>
        </Form>
      </Spin>
    </div>
  );
});
