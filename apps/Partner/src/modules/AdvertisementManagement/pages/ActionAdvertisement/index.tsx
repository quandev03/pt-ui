import {
  CButtonClose,
  CButtonEdit,
  CButtonSave,
  CButtonSaveAndAdd,
  CInput,
  CSelect,
  CTextArea,
  IModeAction,
  MESSAGE,
  TitleHeader,
  cleanUpString,
  usePermissions,
  UploadFileMax,
} from '@vissoft-react/common';
import { Col, Form, Row, Spin, Upload, DatePicker } from 'antd';
import { RcFile } from 'antd/es/upload';
import { PlusOutlined } from '@ant-design/icons';
import { memo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { pathRoutes } from '../../../../../src/routers';
import useConfigAppStore from '../../../Layouts/stores';
import { useLogicActionAdvertisement } from './useLogicActionAdvertisement';
import { AdvertisementStatusOptions } from '../../constants/enum';
import dayjs from 'dayjs';

export const ActionAdvertisement = memo(() => {
  const navigate = useNavigate();
  const {
    form,
    loadingGetAdvertisement,
    handleFinish,
    handleClose,
    Title,
    actionMode,
    setIsSubmitBack,
    loadingAdd,
    loadingUpdate,
  } = useLogicActionAdvertisement();
  const { id } = useParams();
  const { menuData } = useConfigAppStore();
  const permission = usePermissions(menuData);

  return (
    <div className="flex flex-col w-full h-full">
      <TitleHeader>{Title}</TitleHeader>
      <Spin spinning={loadingGetAdvertisement}>
        <Form
          form={form}
          onFinish={handleFinish}
          labelAlign="left"
          labelCol={{ span: 5 }}
          labelWrap={true}
          validateTrigger={['onSubmit']}
          colon={false}
          initialValues={{
            status: 'DRAFT',
          }}
        >
          <div className="bg-white rounded-[10px] px-6 pt-4 pb-8">
            <Row gutter={[30, 0]}>
              <Col span={24}>
                <Form.Item
                  label="Tiêu đề"
                  name="title"
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
                    placeholder="Nhập tiêu đề quảng cáo"
                    maxLength={200}
                    disabled={actionMode === IModeAction.READ}
                    onBlur={(e) => {
                      const value = cleanUpString(e.target.value);
                      form.setFieldValue('title', value);
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="Nội dung"
                  name="content"
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
                  <CTextArea
                    placeholder="Nhập nội dung quảng cáo"
                    rows={6}
                    maxLength={2000}
                    disabled={actionMode === IModeAction.READ}
                    onBlur={(e) => {
                      const value = cleanUpString(e.target.value);
                      form.setFieldValue('content', value);
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="Ảnh quảng cáo"
                  name="image"
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
                    maxCount={1}
                    beforeUpload={(file: RcFile) => {
                      const isImage = file.type?.startsWith('image/');
                      if (!isImage) {
                        form.setFields([
                          {
                            name: 'image',
                            errors: ['Chỉ được upload file ảnh'],
                          },
                        ]);
                        return Upload.LIST_IGNORE;
                      }
                      const maxSizeMB = UploadFileMax / 1024 / 1024;
                      const fileSizeMB = file.size / 1024 / 1024;
                      if (fileSizeMB > maxSizeMB) {
                        form.setFields([
                          {
                            name: 'image',
                            errors: [
                              `Kích thước file không được vượt quá ${maxSizeMB.toFixed(2)}MB`,
                            ],
                          },
                        ]);
                        return Upload.LIST_IGNORE;
                      }
                      form.setFields([
                        {
                          name: 'image',
                          errors: [],
                        },
                      ]);
                      return false; // Prevent auto upload
                    }}
                    disabled={actionMode === IModeAction.READ}
                  >
                    {(form.getFieldValue('image')?.length || 0) < 1 && (
                      <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </div>
                    )}
                  </Upload>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Ngày bắt đầu"
                  name="startDate"
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
                  <DatePicker
                    style={{ width: '100%' }}
                    format="DD/MM/YYYY HH:mm"
                    showTime
                    disabled={actionMode === IModeAction.READ}
                    disabledDate={(current) => {
                      return current && current < dayjs().startOf('day');
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Ngày kết thúc"
                  name="endDate"
                  required
                  dependencies={['startDate']}
                  rules={[
                    {
                      validator(_, value) {
                        if (!value) {
                          return Promise.reject(
                            'Không được để trống trường này'
                          );
                        }
                        const startDate = form.getFieldValue('startDate');
                        if (startDate && value && dayjs(value).isBefore(dayjs(startDate))) {
                          return Promise.reject(
                            'Ngày kết thúc phải sau ngày bắt đầu'
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    format="DD/MM/YYYY HH:mm"
                    showTime
                    disabled={actionMode === IModeAction.READ}
                    disabledDate={(current) => {
                      const startDate = form.getFieldValue('startDate');
                      if (startDate) {
                        return current && current < dayjs(startDate);
                      }
                      return current && current < dayjs().startOf('day');
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Trạng thái"
                  name="status"
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
                  <CSelect
                    placeholder="Chọn trạng thái"
                    options={AdvertisementStatusOptions}
                    disabled={actionMode === IModeAction.READ}
                  />
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
                loading={loadingAdd || loadingUpdate}
                disabled={loadingAdd || loadingUpdate}
              />
            )}
            {actionMode !== IModeAction.READ &&
              (permission.canUpdate || permission.canCreate) && (
                <CButtonSave
                  onClick={() => {
                    setIsSubmitBack(true);
                    form.submit();
                  }}
                  loading={loadingAdd || loadingUpdate}
                  disabled={loadingAdd || loadingUpdate}
                />
              )}
            {actionMode === IModeAction.READ && permission.canUpdate && (
              <CButtonEdit
                onClick={() => {
                  navigate(pathRoutes.advertisementManagementEdit(id || ''));
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

