import {
  CButtonClose,
  CButtonEdit,
  CButtonSave,
  CButtonSaveAndAdd,
  CInput,
  CSwitch,
  IModeAction,
  TitleHeader,
  usePermissions,
  CInputNumber,
  CSelect,
} from '@vissoft-react/common';
import { Col, Form, Row, Spin, TreeSelect } from 'antd';
import { memo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { pathRoutes } from '../../../../routers';
import useConfigAppStore from '../../../Layouts/stores';
import { useLogicActionRoomService } from './useLogicActionRoomService';
import { ServiceTypeOptions } from '../../constants/enum';
import { useGetAgencyOptions } from '../../../../hooks/useGetAgencyOptions';

export const RoomServiceAction = memo(() => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { menuData } = useConfigAppStore();
  const permission = usePermissions(menuData);
  const {
    form,
    loadingGetRoomService,
    loadingAdd,
    loadingUpdate,
    handleFinish,
    handleClose,
    Title,
    actionMode,
    setIsSubmitBack,
    showOtherFields,
  } = useLogicActionRoomService();

  const { data: agencyOptions = [] } = useGetAgencyOptions();

  return (
    <div className="flex flex-col w-full h-full">
      <TitleHeader>{Title}</TitleHeader>
      <Spin spinning={loadingGetRoomService}>
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
                  <CSwitch disabled={actionMode === IModeAction.READ} />
                </Form.Item>
              </Col>
              <Col span={12}></Col>
              <Col span={12}>
                <Form.Item
                  label="Phòng"
                  name="orgUnitId"
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
                  <TreeSelect
                    placeholder="Chọn phòng"
                    treeData={agencyOptions}
                    disabled={actionMode === IModeAction.READ}
                    showSearch
                    treeDefaultExpandAll
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Loại dịch vụ"
                  name="serviceType"
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
                    placeholder="Chọn loại dịch vụ"
                    options={ServiceTypeOptions}
                    disabled={actionMode === IModeAction.READ}
                  />
                </Form.Item>
              </Col>
              {showOtherFields && (
                <>
                  <Col span={12}>
                    <Form.Item
                      label="Mã dịch vụ"
                      name="serviceCode"
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
                        placeholder="Nhập mã dịch vụ"
                        maxLength={100}
                        disabled={actionMode === IModeAction.READ}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Tên dịch vụ"
                      name="serviceName"
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
                        placeholder="Nhập tên dịch vụ"
                        maxLength={200}
                        disabled={actionMode === IModeAction.READ}
                      />
                    </Form.Item>
                  </Col>
                </>
              )}
              <Col span={12}>
                <Form.Item
                  label="Giá"
                  name="price"
                  required
                  rules={[
                    {
                      validator(_, value) {
                        if (!value && value !== 0) {
                          return Promise.reject(
                            'Không được để trống trường này'
                          );
                        }
                        if (value < 0) {
                          return Promise.reject('Giá không được âm');
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <CInputNumber
                    placeholder="Nhập giá dịch vụ"
                    min={0}
                    disabled={actionMode === IModeAction.READ}
                    style={{ width: '100%' }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={(value) =>
                      value!.replace(/\$\s?|(,*)/g, '') as any
                    }
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
                  navigate(pathRoutes.roomServiceEdit(id || ''));
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

